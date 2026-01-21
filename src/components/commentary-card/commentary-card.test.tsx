import {render, screen} from '@testing-library/react';
import {getMockCommentary} from '../../shared/entities/commentary/mocks.ts';
import {CommentaryCard} from './commentary-card.tsx';

describe('CommentaryCard', () => {
  it('renders user information correctly', () => {
    const mockCommentary = getMockCommentary();
    render(<CommentaryCard commentary={mockCommentary}/>);

    expect(screen.getByText(mockCommentary.user.name)).toBeInTheDocument();

    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockCommentary.user.avatarUrl);
  });

  it('renders comment text', () => {
    const mockCommentary = getMockCommentary();
    render(<CommentaryCard commentary={mockCommentary}/>);
    expect(screen.getByText(mockCommentary.comment)).toBeInTheDocument();
  });

  it('calculates rating width correctly', () => {
    const mockCommentary = getMockCommentary({rating: 4});
    const {container} = render(<CommentaryCard commentary={mockCommentary}/>);
    const starsSpan = container.querySelector('.reviews__stars span');
    expect(starsSpan).toHaveStyle({width: '80%'});
  });

  it('renders styled rating for max rating (5)', () => {
    const mockCommentary = getMockCommentary({rating: 5});
    const {container} = render(<CommentaryCard commentary={mockCommentary}/>);
    const starsSpan = container.querySelector('.reviews__stars span');
    expect(starsSpan).toHaveStyle({width: '100%'});
  });

  it('formats date correctly', () => {
    const mockCommentary = getMockCommentary({date: new Date('2025.10.12 10:00')});
    render(<CommentaryCard commentary={mockCommentary}/>);

    const dateText = screen.getByText('October 2025');
    expect(dateText).toBeInTheDocument();
  });
});
