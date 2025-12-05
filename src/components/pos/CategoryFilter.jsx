import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export default function CategoryFilter({filterCat, setFilterCat }) {
  const { data: categories = [] } = useQuery({
    queryKey: ["pos-categories"],
    queryFn: async () => {
      const res = await api.get("/restaurant/categories");
      return res.data ?? [];  // 👈 FIXED
    },
  });

  return (
   <div className="flex gap-2 overflow-x-auto p-2">
      {/* ALL BUTTON */}
      <button
        className={`px-3 py-1 rounded 
          ${filterCat === null 
            ? "bg-blue-500 text-white" 
            : "bg-gray-700 text-white"}`}
        onClick={() => setFilterCat(null)}
      >
        All
      </button>

      {/* CATEGORY BUTTONS */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`px-3 py-1 rounded 
            ${filterCat === cat.id 
              ? "bg-blue-500 text-white"   // ACTIVE
              : "bg-gray-700 text-white"}`    // INACTIVE
          }
          onClick={() => setFilterCat(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
