import React from 'react';
import { MapWidget } from '../../components/map/map';
import { DEFAULT_CITY } from '../../shared/entities/city/constant';
import { Offer } from '../../shared/entities/offer/types';
import { useAppSelector } from '../../shared/redux-helpers/typed-hooks';

export const MapWrapper: React.FC = () => {
  const cities = useAppSelector((state) => state.offers.cities);
  const currentCity = useAppSelector((state) => state.offers.currentCity);
  const offers = useAppSelector((state) => state.offers.currentCityOffers);
  const activeOfferId = useAppSelector((state) => state.offers.activeOfferId);

  const cityCoordinates = cities[currentCity]?.location ?? DEFAULT_CITY.location;

  const markers = offers.map((offer: Offer) => ({
    id: offer.id,
    coordinates: offer.location,
    popupNode: offer.title,
  }));

  return (
    <MapWidget
      mapCenter={cityCoordinates}
      markers={markers}
      mapContainerClassName="cities__map"
      activeMarkers={activeOfferId ? [activeOfferId] : []}
    />
  );
};
