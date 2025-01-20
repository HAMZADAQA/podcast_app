import React from 'react';
import { debounce } from '@/api/utils/debounce';
import styles from './SearchInput.module.css';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleSearch = debounce(onSearch, 300);

  return (
    <input
      className={styles.search}
      type='text'
      placeholder='Filter podcasts...'
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
};

export default SearchBar;
