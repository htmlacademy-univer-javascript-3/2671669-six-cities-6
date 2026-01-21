import React, {FC, useMemo} from 'react';
import {MapWidget} from '../../components/map-widget/map-widget.tsx';
import {PointOnMap} from '../../components/map-widget/model/types.ts';
import {DEFAULT_CITY} from '../../shared/entities/city/constants.ts';
import {useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';

export const MapWrapper: FC = React.memo(() => {
  const currentCity = useAppSelector((state) => state.offers.cities[state.offers.currentCity]) ?? DEFAULT_CITY;
  const offers = useAppSelector((state) => state.offers.currentCityOffers);
  const activeOfferId = useAppSelector((state) => state.offers.activeOfferId);

  const markers: PointOnMap[] = useMemo(() => offers.map((offer) => ({
    id: offer.id,
    coordinates: offer.location,
    popupNode: offer.title
  })), [offers]);

  return (
    <MapWidget
      mapCenter={currentCity.location}
      markers={markers}
      activeMarkers={activeOfferId ? [activeOfferId] : []}
      mapContainerClassName="cities__map map"
    />
  );
});

MapWrapper.displayName = 'MapWrapper';
