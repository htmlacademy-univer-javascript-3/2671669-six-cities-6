import { Link } from 'react-router-dom';

function NotFound404Page() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 Not Found</h1>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </div>
  );
}

export default NotFound404Page;
