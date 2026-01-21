import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import {vi} from 'vitest';
import {getMockOffer} from '../../shared/entities/offer/mocks.ts';
import {Offer} from '../../shared/entities/offer/types.ts';
import {RoutePath} from '../../shared/enums/routes.ts';
import {FavoriteStatus} from '../../shared/server/constants.ts';
import {OfferCard} from './offer-card.tsx';

describe('Component: OfferCard', () => {
  const mockOnMouseEnter = vi.fn();
  const mockOnChangeFavoriteStatus = vi.fn();

  const renderOfferCard = (offer: Offer) => {
    return render(
      <MemoryRouter>
        <OfferCard
          offer={offer}
          onMouseEnter={mockOnMouseEnter}
          onChangeFavoriteStatus={mockOnChangeFavoriteStatus}
        />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const offer = getMockOffer({
      title: 'Beautiful Apartment',
      price: 120,
      type: 'apartment',
      isPremium: false,
    });

    renderOfferCard(offer);

    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText(/120/)).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('should render "Premium" mark when isPremium is true', () => {
    const offer = getMockOffer({isPremium: true});

    renderOfferCard(offer);

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should render correct image attributes', () => {
    const offer = getMockOffer({previewImage: 'test-image.jpg'});

    renderOfferCard(offer);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Place image');
  });

  it('should render correct link URL', () => {
    const offer = getMockOffer({id: '123'});

    renderOfferCard(offer);

    const link = screen.getByRole('link', {name: offer.title});
    expect(link).toHaveAttribute('href', `/${RoutePath.OfferPage}/123`);
  });

  it('should calculate rating width correctly', () => {
    const offer = getMockOffer({rating: 2.7});
    const {container} = renderOfferCard(offer);

    const ratingSpan = container.querySelector('.place-card__stars span');
    expect(ratingSpan).toHaveStyle({width: '60%'});
  });

  it('should handle mouse enter event', async () => {
    const offer = getMockOffer();
    renderOfferCard(offer);

    const cardArticle = screen.getByRole('article');

    await userEvent.hover(cardArticle);

    expect(mockOnMouseEnter).toHaveBeenCalledTimes(1);
  });

  describe('Favorite Button Interactions', () => {
    it('should have active class if offer is favorite', () => {
      const offer = getMockOffer({isFavorite: true});
      renderOfferCard(offer);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('place-card__bookmark-button--active');
    });

    it('should NOT have active class if offer is NOT favorite', () => {
      const offer = getMockOffer({isFavorite: false});
      renderOfferCard(offer);

      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('place-card__bookmark-button--active');
    });

    it('should call onChangeFavoriteStatus with "Favorite" status when clicking on non-favorite offer', async () => {
      const offerId = 'offer-1';
      const offer = getMockOffer({id: offerId, isFavorite: false});

      renderOfferCard(offer);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(mockOnChangeFavoriteStatus).toHaveBeenCalledTimes(1);
      expect(mockOnChangeFavoriteStatus).toHaveBeenCalledWith(offerId, FavoriteStatus.Favorite);
    });

    it('should call onChangeFavoriteStatus with "NotFavorite" status when clicking on favorite offer', async () => {
      const offerId = 'offer-2';
      const offer = getMockOffer({id: offerId, isFavorite: true});

      renderOfferCard(offer);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(mockOnChangeFavoriteStatus).toHaveBeenCalledTimes(1);
      expect(mockOnChangeFavoriteStatus).toHaveBeenCalledWith(offerId, FavoriteStatus.NotFavorite);
    });
  });
});
