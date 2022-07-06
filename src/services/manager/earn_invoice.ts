import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Artist } from './artist';
import { request } from '@/libs/request';

export type Store = {
  id: number;
  name: string;
};

export type EarnInvoice = {
  id: number;
  yearmonth: string;
  lock_type: boolean;
};

export type StartCalcParam = {
  yearmonth: string,
};
export type ReCalcParam = {
  earn_invoice_id: number,
};
export type ReCalcEachParam = {
  each_earn_invoice_id: number,//削除に必要
  artist_id: number,
  earn_invoice_id: number,
};
export type ChangeStatusParam = {
  each_earn_invoice_id: number,
  artist_id: number,
  earn_invoice_id: number,
};

export type ChangeLockParam = {
  yearmonth: string,
};


const earnInvoiceQueryKey = '/api/manager/earn_invoice/';
export const useEarnInvoice = (yearmonth: string) => useQuery<EarnInvoice>(earnInvoiceQueryKey+yearmonth);

const eachEarnInvoiceQueryKey = '/api/manager/earn_invoice/each/';
export const useEachEarnInvoice = (earn_invoice_id: number) => useQuery<EarnInvoice>(eachEarnInvoiceQueryKey+earn_invoice_id);

export const useStartCalcMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: StartCalcParam) => {
      return request('/api/manager/earn_invoice/calc', { method: 'post', data: data });
    },
    {
      onSuccess(res, data: StartCalcParam) {
        client.invalidateQueries(earnInvoiceQueryKey+data.yearmonth);
      },
    },
  );
};
export const useReCalcMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: ReCalcParam) => {
      return request('/api/manager/earn_invoice/calc', { method: 'patch', data: data });
    },
    {
      onSuccess(res, data: ReCalcParam) {
        client.invalidateQueries(eachEarnInvoiceQueryKey+data.earn_invoice_id);
      },
    },
  );
};
export const useReCalcEachMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: ReCalcEachParam) => {
      return request('/api/manager/earn_invoice/each/calc', { method: 'patch', data: data });
    },
    {
      onSuccess(res, data: ReCalcParam) {
        client.invalidateQueries(eachEarnInvoiceQueryKey+data.earn_invoice_id);
      },
    },
  );
};
const artistQueryKey = '/api/manager/artist/';
export const useChangeStatusMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: ChangeStatusParam) => {
      return request('/api/manager/earn_invoice/each/status', { method: 'patch', data: data });
    },
    {
      onSuccess(res, data: ChangeStatusParam) {
        client.invalidateQueries(eachEarnInvoiceQueryKey+data.earn_invoice_id);
        client.invalidateQueries(artistQueryKey+data.artist_id);
      },
    },
  );
};
export const useChangeLockMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: ChangeLockParam) => {
      return request('/api/manager/earn_invoice/lock', { method: 'post', data: data });
    },
    {
      onSuccess(res, data: ChangeLockParam) {
        client.invalidateQueries(earnInvoiceQueryKey+data.yearmonth);
      },
    },
  );
};
