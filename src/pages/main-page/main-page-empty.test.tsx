import {configureMockStore} from '@jedmao/redux-mock-store';
import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MainPageEmpty} from './main-page-empty';

const mockStore = configureMockStore();

describe('Component: MainPageEmpty', () => {
  it('should render correctly with the current city from store', () => {
    const mockCity = 'Dusseldorf';

    const store = mockStore({
      offers: {
        currentCity: mockCity,
      },
    });

    render(
      <Provider store={store}>
        <MainPageEmpty/>
      </Provider>
    );

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(screen.getByText(`We could not find any property available at the moment in ${mockCity}`)).toBeInTheDocument();
  });
});
