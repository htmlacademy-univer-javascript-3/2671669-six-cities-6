import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {getMockCityMap} from '../../shared/entities/city/mocks.ts';
import {CityName} from '../../shared/entities/city/types.ts';
import {CityLinkList} from './city-link-list.tsx';
import {CityLickTestIds} from './constants.ts';

describe('Component: CityLink', () => {
  it('should render several links', () => {
    const cities = getMockCityMap([CityName.Paris, CityName.Amsterdam]);
    render(<MemoryRouter><CityLinkList cities={cities} activeCityName={CityName.Paris}/></MemoryRouter>);
    const links = screen.getAllByTestId(CityLickTestIds.CityNavlink);
    expect(links).toHaveLength(2);
  });
});
