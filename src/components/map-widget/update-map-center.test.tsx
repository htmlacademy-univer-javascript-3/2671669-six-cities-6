import {render} from '@testing-library/react';
import {vi} from 'vitest';
import {Coordinates} from '../../shared/entities/coordinates/coordinates.ts';
import {UpdateMapCenter} from './update-map-center.tsx';

const mapInstanceMock = {
  panTo: vi.fn(),
  setZoom: vi.fn(),
};

vi.mock('react-leaflet', () => ({
  useMap: () => mapInstanceMock,
}));

describe('Component: UpdateMapCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCoordinates: Coordinates = {
    latitude: 52.370216,
    longitude: 4.895168,
    zoom: 10,
  };

  it('calls map.panTo and map.setZoom with correct arguments on render', () => {
    render(<UpdateMapCenter mapCenter={mockCoordinates}/>);

    expect(mapInstanceMock.panTo).toHaveBeenCalledTimes(1);
    expect(mapInstanceMock.panTo).toHaveBeenCalledWith(
      [mockCoordinates.latitude, mockCoordinates.longitude]
    );

    expect(mapInstanceMock.setZoom).toHaveBeenCalledTimes(1);
    expect(mapInstanceMock.setZoom).toHaveBeenCalledWith(mockCoordinates.zoom);
  });

  it('updates map position when props change', () => {
    const {rerender} = render(<UpdateMapCenter mapCenter={mockCoordinates}/>);

    const newCoordinates: Coordinates = {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 12,
    };

    rerender(<UpdateMapCenter mapCenter={newCoordinates}/>);

    expect(mapInstanceMock.panTo).toHaveBeenLastCalledWith(
      [newCoordinates.latitude, newCoordinates.longitude]
    );
    expect(mapInstanceMock.setZoom).toHaveBeenLastCalledWith(newCoordinates.zoom);
  });
});
