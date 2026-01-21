import {render, screen} from '@testing-library/react';
import {FavoritesEmpty} from './favorites-empty.tsx';

describe('Component: FavoritesEmpty', () => {
  it('should render the empty state message and description', () => {
    render(<FavoritesEmpty/>);
    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(screen.getByText(/Save properties to narrow down search/i)).toBeInTheDocument();
  });
});
