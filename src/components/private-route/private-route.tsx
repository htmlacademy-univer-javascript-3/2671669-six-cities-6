import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: React.ReactElement;
};

function PrivateRoute({ children }: PrivateRouteProps) {
  // ПО УСЛОВИЮ ЗАДАНИЯ: всегда false
  const isAuthorized = false;

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
