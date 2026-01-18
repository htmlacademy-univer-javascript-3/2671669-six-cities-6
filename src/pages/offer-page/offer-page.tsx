import { useParams } from 'react-router-dom';

function OfferPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="page">
      <h1>Страница предложения</h1>
      <p>ID: {id}</p>
    </div>
  );
}

export default OfferPage;
