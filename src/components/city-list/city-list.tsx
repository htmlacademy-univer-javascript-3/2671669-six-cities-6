import { useDispatch, useSelector } from 'react-redux';
import { changeCity } from '../../store/actions';
import { RootState } from '../../store';
import { CityName } from '../../shared/entities/city/types'; // ← Импортируем enum
import { cities } from '../../shared/entities/city/constant'; // ← Ваш массив городов

function CityList() {
  const dispatch = useDispatch();
  const currentCity = useSelector((state: RootState) => state.app.city);

  return (
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {cities.map((cityName: CityName) => ( // ← Явно указываем тип
          <li key={cityName} className="locations__item">
            <a
              className={`locations__item-link tabs__item ${
                cityName === currentCity ? 'tabs__item--active' : ''
              }`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                dispatch(changeCity(cityName)); // ← Передаём CityName
              }}
            >
              <span>{cityName}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CityList;
