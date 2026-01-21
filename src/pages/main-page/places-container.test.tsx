import {configureMockStore} from '@jedmao/redux-mock-store';
import {fireEvent, render, screen} from '@testing-library/react';
import {ReactNode} from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import {CityName} from '../../shared/entities/city/types.ts';
import {OfferSortOption} from '../../shared/entities/offer/constants';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {RoutePath} from '../../shared/enums/routes';
import {axiosClient} from '../../shared/server/constants.ts';
import {changeFavoriteStatus} from '../../slices/favorites-page-slice/favorites-page-slice';
import {setActiveOffer, setOffersSort} from '../../slices/offers-slice/offers-slice';
import {PlacesContainer} from './places-container';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    // @ts-expect-error error due to dynamic import
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../components/offer-card-list/offer-card-list.tsx', () => ({
  OfferCardList: (
    {onCardHover, onChangeFavoriteStatus}: {
      onCardHover: (s: string) => void;
      onChangeFavoriteStatus: (s: string, n: number) => void;
    }
  ) => (
    <div data-testid="offer-card-list">
      <button
        data-testid="hover-trigger"
        onClick={() => onCardHover('offer-1')}
      />
      <button
        data-testid="fav-trigger"
        onClick={() => onChangeFavoriteStatus('offer-1', 1)}
      />
    </div>
  )
}));

vi.mock('../../components/selector-widget/selector-widget.tsx', () => ({
  SelectorWidget: ({onSelect, children}: {onSelect: (s: OfferSortOption) => void; children: ReactNode}) => (
    <div data-testid="selector-widget">
      <span>{children}</span>
      <button
        data-testid="sort-trigger"
        onClick={() => onSelect(OfferSortOption.price_LtH)}
      />
    </div>
  )
}));

vi.mock('./map-wrapper.tsx', () => ({
  MapWrapper: () => <div data-testid="map-wrapper"/>
}));

const middleware = [thunk.withExtraArgument({axios: axiosClient})];
const mockStore = configureMockStore(middleware);

describe('PlacesContainer', () => {
  const city = {name: CityName.Paris, location: {latitude: 48, longitude: 2, zoom: 10}};
  const offers = [{id: 'offer-1', title: 'Hotel'}];

  const initialState = {
    [ReducerName.offers]: {
      cities: {[CityName.Paris]: city},
      currentCity: CityName.Paris,
      currentCityOffers: offers,
      sortOption: OfferSortOption.popular,
    },
    [ReducerName.currentUser]: {
      userData: {email: 'test@test.com'},
    },
  };

  it('should render correctly with offers', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlacesContainer/>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/1 places to stay in Paris/i)).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByTestId('offer-card-list')).toBeInTheDocument();
    expect(screen.getByTestId('map-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('selector-widget')).toBeInTheDocument();
  });

  it('should dispatch setActiveOffer when an offer is hovered', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlacesContainer/>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByTestId('hover-trigger'));

    const actions = store.getActions();
    expect(actions).toEqual([setActiveOffer('offer-1')]);
  });

  it('should dispatch setOffersSort when sort option is selected', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlacesContainer/>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByTestId('sort-trigger'));

    const actions = store.getActions();
    expect(actions).toEqual([setOffersSort(OfferSortOption.price_LtH)]);
  });

  it('should dispatch changeFavoriteStatus when authorized and favorite status changes', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlacesContainer/>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByTestId('fav-trigger'));

    const actions = store.getActions();
    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe(changeFavoriteStatus.pending.type);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(actions[0].meta.arg).toEqual({offerId: 'offer-1', status: 1});
  });

  it('should navigate to login page when unauthorized and favorite status changes', () => {
    const unauthorizedState = {
      ...initialState,
      [ReducerName.currentUser]: {
        userData: null,
      },
    };
    const store = mockStore(unauthorizedState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PlacesContainer/>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByTestId('fav-trigger'));

    expect(store.getActions()).toEqual([]);
    expect(mockNavigate).toHaveBeenCalledWith('/' + RoutePath.LoginPage);
  });
});
