import {
  Artist,
  useArtists,
} from '@/services/arrow-manage/artist';
import { Checkbox, Table } from 'antd';
import { UseQueryResult } from 'react-query';
import type { ColumnsType, TableProps } from 'antd/lib/table';
import React, { Key, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TableRowSelection } from 'antd/lib/table/interface';
import { isEqual, sortBy } from 'lodash-es';
import { SearchIndex, SearchIndexer } from '@/libs/search';
import { getScrollMax, getScrollTop } from '@/libs/scroll';

export type ArtistFilter = (artists: Artist[]) => Artist[];

export type ArtistTableProps = {
  search?: string;
  filter?: ArtistFilter;
  rowSelection?: TableRowSelection<Artist>;
};

const diff = (...props: (keyof Artist)[]) => {
  return (artist: Artist, prev: Artist) => {
    for (const prop of props) {
      if (artist[prop] !== prev[prop]) return true;
    }
    return false;
  };
};

const columns: ColumnsType<Artist> = [
  {
    title: '作家名',
    dataIndex: 'name',
    render: (_, { name, id }) => (
      <div style={{ minWidth: '8em' }}>
        <Link to={`/manager/artists/${id}`}>{name}</Link>
      </div>
    ),
    shouldCellUpdate: diff('name'),
  },
  {
    title: '作家記号',
    dataIndex: 'code',
    width: '10em',
    shouldCellUpdate: diff('code'),
  },
  {
    title: 'ステータス',
    dataIndex: 'status',
    width: '12em',
    shouldCellUpdate: diff('status'),
  },
];

const artistIndexer: SearchIndexer<Artist> = (c, a) => {
  a(c.name);
  a(c.code);
};

const ArtistTable: React.FC<ArtistTableProps> = ({
  search,
  filter,
  rowSelection: rowSelectionProps,
}) => {
  const { data: _rawArtists, isLoading } =
    useArtists() as UseQueryResult<Artist[]>;
  const artists = useMemo(() => {
    const rawArtists = _rawArtists ?? [];
    const filteredArtists = filter ? filter(rawArtists) : rawArtists;
    return filteredArtists.map((v) => ({ ...v, key: v.id }));
  }, [_rawArtists, filter]);

  // removeStaleKeys from selection
  useEffect(() => {
    if (rowSelectionProps?.selectedRowKeys && rowSelectionProps.onChange) {
      const { selectedRowKeys, onChange } = rowSelectionProps;
      const newKeys = selectedRowKeys.filter((key) =>
        artists.find((c) => c.id === key),
      );
      if (!isEqual(sortBy(selectedRowKeys), sortBy(newKeys))) {
        onChange(
          newKeys,
          artists.filter((c) => newKeys.indexOf(c.id) !== -1),
          { type: 'multiple' },
        );
      }
    }
    // we can do this because rowSelectionProps itself never mutate to invalid state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artists]);

  // search
  const index = useMemo(() => {
    const index = new SearchIndex();
    for (const c of artists) {
      index.addDocument(c.id.toString(), c, artistIndexer);
    }
    return index;
  }, [artists]);
  const searchedArtist = useMemo(() => {
    if (search && index) {
      const ids = index.search(search).map((v) => Number(v));
      const sc = artists.filter((c) => ids.indexOf(Number(c.id)) !== -1);
      return sc;
    } else {
      return artists;
    }
  }, [artists, search, index]);

  // growing table
  const [pageSize, setPageSize] = useState(2000);
  const pagination: TableProps<Artist>['pagination'] = {
    pageSize,
    position: [],
  };
  useEffect(() => {
    let resized = false;
    const listener = () => {
      const remain = getScrollMax()[0] - getScrollTop();
      if (remain < 500 && !resized && pageSize < searchedArtist.length) {
        setPageSize(pageSize + 15);
        resized = true;
      } else if (remain > 1500 && pageSize > 20) {
        setPageSize(pageSize - 15);
      }
    };
    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, searchedArtist]);
  useEffect(() => {
    if (getScrollTop() === 0) {
      setPageSize(20);
    }
  }, [searchedArtist.length]);

  // selection handling for growing table
  const onSelectionChange: TableRowSelection<Artist>['onChange'] = (
    value,
    rows,
    info,
  ) => {
    // preserve out-of-search values
    const prev = rowSelectionProps?.selectedRowKeys ?? [];
    const outOfSearch = prev.filter(
      (k) => !searchedArtist.find((c) => c.id === k),
    );
    const newKeys = [...new Set([...outOfSearch, ...value]).values()];
    const newRows = artists.filter((c) => newKeys.includes(c.id));
    rowSelectionProps?.onChange?.(newKeys, newRows, info);
  };

  const searchedSelection = useMemo(() => {
    return (
      rowSelectionProps?.selectedRowKeys &&
      rowSelectionProps.selectedRowKeys.filter((k) =>
        searchedArtist.find((c) => c.id === k),
      )
    );
  }, [rowSelectionProps?.selectedRowKeys, searchedArtist]);
  const selectAllBox = (() => {
    if (searchedSelection) {
      const checked =
        !!searchedSelection.length &&
        searchedArtist.length === searchedSelection.length;
      const indeterminate =
        !!searchedSelection.length &&
        searchedArtist.length > searchedSelection.length;
      return (
        searchedSelection && (
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            onChange={() => {
              if (!checked || indeterminate) {
                onSelectionChange(
                  searchedArtist.map((c) => c.id),
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
      dataSource={searchedArtist}
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

export const useArtistTable = (props: ArtistTableProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>(
    [],
  );
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[], artists: Artist[]) => {
      setSelectedRowKeys(keys);
      setSelectedArtists(artists as Artist[]);
    },
  };

  const table = <ArtistTable rowSelection={rowSelection} {...props} />;

  return [table, selectedArtists] as const;
};

export default ArtistTable;
