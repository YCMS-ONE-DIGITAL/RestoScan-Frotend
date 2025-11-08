import { categories } from "./data";

const CategoryFilter = ({ setFilterCat }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
      <button
        onClick={() => setFilterCat(null)}
        className="p-2 bg-gray-800 dark:bg-gray-800 shadow rounded-md text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-700 text-center"
      >
        Show All
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setFilterCat(cat.id)}
          className="p-2 bg-gray-800 dark:bg-gray-800 shadow rounded-md text-sm hover:bg-gray-700 dark:hover:bg-gray-700"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
