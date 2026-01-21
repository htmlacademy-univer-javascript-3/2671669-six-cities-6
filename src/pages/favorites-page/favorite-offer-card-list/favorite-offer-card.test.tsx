import {configureMockStore} from '@jedmao/redux-mock-store';
import {fireEvent, render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import {describe, expect, it, vi} from 'vitest';
import {getMockOffer} from '../../../shared/entities/offer/mocks.ts';
import {Offer} from '../../../shared/entities/offer/types.ts';
import {RoutePath} from '../../../shared/enums/routes.ts';
import {FavoriteStatus} from '../../../shared/server/constants.ts';
import {changeFavoriteStatus} from '../../../slices/favorites-page-slice/favorites-page-slice.ts';
import {FavoriteOfferCard} from './favorite-offer-card.tsx';

vi.mock('../../../slices/favorites-page-slice/favorites-page-slice.ts', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  changeFavoriteStatus: vi.fn((payload) => ({type: 'favorites/changeStatus', payload})),
}));

const mockOffer: Offer = getMockOffer({
  id: '123',
  title: 'Nice Apartment',
  type: 'apartment',
  price: 100,
  previewImage: 'https://test.com/img.jpg',
  isFavorite: true,
  isPremium: false,
  rating: 4,
});

const mockStore = configureMockStore([]);

describe('Component: FavoriteOfferCard', () => {
  const store = mockStore({});

  it('should render correct offer information', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={mockOffer}/>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(mockOffer.title)).toBeInTheDocument();
    expect(screen.getByText(`€${mockOffer.price}`)).toBeInTheDocument();
    expect(screen.getByText(mockOffer.type)).toBeInTheDocument();

    const image = screen.getByAltText('Place image');
    expect(image).toHaveAttribute('src', mockOffer.previewImage);
  });

  it('should render "Premium" badge only when offer is premium', () => {
    const {rerender} = render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={{...mockOffer, isPremium: false}}/>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();

    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={{...mockOffer, isPremium: true}}/>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should calculate rating width correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={mockOffer}/>
        </MemoryRouter>
      </Provider>
    );

    const ratingText = screen.getByText('Rating');
    const starsSpan = ratingText.previousSibling;

    expect(starsSpan).toHaveStyle({width: '80%'});
  });

  it('should generate correct links to offer page', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={mockOffer}/>
        </MemoryRouter>
      </Provider>
    );

    const expectedPath = `/${RoutePath.OfferPage}/${mockOffer.id}`;

    const titleLink = screen.getByRole('link', {name: mockOffer.title});
    expect(titleLink).toHaveAttribute('href', expectedPath);

    const imageLink = screen.getByAltText('Place image').closest('a');
    expect(imageLink).toHaveAttribute('href', expectedPath);
  });

  it('should render active bookmark button if offer is favorite', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={{...mockOffer, isFavorite: true}}/>
        </MemoryRouter>
      </Provider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('place-card__bookmark-button--active');
  });

  it('should dispatch "changeFavoriteStatus" on bookmark click', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FavoriteOfferCard offer={{...mockOffer, isFavorite: true}}/>
        </MemoryRouter>
      </Provider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(changeFavoriteStatus).toHaveBeenCalledTimes(1);

    expect(changeFavoriteStatus).toHaveBeenCalledWith({
      offerId: mockOffer.id,
      status: FavoriteStatus.NotFavorite,
    });
  });
});
