import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export default function CategoryFilter({ setFilterCat }) {
  const { data: categories = [] } = useQuery({
    queryKey: ["pos-categories"],
    queryFn: async () => {
      const res = await api.get("/restaurant/categories");
      return res.data.data ?? [];
    },
  });

  return (
    <div className="flex gap-2 overflow-x-auto p-2">
      <button
        className="bg-gray-700 text-white px-3 py-1 rounded"
        onClick={() => setFilterCat(null)}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          className="bg-gray-700 text-white px-3 py-1 rounded"
          onClick={() => setFilterCat(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
