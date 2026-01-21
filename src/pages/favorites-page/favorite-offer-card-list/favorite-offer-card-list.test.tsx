import {render, screen} from '@testing-library/react';
import {getMockOffer} from '../../../shared/entities/offer/mocks.ts';
import {Offer, OffersByCity} from '../../../shared/entities/offer/types.ts';
import {FavoriteOfferCardList} from './favorite-offer-card-list.tsx';

vi.mock('./favorite-offer-card.tsx', () => ({
  FavoriteOfferCard: ({offer}: {offer: Offer}) => (
    <div data-testid="mock-fav-card">
      MockCard: {offer.title}
    </div>
  ),
}));

describe('Component: FavoriteOfferCardList', () => {
  it('should render offers grouped by city correctly', () => {
    const parisOffer1 = getMockOffer({id: '1', city: 'Paris', title: 'Paris Hotel 1'});
    const parisOffer2 = getMockOffer({id: '2', city: 'Paris', title: 'Paris Hotel 2'});
    const cologneOffer = getMockOffer({id: '3', city: 'Cologne', title: 'Cologne Hostel'});

    const mockOffersByCity: OffersByCity = {
      'Paris': [parisOffer1, parisOffer2],
      'Cologne': [cologneOffer],
    };

    render(<FavoriteOfferCardList offers={mockOffersByCity}/>);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();

    const cards = screen.getAllByTestId('mock-fav-card');
    expect(cards).toHaveLength(3);

    expect(screen.getByText('MockCard: Paris Hotel 1')).toBeInTheDocument();
    expect(screen.getByText('MockCard: Cologne Hostel')).toBeInTheDocument();
  });

  it('should render nothing (empty list) if offers object is empty', () => {
    const emptyOffers: OffersByCity = {};

    render(<FavoriteOfferCardList offers={emptyOffers}/>);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toBeEmptyDOMElement();
  });
});
