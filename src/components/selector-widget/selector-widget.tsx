import React, {FC, MouseEventHandler, ReactNode, useRef, useState} from 'react';
import {useOutsideClick} from '../../hooks/use-outside-click/use-outside-click.ts';
import {SelectorOption} from './model/types.ts';

type SelectorWidgetProps = {
  options: SelectorOption[];
  activeOptionKey: SelectorOption['key'];
  children?: ReactNode;
  onSelect?: (option: SelectorOption['key']) => void;
};

const optionClasses = 'places__option';
const activeOptionClasses = `${optionClasses} places__option--active`;

export const SelectorWidget: FC<SelectorWidgetProps> = React.memo(({options, activeOptionKey, children, onSelect}) => {
  const expandRef = useRef<HTMLUListElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useOutsideClick(expandRef, () => setIsExpanded(false));

  const selected = options.find((opt) => opt.key === activeOptionKey);

  const handleClickOpener: MouseEventHandler = (event) => {
    event.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const handleSelectOption = (optionKey: SelectorOption['key']) => {
    onSelect?.(optionKey);
    setIsExpanded(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">{children}</span>
      <span className="places__sorting-type" tabIndex={0} onClick={handleClickOpener}>
        {selected?.value}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      {isExpanded && (
        <ul ref={expandRef} className="places__options places__options--custom places__options--opened">
          {options.map((option) => (
            <li
              key={option.key}
              className={option.key === activeOptionKey ? activeOptionClasses : optionClasses}
              tabIndex={0}
              onClick={() => handleSelectOption(option.key)}
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
});

SelectorWidget.displayName = 'SelectorWidget';
