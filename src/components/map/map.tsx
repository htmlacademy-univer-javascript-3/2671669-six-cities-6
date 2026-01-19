// src/components/map/map.tsx (обновленный)
import { useEffect, useRef } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Offer } from '../../shared/entities/offer/types';
import { CityName } from '../../shared/entities/city/types';

// Используем дефолтный маркер
const defaultIcon = leaflet.icon({
  iconUrl: '/img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

// Активный маркер (оранжевый)
const activeIcon = leaflet.icon({
  iconUrl: '/img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

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
  activeCardId: string | null;
  cityName: CityName;
  className?: string;
};

function Map({ offers, activeCardId, cityName, className = '' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<leaflet.Map | null>(null);
  const markersRef = useRef<leaflet.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const cityCenter = CITY_CENTERS[cityName];
      mapInstanceRef.current = leaflet.map(mapRef.current, {
        center: [cityCenter.latitude, cityCenter.longitude],
        zoom: cityCenter.zoom,
        scrollWheelZoom: false,
      });

      leaflet
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
  }, [cityName]);

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
    if (!mapInstanceRef.current) {
      return;
    }

    // Удаляем старые маркеры
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Фильтруем предложения по текущему городу
    const cityOffers = offers.filter((offer) => offer.city === cityName);

    // Создаем маркеры
    cityOffers.forEach((offer) => {
      const marker = leaflet
        .marker([offer.location.latitude, offer.location.longitude], {
          icon: offer.id === activeCardId ? activeIcon : defaultIcon,
        })
        .addTo(mapInstanceRef.current!);

      markersRef.current.push(marker);
    });

    // Центрируем карту на маркерах
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
