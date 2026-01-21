import {fireEvent, render, screen} from '@testing-library/react';
import {useRef, useState} from 'react';
import {useOutsideClick} from './use-outside-click.ts';

const TestComponent = ({onOutsideClick}: {onOutsideClick: () => void}) => {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onOutsideClick);

  return (
    <div>
      <div data-testid="outside">Outside Element</div>
      <div ref={ref} data-testid="inside">
        Inside Element
        <button data-testid="inner-button">Inner Button</button>
      </div>
    </div>
  );
};

describe('useOutsideClick', () => {
  it('should call handler when clicking outside the referenced element', () => {
    const handler = vi.fn();
    render(<TestComponent onOutsideClick={handler}/>);

    fireEvent.click(screen.getByTestId('outside'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call handler when clicking inside the referenced element', () => {
    const handler = vi.fn();
    render(<TestComponent onOutsideClick={handler}/>);

    fireEvent.click(screen.getByTestId('inside'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('should not call handler when clicking on a child of the referenced element', () => {
    const handler = vi.fn();
    render(<TestComponent onOutsideClick={handler}/>);

    fireEvent.click(screen.getByTestId('inner-button'));

    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove event listener when component unmounts', () => {
    const handler = vi.fn();
    const {unmount} = render(<TestComponent onOutsideClick={handler}/>);

    unmount();

    fireEvent.click(document.body);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should not call handler if the clicked target is not connected to DOM', () => {
    const handler = vi.fn();

    const TestWithRemovableButton = () => {
      const ref = useRef<HTMLDivElement>(null);
      useOutsideClick(ref, handler);
      const [showButton, setShowButton] = useState(true);

      return (
        <div ref={ref}>
          {showButton && (
            <button
              data-testid="removable-btn"
              onClick={() => setShowButton(false)}
            >
              Remove me
            </button>
          )}
        </div>
      );
    };

    render(<TestWithRemovableButton/>);

    const button = screen.getByTestId('removable-btn');
    fireEvent.click(button);

    expect(handler).not.toHaveBeenCalled();
  });
});
