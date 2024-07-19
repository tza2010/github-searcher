type Props = {
  searchTerm: string;
  handleSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function SearchBar({ searchTerm, handleSearchTermChange }: Props) {
  return (
    <input
      autoFocus
      type="text"
      value={searchTerm}
      onChange={handleSearchTermChange}
      className="border border-gray-400 rounded-md px-3 py-2 mr-2 focus:outline-none h-16 md:w-96"
      placeholder="Start typing to search..."
    />
  );
}

export default SearchBar;
