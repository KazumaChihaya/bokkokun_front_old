import {
  Box,
  useBoxes,
} from '@/services/manager/box';
import { Checkbox, Table } from 'antd';
import { UseQueryResult } from 'react-query';
import type { ColumnsType, TableProps } from 'antd/lib/table';
import React, { Key, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TableRowSelection } from 'antd/lib/table/interface';
import { isEqual, sortBy } from 'lodash-es';
import { SearchIndex, SearchIndexer } from '@/libs/search';
import { getScrollMax, getScrollTop } from '@/libs/scroll';
import { format } from 'date-fns';

export type BoxFilter = (boxs: Box[]) => Box[];

export type BoxTableProps = {
  search?: string;
  filter?: BoxFilter;
  rowSelection?: TableRowSelection<Box>;
};

const diff = (...props: (keyof Box)[]) => {
  return (box: Box, prev: Box) => {
    for (const prop of props) {
      if (box[prop] !== prev[prop]) return true;
    }
    return false;
  };
};

const columns: ColumnsType<Box> = [
  {
    title: '箱記号',
    key: 'boxcode',

    render: (_, { box_category, id }) => (
      <div style={{ minWidth: '8em' }}>
        <Link to={`/manager/boxes/${id}`}>{box_category.code+id}</Link>
      </div>
    ),
    shouldCellUpdate: diff('box_category'),
  },
  {
    title: '作家記号',
    key: 'artistcode',
    width: '10em',
    render: (_, { artist, id }) => (
      <Link to={`/manager/artists/${id}`}>{artist?.code}</Link>
    ),
    shouldCellUpdate: diff('artist'),
  },
  {
    title: 'ステータス',
    dataIndex: 'status',
    width: '12em',
    shouldCellUpdate: diff('status'),
  },
  {
    title: '空く予定',
    key: 'vacanted_on',
    render: (_, { vacanted_on, id }) => (
      <span>{vacanted_on ? format(new Date(vacanted_on), 'yyyy年MM月dd日') : ''}</span>
    ),
    width: '10em',
    shouldCellUpdate: diff('artist'),
  },
  {
    title: '箱料金',
    width: '12em',
    key: 'money',
    render: (_, { money, id }) => (
      <span>{money ? '¥'+money.toLocaleString() : ''}</span>
    ),
    shouldCellUpdate: diff('money'),
  },
  {
    title: '特別料金',
    width: '12em',
    key: 'special_money',
    render: (_, { special_money, id }) => (
      <span>{special_money ? '¥'+special_money.toLocaleString() : ''}</span>
    ),
    shouldCellUpdate: diff('special_money'),
  },
];

const boxIndexer: SearchIndexer<Box> = (c, a) => {
  a(c.box_category.code + c.id);
  a(c.artist?.code ?? '');
  a(c.artist?.name ?? '');
};

const BoxTable: React.FC<BoxTableProps> = ({
  search,
  filter,
  rowSelection: rowSelectionProps,
}) => {
  const { data: data, isLoading } =
    useBoxes() as UseQueryResult<{boxes: Box[], boxes_hash: {[id: number]: Box}}>;
  const _rawBoxes = data?.boxes;
  
  const boxs = useMemo(() => {
    const rawBoxes = _rawBoxes ?? [];
    const filteredBoxs = filter ? filter(rawBoxes) : rawBoxes;
    return filteredBoxs.map((v) => ({ ...v, key: v.id }));
  }, [_rawBoxes, filter]);

  // removeStaleKeys from selection
  useEffect(() => {
    if (rowSelectionProps?.selectedRowKeys && rowSelectionProps.onChange) {
      const { selectedRowKeys, onChange } = rowSelectionProps;
      const newKeys = selectedRowKeys.filter((key) =>
        boxs.find((c) => c.id === key),
      );
      if (!isEqual(sortBy(selectedRowKeys), sortBy(newKeys))) {
        onChange(
          newKeys,
          boxs.filter((c) => newKeys.indexOf(c.id) !== -1),
          { type: 'multiple' },
        );
      }
    }
    // we can do this because rowSelectionProps itself never mutate to invalid state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxs]);

  // search
  const index = useMemo(() => {
    const index = new SearchIndex();
    for (const c of boxs) {
      index.addDocument(c.id.toString(), c, boxIndexer);
    }
    return index;
  }, [boxs]);
  const searchedBox = useMemo(() => {
    if (search && index) {
      const ids = index.search(search).map((v) => Number(v));
      const sc = boxs.filter((c) => ids.indexOf(Number(c.id)) !== -1);
      return sc;
    } else {
      return boxs;
    }
  }, [boxs, search, index]);

  // growing table
  const [pageSize, setPageSize] = useState(2000);
  const pagination: TableProps<Box>['pagination'] = {
    pageSize,
    position: [],
  };
  useEffect(() => {
    let resized = false;
    const listener = () => {
      const remain = getScrollMax()[0] - getScrollTop();
      if (remain < 500 && !resized && pageSize < searchedBox.length) {
        setPageSize(pageSize + 15);
        resized = true;
      } else if (remain > 1500 && pageSize > 20) {
        setPageSize(pageSize - 15);
      }
    };
    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, searchedBox]);
  useEffect(() => {
    if (getScrollTop() === 0) {
      setPageSize(20);
    }
  }, [searchedBox.length]);

  // selection handling for growing table
  const onSelectionChange: TableRowSelection<Box>['onChange'] = (
    value,
    rows,
    info,
  ) => {
    // preserve out-of-search values
    const prev = rowSelectionProps?.selectedRowKeys ?? [];
    const outOfSearch = prev.filter(
      (k) => !searchedBox.find((c) => c.id === k),
    );
    const newKeys = [...new Set([...outOfSearch, ...value]).values()];
    const newRows = boxs.filter((c) => newKeys.includes(c.id));
    rowSelectionProps?.onChange?.(newKeys, newRows, info);
  };

  const searchedSelection = useMemo(() => {
    return (
      rowSelectionProps?.selectedRowKeys &&
      rowSelectionProps.selectedRowKeys.filter((k) =>
        searchedBox.find((c) => c.id === k),
      )
    );
  }, [rowSelectionProps?.selectedRowKeys, searchedBox]);
  const selectAllBox = (() => {
    if (searchedSelection) {
      const checked =
        !!searchedSelection.length &&
        searchedBox.length === searchedSelection.length;
      const indeterminate =
        !!searchedSelection.length &&
        searchedBox.length > searchedSelection.length;
      return (
        searchedSelection && (
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            onChange={() => {
              if (!checked || indeterminate) {
                onSelectionChange(
                  searchedBox.map((c) => c.id),
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
    <Table
      scroll={{ x: true }}
      dataSource={searchedBox}
      loading={isLoading}
      columns={columns}
      rowSelection={{
        ...rowSelectionProps,
        onChange: onSelectionChange,
        columnTitle: selectAllBox,
      }}
      size="small"
      pagination={pagination}
    />
  );
};

export const useBoxTable = (props: BoxTableProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedBoxs, setSelectedBoxs] = useState<Box[]>(
    [],
  );
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[], boxs: Box[]) => {
      setSelectedRowKeys(keys);
      setSelectedBoxs(boxs as Box[]);
    },
  };

  const table = <BoxTable rowSelection={rowSelection} {...props} />;

  return [table, selectedBoxs] as const;
};

export default BoxTable;
