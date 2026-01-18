import { useEffect, useRef } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Offer } from '../../shared/entities/offer/types';

// Фикс для иконок Leaflet в React
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

const DEFAULT_CITY = {
  latitude: 52.37454,
  longitude: 4.897976,
  zoom: 12,
};

type MapProps = {
  offers: Offer[];
  activeCardId?: string | null;
  className?: string;
};

function Map({ offers, activeCardId, className = '' }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<leaflet.Map | null>(null);
  const markersRef = useRef<leaflet.Marker[]>([]);
  const layerRef = useRef<leaflet.Layer | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Создаем карту
      mapInstanceRef.current = leaflet.map(mapRef.current, {
        center: [DEFAULT_CITY.latitude, DEFAULT_CITY.longitude],
        zoom: DEFAULT_CITY.zoom,
        scrollWheelZoom: false,
      });

      // Добавляем слой карты
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
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || offers.length === 0) {
      return;
    }

    // Удаляем старые маркеры
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Добавляем новые маркеры
    offers.forEach((offer) => {
      const marker = leaflet
        .marker([offer.location.latitude, offer.location.longitude], {
          title: offer.title,
          icon: offer.id === activeCardId ? activeIcon : defaultIcon,
        })
        .addTo(mapInstanceRef.current!);

      // Добавляем попап с информацией
      marker.bindPopup(`<b>${offer.title}</b><br>€${offer.price} per night`);

      markersRef.current.push(marker);
    });

    // Если есть предложения, центрируем карту на них
    if (offers.length > 0) {
      const bounds = leaflet.latLngBounds(
        offers.map((offer) => [offer.location.latitude, offer.location.longitude])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [offers, activeCardId]);

  return <div ref={mapRef} className={`map ${className}`} style={{ height: '100%' }} />;
}

export default Map;
