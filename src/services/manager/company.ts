import { request } from '@/libs/request';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// Company
export type Company = {
  id: number;
  name: string;
  kana: string;
  code: string;
  dbname: string;
  ver: number;
  tags: { companyId: number; tag: string }[];
  registeredOn: number;
  useStatus: number;
  plan: number;
  payMethod: number;
  documentStatus: number | null;
  bankId: number | null;
  bankType: number | null;
  bankNum: number | null;
  creditSendid: string | null;
  creditTelno: string | null;
  creditEmail: string | null;
  creditYearmonth: string | null;
};

export type CompanyDetail = Company & {
  staffName: string;
  zipcode: string;
  address: string;
  tel: string;
  email: string;

  branchCount: number;
};

const companyQueryKey = '/api/manager/company/companies';
const companyDetailsQueryKey = '/api/manager/company/companies/all';

export const useCompanies = () => useQuery<Company[]>(companyQueryKey);

export const useCompanyDetails = () => {
  const status = useCompanies();
  const details = useQuery<CompanyDetail[]>(companyDetailsQueryKey);

  return details.isFetched ? details : status;
};

// Tags
export type AddCompanyTagsParam = {
  companies: number[];
  tags: string[];
};

export type DeleteCompanyTagsParam = AddCompanyTagsParam;

const tagsQueryKey = '/api/manager/company/tags';

export const useCompanyTags = () => useQuery<string[]>(tagsQueryKey);

export const useAddCompanyTagsMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: AddCompanyTagsParam) => {
      return request('/api/manager/company/addTags', { method: 'post', data });
    },
    {
      onSuccess() {
        client.invalidateQueries({
          predicate: (v) => v.queryKey.indexOf(companyQueryKey) === 0,
        });
      },
    },
  );
};

export const useDeleteCompanyTagsMutation = () => {
  const client = useQueryClient();
  return useMutation(
    (data: DeleteCompanyTagsParam) => {
      return request('/api/manager/company/deleteTags', { method: 'post', data });
    },
    {
      onSuccess() {
        client.invalidateQueries({
          predicate: (v) => v.queryKey.indexOf(companyQueryKey) === 0,
        });
      },
    },
  );
};
