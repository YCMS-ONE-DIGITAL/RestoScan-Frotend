const MenuSearchBar = ({ search, setSearch }) => {
  return (
    <div className="flex items-center justify-between">
      <input
        type="text"
        placeholder="Search item..."
        className="w-72 lg:w-96 px-4 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-300 dark:text-gray-300"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        onClick={() => setSearch("")}
        
        className="ml-2 px-4 py-2 bg-gray-800 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium  dark:hover:bg-gray-700"
      >
        Reset
      </button>
    </div>
  );
};

export default MenuSearchBar;
