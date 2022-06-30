import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Box } from './box';
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
  lock_type: number,
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
  box_invoice_id: number,
  artist_id: number,
  money: number,
  status: boolean,
};
export type EachEarnInvoice = {
  earn_invoice_id: number,
  artist_id: number,
  money: number,
  status: boolean,
};



export type AddArtistParam = {
  name: string;
  code: string;
  mail: string;
  twitter: string;
  instagram: string;
  contact: number;
  rate: number;
};

export type EditArtistParam = {
  id: number,
  data: AddArtistParam,
};







export type AddActiveBoxParam = {
  box_id: number | string;
  artist_id: number;
  started_on: string;
  money: number;
}
export type AddReserveBoxParam = {
  box_id: number | string;
  artist_id: number;
  started_on: string;
}


export type ResignActiveBoxParam = {
  active_box_id: number,
  artist_id: number,
  box_id: number
  ended_on: string;
}
export type ResignReserveBoxParam = {
  reserve_box_id: number,
  artist_id: number,
  box_id: number,
  ended_on?: string;
}

export type EditActiveBoxParam = {
  active_box_id: number,
  artist_id: number,
  box_id: number,
  started_on: string;
  ended_on: string | null;
}
export type EditReserveBoxParam = {
  reserve_box_id: number,
  artist_id: number,
  box_id: number,
  started_on: string,
  ended_on: string | null;
}
export type DeleteActiveBoxParam = {
  active_box_id: number,
  artist_id: number,
  box_id: number,
}
export type DeleteReserveBoxParam = {
  reserve_box_id: number,
  artist_id: number,
  box_id: number,
}





const boxesQueryKey = '/api/box';
const boxQueryKey = '/api/box/';
const artistsQueryKey = '/api/artist';
const artistQueryKey = '/api/artist/';




export const useArtists = () => useQuery<Artist[]>(artistsQueryKey);
export const useArtist = (id: number) => useQuery<Artist>(artistQueryKey+id);

export const useCreateArtistMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: AddArtistParam) => {
      return request('/api/artist', { method: 'post', data });
    },
    {
      onSuccess() {
        client.invalidateQueries(artistsQueryKey);
      },
    },
  );
};

export const useUpdateArtistMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: EditArtistParam) => {
      return request('/api/artist/'+data.id, { method: 'patch', data: data.data });
    },
    {
      onSuccess(res, data: EditArtistParam) {
        client.invalidateQueries(artistsQueryKey);
        client.invalidateQueries(artistQueryKey+data.id);
        client.invalidateQueries({
          predicate: (v) => v.queryKey.indexOf(boxesQueryKey) === 0,
        });
      },
    },
  );
};

export const useCreateActiveBoxMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: AddActiveBoxParam) => {
      return request('/api/activebox', { method: 'post', data: data });
    },
    {
      onSuccess(res, data: AddActiveBoxParam) {
        client.invalidateQueries(artistsQueryKey);
        client.invalidateQueries(artistQueryKey+data.artist_id);
        client.invalidateQueries(boxesQueryKey);
        client.invalidateQueries(boxQueryKey+data.box_id);
      },
    },
  );
};
export const useCreateReserveBoxMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: AddReserveBoxParam) => {
      return request('/api/reservebox', { method: 'post', data: data });
    },
    {
      onSuccess(res, data: AddReserveBoxParam) {
        client.invalidateQueries(artistsQueryKey);
        client.invalidateQueries(artistQueryKey+data.artist_id);
        client.invalidateQueries(boxesQueryKey);
        client.invalidateQueries(boxQueryKey+data.box_id);
      },
    },
  );
};

export const useResignActiveBoxMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: ResignActiveBoxParam) => {
      return request('/api/activebox/resign', { method: 'post', data: data });
    },
    {
      onSuccess(res, data: ResignActiveBoxParam) {
        client.invalidateQueries(artistsQueryKey);
        client.invalidateQueries(artistQueryKey+data.artist_id);
        client.invalidateQueries(boxesQueryKey);
        client.invalidateQueries(boxQueryKey+data.box_id);
      },
    },
  );
};

export const useResignReserveBoxMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: ResignReserveBoxParam) => {
      return request('/api/reservebox/resign', { method: 'post', data: data });
    },
    {
      onSuccess(res, data: ResignReserveBoxParam) {
        client.invalidateQueries(artistsQueryKey);
        client.invalidateQueries(artistQueryKey+data.artist_id);
        client.invalidateQueries(boxesQueryKey);
        client.invalidateQueries(boxQueryKey+data.box_id);
      },
    },
  );
};


export const useEditActiveBoxMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: EditActiveBoxParam) => {
      return request('/api/activebox', { method: 'patch', data: data });
    },
    {
      onSuccess(res, data: EditActiveBoxParam) {
        client.invalidateQueries(artistsQueryKey);
        client.invalidateQueries(artistQueryKey+data.artist_id);
        client.invalidateQueries(boxesQueryKey);
        client.invalidateQueries(boxQueryKey+data.box_id);
      },
    },
  );
};

export const useEditReserveBoxMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: EditReserveBoxParam) => {
      return request('/api/reservebox', { method: 'patch', data: data });
    },
    {
      onSuccess(res, data: EditReserveBoxParam) {
        client.invalidateQueries(artistsQueryKey);
        client.invalidateQueries(artistQueryKey+data.artist_id);
        client.invalidateQueries(boxesQueryKey);
        client.invalidateQueries(boxQueryKey+data.box_id);
      },
    },
  );
};

export const useDeleteActiveBoxMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: DeleteActiveBoxParam) => {
      return request('/api/activebox', { method: 'delete', data: {id: data.active_box_id} });
    },
    {
      onSuccess(res, data: DeleteActiveBoxParam) {
        client.invalidateQueries(artistsQueryKey);
        client.invalidateQueries(artistQueryKey+data.artist_id);
        client.invalidateQueries(boxesQueryKey);
        client.invalidateQueries(boxQueryKey+data.box_id);
      },
    },
  );
};

export const useDeleteReserveBoxMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: DeleteReserveBoxParam) => {
      return request('/api/reservebox', { method: 'delete', data: {id: data.reserve_box_id} });
    },
    {
      onSuccess(res, data: DeleteReserveBoxParam) {
        client.invalidateQueries(artistsQueryKey);
        client.invalidateQueries(artistQueryKey+data.artist_id);
        client.invalidateQueries(boxesQueryKey);
        client.invalidateQueries(boxQueryKey+data.box_id);
      },
    },
  );
};