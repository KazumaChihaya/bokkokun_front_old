import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Box } from '../manager/box';
import { request } from '@/libs/request';

// Artist
export type Artist = {
  id: number;
  name: string;
  code: string;
  mail: string;
  twitter: string;
  instagram: string;
  pass: string;
  contact: number;
  rate: number;
  created_at: string;
  updated_at: string;

  status: string;
};

export type ArtistDetail = Artist & {
  aaa: string,
};

export type ActiveBox = {
  id: number;
  box_id: number,
  artist_id: number,
  started_on: string,
  ended_on?: string,
  money: number,
  created_at: string;
  updated_at: string;

  box?: Box;
  artist?: Artist;
}
export type ReserveBox = {
  id: number;
  box_id: number,
  artist_id: number,
  started_on: string,
  ended_on?: string,
  created_at: string;
  updated_at: string;

  box?: Box;
  artist?: Artist;
}
export type BoxInvoice = {
  id: number;
  yearmonth: string,
  lock_type: boolean,
  created_at: string;
  updated_at: string; 

  each_box_invoice?: EachBoxInvoice,
}
export type EarnInvoice = {
  id: number;
  yearmonth: string,
  lock_type: number,
  created_at: string;
  updated_at: string; 

  each_earn_invoice?: EachEarnInvoice,
}
export type EachBoxInvoice = {
  id: number,
  box_invoice_id: number,
  artist_id: number,
  money: number,
  status: boolean,

  artist?: Artist,
};
export type EachEarnInvoice = {
  earn_invoice_id: number,
  artist_id: number,
  money: number,
  status: boolean,
  offset_money: number,
};

export type Offset = {
  artist_id: number,
  date: string,
  money: number,
  yearmonth: string,
  earn_invoice_yearmonth: string,
}

export type OffsetParam = {
  yearmonth: string,
}
export type PayRequestParam = {
  artist_id: number,
  yearmonth: string,
}


const artistQueryKey = '/api/artist/home';

export const useArtist = () => useQuery<Artist>(artistQueryKey);

export const useOffsetMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: OffsetParam) => {
      return request('/api/artist/offset', { method: 'post', data: {yearmonth: data.yearmonth} });
    },
    {
      onSuccess(res, data: OffsetParam) {
        client.invalidateQueries(artistQueryKey);
      },
    },
  );
};

export const usePayRequestMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: PayRequestParam) => {
      return request('/api/artist/payrequest', { method: 'post', data: {artist_id: data.artist_id, yearmonth: data.yearmonth} });
    },
    {
      onSuccess(res, data: PayRequestParam) {
        client.invalidateQueries(artistQueryKey);
      },
    },
  );
};