import { useEffect, useRef } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Offer } from '../../shared/entities/offer/types';
import { CityName } from '../../shared/entities/city/types';

const defaultIcon = leaflet.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const activeIcon = leaflet.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-red.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Центры городов для разных CityName
const CITY_CENTERS: Record<CityName, { latitude: number; longitude: number; zoom: number }> = {
  [CityName.Amsterdam]: { latitude: 52.37454, longitude: 4.897976, zoom: 12 },
  [CityName.Paris]: { latitude: 48.85661, longitude: 2.351499, zoom: 12 },
  [CityName.Cologne]: { latitude: 50.93753, longitude: 6.96028, zoom: 12 },
  [CityName.Brussels]: { latitude: 50.85045, longitude: 4.34878, zoom: 12 },
  [CityName.Hamburg]: { latitude: 53.55073, longitude: 9.99302, zoom: 12 },
  [CityName.Dusseldorf]: { latitude: 51.22540, longitude: 6.77631, zoom: 12 },
};

type MapProps = {
  offers: Offer[];
  activeCardId?: string | null;
  cityName: CityName;
  className?: string;
};

function Map({ offers, activeCardId, cityName, className = '' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<leaflet.Map | null>(null);
  const markersRef = useRef<leaflet.Marker[]>([]);
  const layerRef = useRef<leaflet.Layer | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const cityCenter = CITY_CENTERS[cityName];
      mapInstanceRef.current = leaflet.map(mapRef.current, {
        center: [cityCenter.latitude, cityCenter.longitude],
        zoom: cityCenter.zoom,
        scrollWheelZoom: false,
      });

      layerRef.current = leaflet
        .tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          }
        )
        .addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [cityName]); // ← Добавили cityName в зависимости

  useEffect(() => {
    if (!mapInstanceRef.current) {
      return;
    }

    const cityCenter = CITY_CENTERS[cityName];
    mapInstanceRef.current.setView(
      [cityCenter.latitude, cityCenter.longitude],
      cityCenter.zoom
    );
  }, [cityName]);

  useEffect(() => {
    if (!mapInstanceRef.current || offers.length === 0) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Правильное сравнение enum: приводим к строке или сравниваем напрямую
    const cityOffers = offers.filter((offer) => offer.city === cityName);

    cityOffers.forEach((offer) => {
      const marker = leaflet
        .marker([offer.location.latitude, offer.location.longitude], {
          title: offer.title,
          icon: offer.id === activeCardId ? activeIcon : defaultIcon,
        })
        .addTo(mapInstanceRef.current!);

      marker.bindPopup(`<b>${offer.title}</b><br>€${offer.price} per night`);
      markersRef.current.push(marker);
    });

    if (cityOffers.length > 0) {
      const bounds = leaflet.latLngBounds(
        cityOffers.map((offer) => [offer.location.latitude, offer.location.longitude])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [offers, activeCardId, cityName]);

  return <div ref={mapRef} className={`map ${className}`} style={{ height: '100%' }} />;
}

export default Map;
