import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../shared/redux-helpers/typed-hooks.ts';
import {RequestStatus} from '../../shared/server/request-status.ts';
import {LocalStorageHelpers} from '../../shared/utils/local-storage-helpers.ts';
import {checkUserLogin} from '../../slices/current-user-slice/current-user-slice.ts';

export const useAuthToken = (): boolean => {
  const dispatch = useAppDispatch();
  const checkAuthStatus = useAppSelector((state) => state.currentUser.checkAuthStatus);
  const token = LocalStorageHelpers.getAuthToken();

  useEffect(() => {
    if (token) {
      dispatch(checkUserLogin(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return token === null || checkAuthStatus === RequestStatus.success || checkAuthStatus === RequestStatus.failure;
};
