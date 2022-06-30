import SearchBox from '@/components/SearchBox';
import { useState } from 'react';
import { useThrottle } from 'react-use';
import { useEarnTable } from './EarnTable';

export type EarnPaneProps = {
  activeKey: string;
  page: number,
  setPage: any,
};

const EarnPane: React.FC<EarnPaneProps> = ({activeKey, page, setPage}) => {
  const [search, setSearch] = useState('');
  const throttleSearch = useThrottle(search, 300);


  const [table] = useEarnTable({
    search: throttleSearch,
    activeKey,
    page,
    setPage,
  });

  return (
    <>
      <SearchBox
        onChange={setSearch}
        style={{ marginTop: '10px', marginBottom: '10px' }}
        placeholder="検索(50件の中のみ)　(作家記号(作家記号+作品番号)、作家名)"
      />
      {table}
    </>
  );
};

export default EarnPane;
