import { useState } from 'react';
import { useThrottle } from 'react-use';
import SearchBox from '@/components/SearchBox';
import ArtistAdd from './ArtistAdd';
import { ArtistFilter, useArtistTable } from './ArtistTable';

export type ArtistPaneProps = {
  filter?: ArtistFilter;
};

const ArtistPane: React.FC<ArtistPaneProps> = ({ filter }) => {
  const [search, setSearch] = useState('');
  const throttleSearch = useThrottle(search, 300);

  const [table] = useArtistTable({
    search: throttleSearch,
    filter,
  });

  return (
    <>
      <ArtistAdd/>
      <SearchBox
        onChange={setSearch}
        style={{ marginTop: '10px', marginBottom: '10px' }}
        placeholder="検索（作家名、作家記号）"
      />
      {table}
    </>
  );
};

export default ArtistPane;
