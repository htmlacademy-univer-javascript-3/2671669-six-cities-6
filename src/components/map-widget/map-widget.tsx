import 'leaflet/dist/leaflet.css';
import {FC} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {Coordinates} from '../../shared/entities/coordinates/coordinates.ts';
import {activeMarker, defaultMarker} from './model/markers.ts';
import {PointOnMap} from './model/types.ts';
import {UpdateMapCenter} from './update-map-center.tsx';

const TOP_MARKER_Z_INDEX = 100000;
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

type MapWidgetProps = {
  mapCenter: Coordinates;
  markers?: PointOnMap[];
  activeMarkers?: PointOnMap['id'][];
  mapContainerClassName?: string;
  scrollWheelZoom?: boolean;
};

export const MapWidget: FC<MapWidgetProps> = ({
  mapCenter, markers = [],
  activeMarkers = [],
  mapContainerClassName,
  scrollWheelZoom = true,
}) => {
  return (
    <MapContainer
      center={[mapCenter.latitude, mapCenter.longitude]}
      zoom={mapCenter.zoom}
      scrollWheelZoom={scrollWheelZoom}
      className={mapContainerClassName}
    >
      <UpdateMapCenter mapCenter={mapCenter}/>
      <TileLayer attribution={ATTRIBUTION} url={URL}/>
      {markers.map(({id: markerId, coordinates, popupNode}) => {
        const isActive = activeMarkers.includes(markerId);
        return (
          <Marker
            key={markerId}
            position={[coordinates.latitude, coordinates.longitude]}
            icon={isActive ? activeMarker : defaultMarker}
            zIndexOffset={isActive ? TOP_MARKER_Z_INDEX : 0}
          >
            {popupNode && <Popup>{popupNode}</Popup>}
          </Marker>
        );
      })}
    </MapContainer>
  );
};
