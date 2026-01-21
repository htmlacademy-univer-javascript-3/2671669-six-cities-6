import {configureMockStore} from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MapWidget} from '../../components/map-widget/map-widget.tsx';
import {CityName} from '../../shared/entities/city/types.ts';
import {getMockOffer} from '../../shared/entities/offer/mocks.ts';
import {MapWrapper} from './map-wrapper';

vi.mock('../../components/map-widget/map-widget.tsx', () => ({
  MapWidget: vi.fn(() => <div data-testid="map-widget"/>)
}));

const mockStore = configureMockStore();

const mockLocation = {latitude: 52, longitude: 4, zoom: 10};
const mockCityName = CityName.Amsterdam;
const mockCityData = {
  name: mockCityName,
  location: mockLocation,
};

const mockOffer = getMockOffer({
  id: 'offer-1',
  title: 'Nice Hotel',
  location: {latitude: 52.1, longitude: 4.1, zoom: 10},
  price: 100,
  type: 'room',
});

describe('Component: MapWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should pass correct props to MapWidget (mapCenter, markers)', () => {
    const store = mockStore({
      offers: {
        cities: {
          [mockCityName]: mockCityData,
        },
        currentCity: mockCityName,
        currentCityOffers: [mockOffer],
        activeOfferId: null,
      },
    });

    render(
      <Provider store={store}>
        <MapWrapper/>
      </Provider>
    );

    expect(screen.getByTestId('map-widget')).toBeInTheDocument();

    expect(MapWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        mapCenter: mockLocation,
        markers: [
          {
            id: mockOffer.id,
            coordinates: mockOffer.location,
            popupNode: mockOffer.title,
          },
        ],
        activeMarkers: [],
        mapContainerClassName: 'cities__map map',
      }),
      expect.anything(),
    );
  });

  it('should pass activeOfferId to MapWidget activeMarkers prop', () => {
    const activeId = 'offer-1';
    const store = mockStore({
      offers: {
        cities: {
          [mockCityName]: mockCityData,
        },
        currentCity: mockCityName,
        currentCityOffers: [mockOffer],
        activeOfferId: activeId,
      },
    });

    render(
      <Provider store={store}>
        <MapWrapper/>
      </Provider>
    );

    expect(MapWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        activeMarkers: [activeId],
      }),
      expect.anything()
    );
  });

  it('should handle fallback to DEFAULT_CITY if current city is missing in map', () => {
    const store = mockStore({
      offers: {
        cities: {},
        currentCity: 'UnknownCity',
        currentCityOffers: [],
        activeOfferId: null,
      },
    });

    render(
      <Provider store={store}>
        <MapWrapper/>
      </Provider>
    );

    expect(screen.getByTestId('map-widget')).toBeInTheDocument();
  });
});
