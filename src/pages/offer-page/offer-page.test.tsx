import {configureMockStore} from '@jedmao/redux-mock-store';
import {Store} from '@reduxjs/toolkit';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ReactNode} from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {ReducerName} from '../../shared/enums/reducer-names.ts';
import {RoutePath} from '../../shared/enums/routes';
import {FavoriteStatus} from '../../shared/server/constants';
import {changeFavoriteStatus} from '../../slices/favorites-page-slice/favorites-page-slice';
import {loadNearbyOffers, loadOffer} from '../../slices/offer-page-slice/offer-page-slice';
import {OfferPage} from './offer-page';

vi.mock('../../components/map-widget/map-widget.tsx', () => ({
  MapWidget: () => <div data-testid="map-widget"/>
}));
vi.mock('../../components/offer-card-list/offer-card-list.tsx', () => ({
  OfferCardList: () => <div data-testid="offer-card-list"/>
}));
vi.mock('../../components/spinner/spinner.tsx', () => ({
  Spinner: () => <div data-testid="spinner"/>
}));
vi.mock('./comments-list.tsx', () => ({
  CommentsList: () => <div data-testid="comments-list"/>
}));
vi.mock('./feedback-form.tsx', () => ({
  FeedbackForm: () => <div data-testid="feedback-form"/>
}));
vi.mock('./offer-page-wrapper.tsx', () => ({
  OfferPageWrapper: ({children}: {children: ReactNode}) => <div data-testid="page-wrapper">{children}</div>
}));

vi.mock('../../slices/offer-page-slice/offer-page-slice.ts', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  loadOffer: vi.fn((id) => ({type: 'offer/load', payload: id})),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  loadNearbyOffers: vi.fn((id) => ({type: 'offer/loadNearby', payload: id}))
}));
vi.mock('../../slices/favorites-page-slice/favorites-page-slice.ts', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  changeFavoriteStatus: vi.fn((payload) => ({type: 'favorites/changeStatus', payload}))
}));

const mockStore = configureMockStore();
const MOCK_ID = '1';

const mockOfferData = {
  id: MOCK_ID,
  title: 'Beautiful Apartment',
  description: 'Desc',
  type: 'apartment',
  price: 120,
  images: ['img1.jpg', 'img2.jpg'],
  city: {name: 'Paris', location: {latitude: 0, longitude: 0, zoom: 10}},
  location: {latitude: 0, longitude: 0, zoom: 10},
  goods: ['Wi-Fi', 'Heating'],
  host: {isPro: true, name: 'Host Name', avatarUrl: 'avatar.jpg'},
  isPremium: true,
  isFavorite: false,
  rating: 4.8,
  bedrooms: 3,
  maxAdults: 4,
};

describe('Component: OfferPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderWithRouter = (store: any, initialRoute = `/offer/${MOCK_ID}`) => {
    return render(
      <Provider store={store as Store}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route path="/offer/:id" element={<OfferPage/>}/>
            <Route path={'/' + RoutePath.LoginPage} element={<h1>Login Page</h1>}/>
            <Route path={'/' + RoutePath.Page404} element={<h1>404 Not Found</h1>}/>
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  };

  it('should dispatch load actions on mount', () => {
    const store = mockStore({
      currentUser: {userData: null},
      [ReducerName.offerPage]: {
        offerData: null,
        nearbyOffers: [],
        offersLoadingError: false,
        nearbyLoadingError: false,
      },
    });

    renderWithRouter(store);

    expect(loadOffer).toHaveBeenCalledWith(MOCK_ID);
    expect(loadNearbyOffers).toHaveBeenCalledWith(MOCK_ID);
  });

  it('should render Spinner when offerData is null', () => {
    const store = mockStore({
      currentUser: {userData: null},
      [ReducerName.offerPage]: {
        offerData: null,
        nearbyOffers: [],
        offersLoadingError: false,
      },
    });

    renderWithRouter(store);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText(/Beautiful Apartment/i)).not.toBeInTheDocument();
  });

  it('should redirect to 404 page if loading error occurs', () => {
    const store = mockStore({
      currentUser: {userData: null},
      [ReducerName.offerPage]: {
        offerData: null,
        nearbyOffers: [],
        offersLoadingError: true, // Симулируем ошибку
      },
    });

    renderWithRouter(store);

    // Проверяем, что отрендерился компонент по роуту 404
    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });

  it('should render offer content correctly when data is loaded', () => {
    const store = mockStore({
      currentUser: {userData: null}, // Не авторизован
      [ReducerName.offerPage]: {
        offerData: mockOfferData,
        nearbyOffers: [],
        offersLoadingError: false,
      },
    });

    renderWithRouter(store);

    // Проверяем заголовки и данные
    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText(/premium/i)).toBeInTheDocument(); // isPremium: true
    expect(screen.getByText(/3 Bedrooms/i)).toBeInTheDocument();
    expect(screen.getByText(/Max 4 adults/i)).toBeInTheDocument();
    expect(screen.getByText(/Wi-Fi/i)).toBeInTheDocument(); // Goods
    expect(screen.getByText(/Host Name/i)).toBeInTheDocument();

    // Проверяем наличие дочерних компонентов
    expect(screen.getByTestId('map-widget')).toBeInTheDocument();
    expect(screen.getByTestId('comments-list')).toBeInTheDocument();
    expect(screen.getByTestId('offer-card-list')).toBeInTheDocument();

    // Проверяем, что форма отзывов СКРЫТА для гостя
    expect(screen.queryByTestId('feedback-form')).not.toBeInTheDocument();
  });

  it('should render FeedbackForm if user is authorized', () => {
    const store = mockStore({
      currentUser: {userData: {name: 'User'}}, // Авторизован
      [ReducerName.offerPage]: {
        offerData: mockOfferData,
        nearbyOffers: [],
      },
    });

    renderWithRouter(store);

    expect(screen.getByTestId('feedback-form')).toBeInTheDocument();
  });

  it('should redirect to Login page when unauthorized user clicks bookmark', async () => {
    const user = userEvent.setup();
    const store = mockStore({
      [ReducerName.currentUser]: {userData: null}, // Гость
      [ReducerName.offerPage]: {
        offerData: mockOfferData, // isFavorite: false
        nearbyOffers: [],
      },
    });

    renderWithRouter(store);

    // Находим кнопку закладки. У нее есть visually-hidden текст "To bookmarks"
    const bookmarkButton = screen.getByRole('button', {name: /To bookmarks/i});

    await user.click(bookmarkButton);

    // Проверяем, что перешли на страницу логина
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    // Экшен изменения статуса НЕ должен отправиться
    expect(changeFavoriteStatus).not.toHaveBeenCalled();
  });

  it('should dispatch changeFavoriteStatus when authorized user clicks bookmark', async () => {
    const user = userEvent.setup();
    const store = mockStore({
      [ReducerName.currentUser]: {userData: {id: 1}}, // Юзер
      [ReducerName.offerPage]: {
        offerData: {...mockOfferData, isFavorite: true}, // Уже в избранном
        nearbyOffers: [],
      },
    });

    renderWithRouter(store);

    const bookmarkButton = screen.getByRole('button', {name: /To bookmarks/i});
    expect(bookmarkButton).toHaveClass('offer__bookmark-button--active');

    await user.click(bookmarkButton);

    expect(changeFavoriteStatus).toHaveBeenCalledWith({
      offerId: MOCK_ID,
      status: FavoriteStatus.NotFavorite, // 0
    });
  });
});
