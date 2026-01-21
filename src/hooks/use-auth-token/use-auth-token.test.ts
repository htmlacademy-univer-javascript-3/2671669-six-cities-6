import {renderHook} from '@testing-library/react';
import {Mock, vi} from 'vitest';
import * as ReduxHooks from '../../shared/redux-helpers/typed-hooks';
import {RequestStatus} from '../../shared/server/request-status';
import {LocalStorageHelpers} from '../../shared/utils/local-storage-helpers';
import {checkUserLogin} from '../../slices/current-user-slice/current-user-slice';
import {useAuthToken} from './use-auth-token';
vi.mock('../../shared/redux-helpers/typed-hooks');
vi.mock('../../shared/utils/local-storage-helpers');
vi.mock('../../slices/current-user-slice/current-user-slice');

describe('useAuthToken Hook', () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(dispatchMock);
  });

  it('should return true and NOT dispatch action if token does NOT exist', () => {
    (LocalStorageHelpers.getAuthToken as Mock).mockReturnValue(null);
    vi.spyOn(ReduxHooks, 'useAppSelector').mockReturnValue(RequestStatus.idle);

    const {result} = renderHook(() => useAuthToken());

    expect(result.current).toBe(true);

    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('should return false and dispatch checkUserLogin if token exists and status is loading/idle', () => {
    const mockToken = 'secret-token';
    const mockAction = {type: 'test/checkUserLogin'};

    (LocalStorageHelpers.getAuthToken as Mock).mockReturnValue(mockToken);
    vi.spyOn(ReduxHooks, 'useAppSelector').mockReturnValue(RequestStatus.pending);
    (checkUserLogin as unknown as Mock).mockReturnValue(mockAction);

    const {result} = renderHook(() => useAuthToken());

    expect(result.current).toBe(false);

    expect(checkUserLogin).toHaveBeenCalledWith(mockToken);
    expect(dispatchMock).toHaveBeenCalledWith(mockAction);
  });

  it('should return true if token exists and status is Success', () => {
    (LocalStorageHelpers.getAuthToken as Mock).mockReturnValue('token');
    vi.spyOn(ReduxHooks, 'useAppSelector').mockReturnValue(RequestStatus.success);

    const {result} = renderHook(() => useAuthToken());

    expect(result.current).toBe(true);
  });

  it('should return true if token exists and status is Failure', () => {
    (LocalStorageHelpers.getAuthToken as Mock).mockReturnValue('token');
    vi.spyOn(ReduxHooks, 'useAppSelector').mockReturnValue(RequestStatus.failure);

    const {result} = renderHook(() => useAuthToken());

    expect(result.current).toBe(true);
  });
});
