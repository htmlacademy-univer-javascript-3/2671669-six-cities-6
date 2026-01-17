import MainPage from '../pages/main-page/main-page';

interface AppProps {
  offersCount: number;
}

function App({ offersCount }: AppProps) {
  return <MainPage offersCount={offersCount} />;
}

export default App;
