import {configureMockStore} from '@jedmao/redux-mock-store';
import {fireEvent, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import thunk from 'redux-thunk';
import {CITY_SEARCH_PARAM} from '../../shared/entities/city/constants.ts';
import {City, CityName} from '../../shared/entities/city/types';
import {ReducerName} from '../../shared/enums/reducer-names';
import {axiosClient} from '../../shared/server/constants.ts';
import {loadOffers, setCity} from '../../slices/offers-slice/offers-slice';
import {MainPage} from './main-page';

vi.mock('../../components/city-link-list/city-link-list.tsx', () => ({
  CityLinkList: ({onCityClick}: {onCityClick: (city: Partial<City>) => void}) => (
    <div data-testid="city-link-list">
      <button
        data-testid="city-trigger"
        onClick={() => onCityClick({name: CityName.Paris})}
      >
        Select Paris
      </button>
    </div>
  )
}));

vi.mock('../../components/shared/header-logo-link/header-logo-link.tsx', () => ({
  HeaderLogoLink: () => <div data-testid="header-logo"/>
}));

vi.mock('../../components/shared/header-user-info/header-user-info.tsx', () => ({
  HeaderUserInfo: () => <div data-testid="header-user-info"/>
}));

vi.mock('../../components/spinner/full-space-spinner.tsx', () => ({
  FullSpaceSpinner: () => <div data-testid="full-space-spinner"/>
}));

vi.mock('./main-page-empty.tsx', () => ({
  MainPageEmpty: () => <div data-testid="main-page-empty"/>
}));

vi.mock('./places-container.tsx', () => ({
  PlacesContainer: () => <div data-testid="places-container"/>
}));

vi.mock('../../shared/entities/city/utils.ts', () => ({
  isValidCity: (city: string) => ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'].includes(city)
}));

const middleware = [thunk.withExtraArgument({axios: axiosClient})];
const mockStore = configureMockStore(middleware);

describe('MainPage', () => {
  const initialState = {
    [ReducerName.offers]: {
      cities: {[CityName.Paris]: {name: CityName.Paris}},
      currentCity: CityName.Paris,
      currentCityOffers: [],
      isOffersLoading: false,
    },
  };

  it('should render spinner when loading is true', () => {
    const store = mockStore({
      ...initialState,
      [ReducerName.offers]: {
        ...initialState[ReducerName.offers],
        isOffersLoading: true,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage/>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('full-space-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('places-container')).not.toBeInTheDocument();
    expect(screen.queryByTestId('main-page-empty')).not.toBeInTheDocument();
  });

  it('should render PlacesContainer when not loading and offers exist', () => {
    const store = mockStore({
      ...initialState,
      [ReducerName.offers]: {
        ...initialState[ReducerName.offers],
        isOffersLoading: false,
        currentCityOffers: [{id: '1'}],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage/>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('places-container')).toBeInTheDocument();
    expect(screen.queryByTestId('full-space-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId('main-page-empty')).not.toBeInTheDocument();

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('page__main', 'page__main--index');
    expect(mainElement).not.toHaveClass('page__main--index-empty');
  });

  it('should render MainPageEmpty when not loading and no offers', () => {
    const store = mockStore({
      ...initialState,
      [ReducerName.offers]: {
        ...initialState[ReducerName.offers],
        isOffersLoading: false,
        currentCityOffers: [],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage/>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('main-page-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('places-container')).not.toBeInTheDocument();

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('page__main--index-empty');
  });

  it('should dispatch loadOffers on mount', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage/>
        </MemoryRouter>
      </Provider>
    );

    const actions = store.getActions();
    const loadOffersAction = actions.find((action) => action.type === loadOffers.pending.type);
    expect(loadOffersAction).toBeDefined();
  });

  it('should dispatch setCity if valid city param is in URL', () => {
    const store = mockStore(initialState);
    const validCity = 'Amsterdam';

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/?${CITY_SEARCH_PARAM}=${validCity}`]}>
          <MainPage/>
        </MemoryRouter>
      </Provider>
    );

    const actions = store.getActions();
    expect(actions).toEqual(expect.arrayContaining([setCity(validCity)]));
  });

  it('should not dispatch setCity if city param in URL is invalid', () => {
    const store = mockStore(initialState);
    const invalidCity = 'UnknownCity';

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/?${CITY_SEARCH_PARAM}=${invalidCity}`]}>
          <MainPage/>
        </MemoryRouter>
      </Provider>
    );

    const actions = store.getActions();
    const setCityAction = actions.find((action) => action.type === setCity.type);
    expect(setCityAction).toBeUndefined();
  });

  it('should dispatch setCity when a city is clicked in the list', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage/>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByTestId('city-trigger'));

    const actions = store.getActions();
    expect(actions).toEqual(expect.arrayContaining([setCity(CityName.Paris)]));
  });
});
