import {
  Earn,
  useEarns,
  useEarnsLength,
} from '@/services/arrow-manage/earn';
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
import { useBoxInvoice, useEachBoxInvoice } from '@/services/arrow-manage/box_invoice';
import { BoxInvoice, EachBoxInvoice } from '@/services/arrow-manage/artist';
import StartCalc from './StartCalc';
import ReCalc from './ReCalc';
import ReCalcEach from './ReCalcEach';
import ChangeStatus from './ChangeStatus';

export type EarnFilter = (earns: Earn[]) => Earn[];

export type BoxInvoiceTableProps = {
  activeKey: string,
  box_invoice: BoxInvoice,
};

const diff = (...props: (keyof EachBoxInvoice)[]) => {
  return (earn: EachBoxInvoice, prev: EachBoxInvoice) => {
    for (const prop of props) {
      if (earn[prop] !== prev[prop]) return true;
    }
    return false;
  };
};

const eachBoxInvoiceColumns: ColumnsType<EachBoxInvoice> = [
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
    title: '金額',
    key: 'money',
    render: (_, { money, id }) => (
      <div style={{ width: '6em' }}>
        ¥{money.toLocaleString()}
      </div>
    ),
    shouldCellUpdate: diff('money'),
  },
  {
    title: '支払',
    key: 'status',
    render: (_, each_box_invoice) => (
      <div style={{ width: '10em' }}>
        <span style={{marginRight: '5px'}}>{status_opt[each_box_invoice.status ? 1 : 0]}</span>
        <ChangeStatus key={"change_finish_"+each_box_invoice.id+"_"+each_box_invoice.status} status={each_box_invoice.status} each_box_invoice_id={each_box_invoice.id} box_invoice_id={each_box_invoice.box_invoice_id} artist_id={each_box_invoice.artist_id}/> 
      </div>
    ),
    shouldCellUpdate: diff('status'),
  },
  {
    title: '変更',
    key: 'button',
    width: '8em',
    render: (_, each_box_invoice) => (
      <>
        {
          each_box_invoice.status === false ? 
          <ReCalcEach key={"recalc_each_"+each_box_invoice.id} each_box_invoice_id={each_box_invoice.id} box_invoice_id={each_box_invoice.box_invoice_id} artist_id={each_box_invoice.artist_id}/>
          : <></>
        }
        </>
    ),
  },
];


const BoxInvoiceTable: React.FC<BoxInvoiceTableProps> = ({
  activeKey,
  box_invoice,
}) => {

  const { data: data, isLoading: isEachBoxInvoiceLoading } =
    useEachBoxInvoice(Number(box_invoice?.id)) as UseQueryResult<{each_box_invoices: EachBoxInvoice[]}>;
  
    const each_box_invoices = data?.each_box_invoices;

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card>
          <Table
            scroll={{ x: true }}
            dataSource={each_box_invoices}
            columns={eachBoxInvoiceColumns}
            size="small"
            pagination={false}
          />
        </Card>
        <div>
          <ReCalc activeKey={activeKey} box_invoice_id={box_invoice.id} key={box_invoice.id}></ReCalc>
        </div>
      </Space>
    </>
  );
};

export default BoxInvoiceTable;
