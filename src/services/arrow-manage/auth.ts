import { useMutation, useQuery, useQueryClient } from 'react-query';
import { request } from '@/libs/request';

export type SessionData = {
  manager: {
    id: number;
    email: string;
    name: string;
  };
};

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResult = {
  result: 'ok';
};

const SessionQueryKey = '/api/auth/session';

export const useSession = () => useQuery<SessionData>(SessionQueryKey);

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: LoginParams) => {
      return request<LoginResult>({
        url: '/api/auth/login',
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
    return request('/api/auth/session', { method: 'delete' });
  });
