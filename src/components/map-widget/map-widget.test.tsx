import {render, screen} from '@testing-library/react';
import {vi} from 'vitest';
import {Coordinates} from '../../shared/entities/coordinates/coordinates.ts';
import {MapWidget} from './map-widget.tsx';
import {PointOnMap} from './model/types.ts';

type DataProps = {
  center: [number, number];
  position: [number, number];
  zoom: number;
  scrollWheelZoom: boolean;
  className: string;
  mapCenter: Coordinates;
  zIndexOffset: number;
};

vi.mock('./model/markers.ts', () => ({
  defaultMarker: 'default-icon-mock',
  activeMarker: 'active-icon-mock',
}));

vi.mock('react-leaflet', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MapContainer: ({children, ...props}: any) => (
    <div data-testid="MapContainer" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
  TileLayer: () => <div data-testid="TileLayer"/>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Marker: ({children, icon, ...props}: any) => (
    <div
      data-testid="Marker"
      data-icon={icon as string}
      data-props={JSON.stringify(props)}
    >
      {children}
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Popup: ({children}: any) => <div data-testid="Popup">{children}</div>,
}));

vi.mock('./update-map-center.tsx', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UpdateMapCenter: (props: any) => (
    <div data-testid="UpdateMapCenter" data-props={JSON.stringify(props)}/>
  ),
}));

describe('Component: MapWidget', () => {
  const mockCenter: Coordinates = {latitude: 50, longitude: 10, zoom: 12};

  const mockMarkers: PointOnMap[] = [
    {
      id: '1',
      coordinates: {latitude: 51, longitude: 11, zoom: 10},
      popupNode: <span>Popup 1</span>,
    },
    {
      id: '2',
      coordinates: {latitude: 52, longitude: 12, zoom: 10},
      popupNode: null,
    },
  ];

  it('renders MapContainer with correct props', () => {
    render(
      <MapWidget
        mapCenter={mockCenter}
        mapContainerClassName="test-class"
        scrollWheelZoom={false}
      />
    );

    const mapContainer = screen.getByTestId('MapContainer');

    const props = JSON.parse(mapContainer.getAttribute('data-props') || '{}') as DataProps;

    expect(props.center).toEqual([mockCenter.latitude, mockCenter.longitude]);
    expect(props.zoom).toBe(mockCenter.zoom);
    expect(props.scrollWheelZoom).toBe(false);
    expect(props.className).toBe('test-class');
  });

  it('renders UpdateMapCenter and TileLayer', () => {
    render(<MapWidget mapCenter={mockCenter}/>);

    expect(screen.getByTestId('TileLayer')).toBeInTheDocument();

    const updateComp = screen.getByTestId('UpdateMapCenter');
    const props = JSON.parse(updateComp.getAttribute('data-props') || '{}') as DataProps;
    expect(props.mapCenter).toEqual(mockCenter);
  });

  it('renders correct number of Markers', () => {
    render(<MapWidget mapCenter={mockCenter} markers={mockMarkers}/>);

    const markers = screen.getAllByTestId('Marker');
    expect(markers).toHaveLength(2);
  });

  it('assigns correct icons (Active vs Default)', () => {
    render(<MapWidget mapCenter={mockCenter} markers={mockMarkers} activeMarkers={['1']}/>);

    const markers = screen.getAllByTestId('Marker');

    const marker1 = markers[0];
    const props1 = JSON.parse(marker1.getAttribute('data-props') || '{}') as DataProps;

    expect(props1.position).toEqual([mockMarkers[0].coordinates.latitude, mockMarkers[0].coordinates.longitude]);
    expect(marker1).toHaveAttribute('data-icon', 'active-icon-mock');
    expect(props1.zIndexOffset).toBe(100000);

    const marker2 = markers[1];
    const props2 = JSON.parse(marker2.getAttribute('data-props') || '{}') as DataProps;

    expect(marker2).toHaveAttribute('data-icon', 'default-icon-mock');
    expect(props2.zIndexOffset).toBe(0);
  });

  it('renders Popup only if popupNode provided', () => {
    render(<MapWidget mapCenter={mockCenter} markers={mockMarkers}/>);

    const popups = screen.getAllByTestId('Popup');
    expect(popups).toHaveLength(1);
    expect(screen.getByText('Popup 1')).toBeInTheDocument();
  });
});
