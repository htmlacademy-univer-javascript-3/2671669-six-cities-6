import {fireEvent, render, screen} from '@testing-library/react';
import {useOutsideClick} from '../../hooks/use-outside-click/use-outside-click.ts';
import {SelectorOption} from './model/types.ts';
import {SelectorWidget} from './selector-widget.tsx';

vi.mock('../../hooks/use-outside-click/use-outside-click.ts', () => ({
  useOutsideClick: vi.fn(),
}));

const mockOptions: SelectorOption[] = [
  {key: 'popular', value: 'Popular'},
  {key: 'price_low', value: 'Price: low to high'},
  {key: 'price_high', value: 'Price: high to low'},
];

describe('Component: SelectorWidget', () => {
  const defaultProps = {
    options: mockOptions,
    activeOptionKey: 'popular',
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with initial state (closed)', () => {
    render(<SelectorWidget {...defaultProps}>Sort by</SelectorWidget>);

    expect(screen.getByText('Sort by')).toBeInTheDocument();

    expect(screen.getByText('Popular')).toBeInTheDocument();

    const list = screen.queryByRole('list');
    expect(list).not.toBeInTheDocument();
  });

  it('should open the options list when clicked', () => {
    render(<SelectorWidget {...defaultProps}>Sort by</SelectorWidget>);

    const opener = screen.getByText('Popular');

    fireEvent.click(opener);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('places__options--opened');

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(mockOptions.length);
  });

  it('should apply active class to the selected option', () => {
    render(
      <SelectorWidget {...defaultProps} activeOptionKey="price_low">
        Sort by
      </SelectorWidget>
    );

    fireEvent.click(screen.getByText('Price: low to high'));

    const options = screen.getAllByRole('listitem');

    const activeOption = options.find((opt) => opt.textContent === 'Price: low to high');
    const inactiveOption = options.find((opt) => opt.textContent === 'Popular');

    expect(activeOption).toHaveClass('places__option--active');
    expect(inactiveOption).not.toHaveClass('places__option--active');
  });

  it('should call "onSelect" and close the list when an option is clicked', () => {
    const onSelectMock = vi.fn();
    render(
      <SelectorWidget
        {...defaultProps}
        onSelect={onSelectMock}
        activeOptionKey="popular"
      >
        Sort by
      </SelectorWidget>
    );

    fireEvent.click(screen.getByText('Popular'));

    expect(screen.getByRole('list')).toBeInTheDocument();

    const optionToClick = screen.getByText('Price: high to low');
    fireEvent.click(optionToClick);

    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith('price_high');

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should toggle (close) the list if clicked again on the opener', () => {
    render(<SelectorWidget {...defaultProps}>Sort by</SelectorWidget>);

    const opener = screen.getByText('Popular');

    fireEvent.click(opener);
    expect(screen.getByRole('list')).toBeInTheDocument();

    fireEvent.click(opener);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should call useOutsideClick hook with correct ref', () => {
    render(<SelectorWidget {...defaultProps}>Sort by</SelectorWidget>);

    expect(useOutsideClick).toHaveBeenCalled();

    expect(useOutsideClick).toHaveBeenCalledWith(
      expect.objectContaining({current: null}),
      expect.any(Function)
    );
  });
});
