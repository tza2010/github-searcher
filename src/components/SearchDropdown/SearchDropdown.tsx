type Props = {
  searchType: string;
  handleSearchTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

function SearchDropdown({ searchType, handleSearchTypeChange }: Props) {
  return (
    <select
      value={searchType}
      className="border border-gray-400 rounded-md px-3 py-2 focus:outline-none h-16"
      onChange={handleSearchTypeChange}
    >
      <option value="users">Users</option>
      <option value="repositories">Repositories</option>
    </select>
  );
}

export default SearchDropdown;
