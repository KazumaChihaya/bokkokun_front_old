import { useQuery } from 'react-query';
import { Box } from '../manager/box';

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
};

const artistQueryKey = '/api/artist/home';

export const useArtist = () => useQuery<Artist>(artistQueryKey);