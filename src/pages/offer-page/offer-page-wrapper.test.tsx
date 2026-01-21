import {render, screen} from '@testing-library/react';
import {OfferPageWrapper} from './offer-page-wrapper';

vi.mock('../../components/shared/header-logo-link/header-logo-link.tsx', () => ({
  HeaderLogoLink: () => <div data-testid="header-logo-link"/>
}));

vi.mock('../../components/shared/header-user-info/header-user-info.tsx', () => ({
  HeaderUserInfo: () => <div data-testid="header-user-info"/>
}));

describe('Component: OfferPageWrapper', () => {
  it('should render header components and children correctly', () => {
    const testChildText = 'Content inside the wrapper';

    render(
      <OfferPageWrapper>
        <section data-testid="child-element">
          <h1>{testChildText}</h1>
        </section>
      </OfferPageWrapper>
    );

    expect(screen.getByTestId('header-logo-link')).toBeInTheDocument();
    expect(screen.getByTestId('header-user-info')).toBeInTheDocument();
    expect(screen.getByText(testChildText)).toBeInTheDocument();
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });
});
