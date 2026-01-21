import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {HeaderLogoLink} from './header-logo-link.tsx';

describe('Component: HeaderLogoLink', () => {
  it('should render image', () => {
    const {container} = render(<MemoryRouter><HeaderLogoLink/></MemoryRouter>);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img?.src).toContain('img/logo.svg');
  });
});
