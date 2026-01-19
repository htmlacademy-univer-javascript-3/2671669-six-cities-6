import { useState } from 'react';
import { SortingOption } from '../../shared/entities/sorting/types';

type SortingOptionsProps = {
  currentOption: SortingOption;
  onOptionChange: (option: SortingOption) => void;
};

const SORTING_OPTIONS: SortingOption[] = [
  'Popular',
  'Price: low to high',
  'Price: high to low',
  'Top rated first',
];

function SortingOptions({ currentOption, onOptionChange }: SortingOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentOption}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      {isOpen && (
        <ul className="places__options places__options--custom places__options--opened">
          {SORTING_OPTIONS.map((option) => (
            <li
              key={option}
              className={`places__option ${option === currentOption ? 'places__option--active' : ''}`}
              tabIndex={0}
              onClick={() => {
                onOptionChange(option); // ← Просто передаём option
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default SortingOptions;
