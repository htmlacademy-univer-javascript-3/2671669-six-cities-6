import { useParams, Link } from 'react-router-dom';
import { Offer } from '../../shared/entities/offer/types';
import { Review } from '../../mocks';
import ReviewForm from '../../components/review-form/review-form';
import ReviewsList from '../../components/reviews-list/review-list'; // ✅ Новый
import NearbyOffersList from '../../components/nearby-offers-list/nearby-offers-list'; // ✅ Новый
import Map from '../../components/map/map'; // ✅ Новый

interface OfferPageProps {
  offers: Offer[];
  reviews: Review[];
}

function OfferPage({ offers, reviews }: OfferPageProps) {
  const { id } = useParams<{ id: string }>();
  const offer = offers.find((o) => o.id === id);

  if (!offer) {
    return (
      <div className="page">
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h1>Offer not found</h1>
          <Link to="/">Back to main</Link>
        </div>
      </div>
    );
  }

  // Находим предложения в том же городе (кроме текущего)
  const nearbyOffers = offers
    .filter((o) => o.id !== offer.id && o.city === offer.city)
    .slice(0, 3); // Берем максимум 3 предложения

  return (
    <div className="page">
      <header className="header">
        {/* ... header без изменений ... */}
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          {/* ... галерея и информация о предложении ... */}

          {/* ✅ Заменяем ручной вывод отзывов на ReviewsList */}
          <ReviewsList reviews={reviews} />

          {/* Форма остается */}
          <ReviewForm />
        </section>

        {/* ✅ Добавляем карту с предложениями рядом */}
        <section className="offer__map map">
          <Map offers={nearbyOffers} />
        </section>

        {/* ✅ Добавляем блок с предложениями рядом */}
        <div className="container">
          <NearbyOffersList offers={nearbyOffers} />
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
