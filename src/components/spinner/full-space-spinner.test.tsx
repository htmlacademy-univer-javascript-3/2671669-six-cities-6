import {render} from '@testing-library/react';
import {FullSpaceSpinner} from './full-space-spinner.tsx';

describe('Component: FullSpaceSpinner', () => {
  it('should render', () => {
    const {container} = render(<FullSpaceSpinner/>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
