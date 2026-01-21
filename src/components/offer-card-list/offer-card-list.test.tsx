import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {vi} from 'vitest';
import {getMockOffer} from '../../shared/entities/offer/mocks.ts';
import {FavoriteStatus} from '../../shared/server/constants.ts';
import {OfferCardList} from './offer-card-list.tsx';
import {OfferCard} from './offer-card.tsx';

type OfferCardPropsCalculated = NonNullable<Parameters<typeof OfferCard>[0]>;

describe('Component: OfferCardList', () => {
  vi.mock('./offer-card', () => ({
    OfferCard: ({offer, onMouseEnter, onChangeFavoriteStatus}: OfferCardPropsCalculated) => (
      <div
        data-testid="offer-card-mock"
        onMouseEnter={onMouseEnter}
      >
        <span>{offer.title}</span>
        <button
          onClick={() => onChangeFavoriteStatus?.(offer.id, FavoriteStatus.Favorite)}
        >
          Change Status
        </button>
      </div>
    )
  }));

  const mockOnCardHover = vi.fn();
  const mockOnChangeFavoriteStatus = vi.fn();

  const offers = [
    getMockOffer({id: '1', title: 'Offer 1'}),
    getMockOffer({id: '2', title: 'Offer 2'}),
    getMockOffer({id: '3', title: 'Offer 3'}),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correct number of cards', () => {
    render(
      <OfferCardList
        offers={offers}
        containerClassName="test-container"
      />
    );

    const cards = screen.getAllByTestId('offer-card-mock');
    expect(cards).toHaveLength(3);

    expect(screen.getByText('Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Offer 3')).toBeInTheDocument();
  });

  it('should apply the container class name', () => {
    const {container} = render(<OfferCardList offers={offers} containerClassName="cities__places-list"/>);
    expect(container.firstChild).toHaveClass('cities__places-list');
  });

  it('should handle hover on card correctly', async () => {
    render(<OfferCardList offers={offers} onCardHover={mockOnCardHover}/>);

    const cards = screen.getAllByTestId('offer-card-mock');

    await userEvent.hover(cards[1]);

    expect(mockOnCardHover).toHaveBeenCalledTimes(1);
    expect(mockOnCardHover).toHaveBeenCalledWith('2');
  });

  it('should handle change favorite status correctly', async () => {
    render(
      <OfferCardList
        offers={offers}
        onChangeFavoriteStatus={mockOnChangeFavoriteStatus}
      />
    );

    const buttons = screen.getAllByRole('button', {name: /Change Status/i});

    await userEvent.click(buttons[2]);

    expect(mockOnChangeFavoriteStatus).toHaveBeenCalledTimes(1);
    expect(mockOnChangeFavoriteStatus).toHaveBeenCalledWith('3', FavoriteStatus.Favorite);
  });

  it('should render nothing (empty container) if offers list is empty', () => {
    render(<OfferCardList offers={[]} containerClassName="empty-container"/>);

    const cards = screen.queryAllByTestId('offer-card-mock');
    expect(cards).toHaveLength(0);
  });
});
