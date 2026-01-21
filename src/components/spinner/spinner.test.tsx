import {render} from '@testing-library/react';
import {Spinner} from './spinner.tsx';

describe('Component: Spinner', () => {
  it('should render', () => {
    const {container} = render(<Spinner/>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
