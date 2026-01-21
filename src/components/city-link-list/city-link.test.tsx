import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {vi} from 'vitest';
import {getMockCity} from '../../shared/entities/city/mocks.ts';
import {CityLink} from './city-link.tsx';
import {CityLickTestIds} from './constants.ts';

describe('Component: CityLink', () => {
  it('should render image', () => {
    render(<MemoryRouter><CityLink city={getMockCity()}/></MemoryRouter>);
    const navlink = screen.getByTestId(CityLickTestIds.CityNavlink);
    expect(navlink).toBeInTheDocument();
  });

  it('should render city name', () => {
    const city = getMockCity();
    render(<MemoryRouter><CityLink city={city}/></MemoryRouter>);
    expect(screen.getByText(city.name)).toBeInTheDocument();
  });

  it('should have special class on active link', () => {
    render(<MemoryRouter><CityLink city={getMockCity()} isActive={true}/></MemoryRouter>);
    const navlink = screen.getByTestId(CityLickTestIds.CityNavlink);
    expect(navlink).toHaveClass('tabs__item--active');
  });

  it('should not have special class on active link', () => {
    render(<MemoryRouter><CityLink city={getMockCity()} isActive={false}/></MemoryRouter>);
    const navlink = screen.getByTestId(CityLickTestIds.CityNavlink);
    expect(navlink).not.toHaveClass('tabs__item--active');
  });

  it('should call callback on link click', () => {
    const mockCallback = vi.fn();
    render(<MemoryRouter><CityLink city={getMockCity()} onCityClick={mockCallback}/></MemoryRouter>);
    const navlink = screen.getByTestId(CityLickTestIds.CityNavlink);
    fireEvent.click(navlink);
    expect(mockCallback).toHaveBeenCalled();
  });
});
