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
import { SearchIndex, SearchIndexer } from '../../../libs/search';
import { getScrollMax, getScrollTop } from '../../../libs/scroll';
import { format } from 'date-fns';
import EarnAdd from './EarnAdd';
import ProTable, { ProColumns } from '@ant-design/pro-table';

export type EarnFilter = (earns: Earn[]) => Earn[];

export type EarnTableProps = {
  search?: string;
  filter?: EarnFilter;
  rowSelection?: TableRowSelection<Earn>;
  activeKey: string,
  page: number,
  setPage: any,
};

const diff = (...props: (keyof Earn)[]) => {
  return (earn: Earn, prev: Earn) => {
    for (const prop of props) {
      if (earn[prop] !== prev[prop]) return true;
    }
    return false;
  };
};

const columns: ProColumns<Earn> = [
  {
    title: '作家記号',
    key: 'artist_code',
    render: (_, { artist, id }) => (
      <div style={{ minWidth: '8em' }}>
        <Link to={`/artists/${artist?.id}`}>{artist?.code}</Link>
      </div>
    ),
    shouldCellUpdate: diff('artist'),
  },
  {
    title: '作品番号',
    key: 'code',
    render: (_, { code, id }) => (
      <div style={{ width: '8em' }}>
        {code}
      </div>
    ),
    shouldCellUpdate: diff('code'),
  },
  {
    title: '価格',
    key: 'money',
    render: (_, { money, id }) => (
      <div style={{ width: '6em' }}>
        ¥{money.toLocaleString()}
      </div>
    ),
    shouldCellUpdate: diff('money'),
  },
  {
    title: '売上日',
    key: 'date',
    render: (_, { date, id }) => (
      <div style={{ width: '8em' }}>
        {format(new Date(date), 'yyyy年MM月dd日')}
      </div>
    ),
    shouldCellUpdate: diff('date'),
  },
  {
    title: '変更',
    key: 'button',
    width: '8em',
    render: (_, reserve_earn) => (
      <>
        {/* <ReserveEarnEdit key={"edit_reserve_earn_"+reserve_earn.id} reserve_earn={reserve_earn}/>
        <ReserveEarnDelete key={"delete_reserve_earn_"+reserve_earn.id}  reserve_earn={reserve_earn}/> */}
      </>
    ),
  },
];

const earnIndexer: SearchIndexer<Earn> = (c, a) => {
  a(c.artist?.code + c.code);
  a(c.artist?.code ?? '');
  a(c.artist?.name ?? '');
};

const EarnTable: React.FC<EarnTableProps> = ({
  search,
  filter,
  rowSelection: rowSelectionProps,
  activeKey,
  page,
  setPage,
}) => {


  const { data: data, isLoading: earnIsLoading } =
    useEarns(Number(activeKey), page) as UseQueryResult<Earn[]>;
  const _rawEarns = data;

  const { data: _Rawlength, isLoading: lengthIsLoading } =
    useEarnsLength(Number(activeKey)) as UseQueryResult<number>; 
    
  const length = _Rawlength ?? 1;
  const isLoading = earnIsLoading || lengthIsLoading;
  
  const earns = useMemo(() => {
    const rawEarns = _rawEarns ?? [];
    const filteredEarns = filter ? filter(rawEarns) : rawEarns;
    return filteredEarns.map((v) => ({ ...v, key: v.id }));
  }, [_rawEarns, filter]);

  // removeStaleKeys from selection
  useEffect(() => {
    if (rowSelectionProps?.selectedRowKeys && rowSelectionProps.onChange) {
      const { selectedRowKeys, onChange } = rowSelectionProps;
      const newKeys = selectedRowKeys.filter((key) =>
        earns.find((c) => c.id === key),
      );
      if (!isEqual(sortBy(selectedRowKeys), sortBy(newKeys))) {
        onChange(
          newKeys,
          earns.filter((c) => newKeys.indexOf(c.id) !== -1),
          { type: 'multiple' },
        );
      }
    }
    // we can do this because rowSelectionProps itself never mutate to invalid state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earns]);

  // search
  const index = useMemo(() => {
    const index = new SearchIndex();
    for (const c of earns) {
      index.addDocument(c.id.toString(), c, earnIndexer);
    }
    return index;
  }, [earns]);
  const searchedEarn = useMemo(() => {
    if (search && index) {
      const ids = index.search(search).map((v) => Number(v));
      const sc = earns.filter((c) => ids.indexOf(Number(c.id)) !== -1);
      return sc;
    } else {
      return earns;
    }
  }, [earns, search, index]);

  // growing table
  const [pageSize, setPageSize] = useState(2000);
  const pagination: TableProps<Earn>['pagination'] = {
    pageSize,
    position: [],
  };
  useEffect(() => {
    let resized = false;
    const listener = () => {
      const remain = getScrollMax()[0] - getScrollTop();
      if (remain < 500 && !resized && pageSize < searchedEarn.length) {
        setPageSize(pageSize + 15);
        resized = true;
      } else if (remain > 1500 && pageSize > 20) {
        setPageSize(pageSize - 15);
      }
    };
    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, searchedEarn]);
  useEffect(() => {
    if (getScrollTop() === 0) {
      setPageSize(20);
    }
  }, [searchedEarn.length]);

  // selection handling for growing table
  const onSelectionChange: TableRowSelection<Earn>['onChange'] = (
    value,
    rows,
    info,
  ) => {
    // preserve out-of-search values
    const prev = rowSelectionProps?.selectedRowKeys ?? [];
    const outOfSearch = prev.filter(
      (k) => !searchedEarn.find((c) => c.id === k),
    );
    const newKeys = [...new Set([...outOfSearch, ...value]).values()];
    const newRows = earns.filter((c) => newKeys.includes(c.id));
    rowSelectionProps?.onChange?.(newKeys, newRows, info);
  };

  const searchedSelection = useMemo(() => {
    return (
      rowSelectionProps?.selectedRowKeys &&
      rowSelectionProps.selectedRowKeys.filter((k) =>
        searchedEarn.find((c) => c.id === k),
      )
    );
  }, [rowSelectionProps?.selectedRowKeys, searchedEarn]);
  const selectAllEarn = (() => {
    if (searchedSelection) {
      const checked =
        !!searchedSelection.length &&
        searchedEarn.length === searchedSelection.length;
      const indeterminate =
        !!searchedSelection.length &&
        searchedEarn.length > searchedSelection.length;
      return (
        searchedSelection && (
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            onChange={() => {
              if (!checked || indeterminate) {
                onSelectionChange(
                  searchedEarn.map((c) => c.id),
                  [],
                  { type: 'all' },
                );
              } else {
                onSelectionChange([], [], { type: 'all' });
              }
            }}
          />
        )
      );
    } else {
      return null;
    }
  })();

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <ProTable
          scroll={{ x: true }}
          dataSource={searchedEarn}
          loading={isLoading}
          columns={columns}
          rowSelection={{
            ...rowSelectionProps,
            onChange: onSelectionChange,
            columnTitle: selectAllEarn,
          }}
          search={false}
          size="small"
          pagination={pagination}
          tableExtraRender={(_, data) => (
            <Card>
              <EarnAdd activeKey={activeKey}/>
            </Card>
          )}
        />
        <Pagination defaultCurrent={1} showSizeChanger={false} current={page} pageSize={50} total={length} onChange={(page) => setPage(page)}/>
      </Space>
    </>
  );
};

export const useEarnTable = (props: EarnTableProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedEarns, setSelectedEarns] = useState<Earn[]>(
    [],
  );
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[], earns: Earn[]) => {
      setSelectedRowKeys(keys);
      setSelectedEarns(earns as Earn[]);
    },
  };

  const table = <EarnTable rowSelection={rowSelection} {...props} />;

  return [table, selectedEarns] as const;
};

export default EarnTable;
