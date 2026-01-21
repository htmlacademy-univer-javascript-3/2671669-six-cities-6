import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {RoutePath} from '../../shared/enums/routes.ts';
import {NotFound404Page} from './not-found-404-page.tsx';

describe('Component: NotFound404Page', () => {
  it('should render 404 text and a link to main page', () => {
    render(
      <MemoryRouter>
        <NotFound404Page/>
      </MemoryRouter>
    );

    const heading = screen.getByRole('heading', {level: 1});
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('404 Not Found :(');

    const link = screen.getByRole('link', {name: /На главную/i});
    expect(link).toBeInTheDocument();

    expect(link).toHaveAttribute('href', '/' + RoutePath.MainPage);
  });
});
