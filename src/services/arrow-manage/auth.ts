import { useMutation, useQuery, useQueryClient } from 'react-query';
import { request } from '@/libs/request';

export type SessionData = {
  type: string,
  id: number;
  email: string;
  name: string;
  status: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResult = {
  result: 'ok';
};

const SessionQueryKey = '/api/auth/session/manager';

export const useSession = () => useQuery<SessionData>(SessionQueryKey);

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: LoginParams) => {
      return request<LoginResult>({
        url: '/api/auth/login/manager',
        method: 'post',
        data,
      });
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(SessionQueryKey);
      },
    },
  );
};

export const useLogoutMutation = () =>
  useMutation(() => {
    return request('/api/auth/session/manager', { method: 'delete' });
  });
