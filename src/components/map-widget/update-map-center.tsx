import {FC} from 'react';
import {useMap} from 'react-leaflet';
import {Coordinates} from '../../shared/entities/coordinates/coordinates.ts';

type UpdateMapCentreProps = {
  mapCenter: Coordinates;
}

export const UpdateMapCenter: FC<UpdateMapCentreProps> = ({mapCenter}) => {
  const map = useMap();
  map.panTo([mapCenter.latitude, mapCenter.longitude],);
  map.setZoom(mapCenter.zoom);
  return null;
};
