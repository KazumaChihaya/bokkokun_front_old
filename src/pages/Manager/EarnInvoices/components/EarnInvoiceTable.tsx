import {
  Earn,
  useEarns,
  useEarnsLength,
} from '@/services/manager/earn';
import { Card, Checkbox, Descriptions, Pagination, Space, Table } from 'antd';
import { UseQueryResult } from 'react-query';
import type { ColumnsType, TableProps } from 'antd/lib/table';
import React, { Key, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TableRowSelection } from 'antd/lib/table/interface';
import { isEqual, sortBy } from 'lodash-es';
import { SearchIndex, SearchIndexer } from '@/libs/search';
import { getScrollMax, getScrollTop } from '@/libs/scroll';
import { format } from 'date-fns';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { status_opt } from './util';
import { useEarnInvoice, useEachEarnInvoice } from '@/services/manager/earn_invoice';
import { EarnInvoice, EachEarnInvoice } from '@/services/manager/artist';
import StartCalc from './StartCalc';
import ReCalc from './ReCalc';
import ReCalcEach from './ReCalcEach';
import ChangeStatus from './ChangeStatus';

export type EarnFilter = (earns: Earn[]) => Earn[];

export type EarnInvoiceTableProps = {
  activeKey: string,
  earn_invoice: EarnInvoice,
};

const diff = (...props: (keyof EachEarnInvoice)[]) => {
  return (earn: EachEarnInvoice, prev: EachEarnInvoice) => {
    for (const prop of props) {
      if (earn[prop] !== prev[prop]) return true;
    }
    return false;
  };
};

const eachEarnInvoiceColumns: ColumnsType<EachEarnInvoice> = [
  {
    title: '作家名',
    key: 'artist_code',
    render: (_, { artist, id }) => (
      <div style={{ minWidth: '8em' }}>
        <Link to={`/manager/artists/${artist?.id}`}>{artist?.name}</Link>
      </div>
    ),
    shouldCellUpdate: diff('artist'),
  },
  {
    title: '作家記号',
    key: 'code',
    render: (_, { artist, id }) => (
      <div style={{ minWidth: '8em' }}>{artist?.code}</div>
    ),
    shouldCellUpdate: diff('artist'),
  },
  {
    title: '売上金額',
    key: 'money',
    render: (_, { money, id }) => (
      <div style={{ width: '6em' }}>
        ¥{money.toLocaleString()}
      </div>
    ),
    shouldCellUpdate: diff('money'),
  },
  {
    title: '箱代相殺使用',
    key: 'offset_money',
    render: (_, { offset_money, id }) => (
      <div style={{ width: '6em' }}>
        ¥{offset_money.toLocaleString()}
      </div>
    ),
    shouldCellUpdate: diff('offset_money'),
  },
  {
    title: '支払金額',
    key: 'result_money',
    render: (_, { offset_money, money, id }) => (
      <div style={{ width: '6em' }}>
        ¥{(money - offset_money).toLocaleString()}
      </div>
    ),
    shouldCellUpdate: diff('money', 'offset_money'),
  },
  {
    title: '支払',
    key: 'status',
    render: (_, each_earn_invoice) => (
      <div style={{ width: '10em' }}>
        <span style={{marginRight: '5px'}}>{status_opt[each_earn_invoice.status ? 1 : 0]}</span>
        <ChangeStatus key={"change_finish_"+each_earn_invoice.id+"_"+each_earn_invoice.status} status={each_earn_invoice.status} each_earn_invoice_id={each_earn_invoice.id} earn_invoice_id={each_earn_invoice.earn_invoice_id} artist_id={each_earn_invoice.artist_id}/> 
      </div>
    ),
    shouldCellUpdate: diff('status'),
  },
  {
    title: '変更',
    key: 'button',
    width: '8em',
    render: (_, each_earn_invoice) => (
      <>
        {
          each_earn_invoice.status === false ? 
          <ReCalcEach key={"recalc_each_"+each_earn_invoice.id} each_earn_invoice_id={each_earn_invoice.id} earn_invoice_id={each_earn_invoice.earn_invoice_id} artist_id={each_earn_invoice.artist_id}/>
          : <></>
        }
        </>
    ),
  },
];


const EarnInvoiceTable: React.FC<EarnInvoiceTableProps> = ({
  activeKey,
  earn_invoice,
}) => {

  const { data: data, isLoading: isEachEarnInvoiceLoading } =
    useEachEarnInvoice(Number(earn_invoice?.id)) as UseQueryResult<{each_earn_invoices: EachEarnInvoice[]}>;
  
    const each_earn_invoices = data?.each_earn_invoices;

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card>
          <Table
            scroll={{ x: true }}
            dataSource={each_earn_invoices}
            columns={eachEarnInvoiceColumns}
            size="small"
            pagination={false}
          />
        </Card>
        <div>
          <ReCalc activeKey={activeKey} earn_invoice_id={earn_invoice.id} key={earn_invoice.id}></ReCalc>
        </div>
      </Space>
    </>
  );
};

export default EarnInvoiceTable;
