import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Artist } from './artist';
import { request } from '@/libs/request';

export type Store = {
  id: number;
  name: string;
};

export type BoxInvoice = {
  id: number;
  yearmonth: string;
  lock_type: boolean;
};

export type StartCalcParam = {
  yearmonth: string,
};
export type ReCalcParam = {
  box_invoice_id: number,
};
export type ReCalcEachParam = {
  each_box_invoice_id: number,//削除に必要
  artist_id: number,
  box_invoice_id: number,
};
export type ChangeStatusParam = {
  each_box_invoice_id: number,
  artist_id: number,
  box_invoice_id: number,
};

export type ChangeLockParam = {
  yearmonth: string,
};


const boxInvoiceQueryKey = '/api/manager/box_invoice/';
export const useBoxInvoice = (yearmonth: string) => useQuery<BoxInvoice>(boxInvoiceQueryKey+yearmonth);

const eachBoxInvoiceQueryKey = '/api/manager/box_invoice/each/';
export const useEachBoxInvoice = (box_invoice_id: number) => useQuery<BoxInvoice>(eachBoxInvoiceQueryKey+box_invoice_id);

export const useStartCalcMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: StartCalcParam) => {
      return request('/api/manager/box_invoice/calc', { method: 'post', data: data });
    },
    {
      onSuccess(res, data: StartCalcParam) {
        client.invalidateQueries(boxInvoiceQueryKey+data.yearmonth);
      },
    },
  );
};
export const useReCalcMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: ReCalcParam) => {
      return request('/api/manager/box_invoice/calc', { method: 'patch', data: data });
    },
    {
      onSuccess(res, data: ReCalcParam) {
        client.invalidateQueries(eachBoxInvoiceQueryKey+data.box_invoice_id);
      },
    },
  );
};
export const useReCalcEachMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: ReCalcEachParam) => {
      return request('/api/manager/box_invoice/each/calc', { method: 'patch', data: data });
    },
    {
      onSuccess(res, data: ReCalcParam) {
        client.invalidateQueries(eachBoxInvoiceQueryKey+data.box_invoice_id);
      },
    },
  );
};
const artistQueryKey = '/api/manager/artist/';
export const useChangeStatusMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: ChangeStatusParam) => {
      return request('/api/manager/box_invoice/each/status', { method: 'patch', data: data });
    },
    {
      onSuccess(res, data: ChangeStatusParam) {
        client.invalidateQueries(eachBoxInvoiceQueryKey+data.box_invoice_id);
        client.invalidateQueries(artistQueryKey+data.artist_id);
      },
    },
  );
};
export const useChangeLockMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: ChangeLockParam) => {
      return request('/api/manager/box_invoice/lock', { method: 'post', data: data });
    },
    {
      onSuccess(res, data: ChangeLockParam) {
        client.invalidateQueries(boxInvoiceQueryKey+data.yearmonth);
      },
    },
  );
};
