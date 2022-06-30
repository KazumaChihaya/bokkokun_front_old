import { useState } from 'react';
import { useThrottle } from 'react-use';
import SearchBox from '../../../components/SearchBox';
import { BoxFilter, useBoxTable } from './BoxTable';

export type BoxPaneProps = {
  filter?: BoxFilter;
};

const BoxPane: React.FC<BoxPaneProps> = ({ filter }) => {
  const [search, setSearch] = useState('');
  const throttleSearch = useThrottle(search, 300);

  const [table] = useBoxTable({
    search: throttleSearch,
    filter,
  });

  return (
    <>
      <SearchBox
        onChange={setSearch}
        style={{ marginTop: '10px', marginBottom: '10px' }}
        placeholder="検索（箱記号、作家記号、作家名）"
      />
      {table}
    </>
  );
};

export default BoxPane;
