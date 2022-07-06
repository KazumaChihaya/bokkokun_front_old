import { SearchOutlined } from '@ant-design/icons';
import { Input, InputProps } from 'antd';
import { useState } from 'react';
import { normalizeWord } from '@/libs/search';

export type SearchBoxProps = Omit<InputProps, 'onChange'> & {
  onChange: (value: string) => void;
};

function normalize(value: string): string {
  value = value.replace(/[ａ-ｚ]$/, '');
  return normalizeWord(value);
}

const SearchBox: React.FC<SearchBoxProps> = (props) => {
  const [search, setSearch] = useState('');

  return (
    <Input
      {...props}
      value={search}
      prefix={<SearchOutlined />}
      onChange={(e) => {
        setSearch(e.target.value);
        props.onChange(normalize(e.target.value));
      }}
    />
  );
};

export default SearchBox;
