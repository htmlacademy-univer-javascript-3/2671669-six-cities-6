import React, { useState } from 'react';
import { SelectorOption } from './model/types';

// Добавьте типы пропсов
interface SelectorWidgetProps {
  options: SelectorOption[];
  activeOptionKey: string;
  children: React.ReactNode;
  onSelect: (key: string) => void;
}

export const SelectorWidget: React.FC<SelectorWidgetProps> = ({
  options,
  activeOptionKey,
  children,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeOption = options.find((option) => option.key === activeOptionKey) ?? options[0];

  const handleSelect = (key: string) => {
    onSelect(key);
    setIsOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">{children}</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
      >
        {activeOption.value}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      {isOpen && (
        <ul className="places__options places__options--custom places__options--opened">
          {options.map((option) => (
            <li
              key={option.key}
              className={`places__option ${option.key === activeOptionKey ? 'places__option--active' : ''}`}
              tabIndex={0}
              onClick={() => handleSelect(option.key)}
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};
