import SearchBar from "../SearchBar/SearchBar";
import SearchDropdown from "../SearchDropdown/SearchDropdown";
import styles from "./SearchContainer.module.css";

type Props = {
  searchTerm: string;
  searchType: string;
  handleSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function SearchContainer({
  searchTerm,
  searchType,
  handleSearchTermChange,
  handleSearchTypeChange,
}: Props) {
  return (
    <div className={styles["search-container"]}>
      <SearchBar
        searchTerm={searchTerm}
        handleSearchTermChange={handleSearchTermChange}
      />
      <SearchDropdown
        searchType={searchType}
        handleSearchTypeChange={handleSearchTypeChange}
      />
    </div>
  );
}

export default SearchContainer;
