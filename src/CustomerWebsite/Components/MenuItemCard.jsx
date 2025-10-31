// MenuItemCard.jsx
import { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";

export default function MenuItemCard({ item, onAdd, onRemove, quantity = 0 }) {
  const [readMore, setReadMore] = useState(false);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg 
                    border border-gray-100 transition-all duration-300 w-full 
                    flex h-auto sm:h-[130px]">
      
      {/* IMAGE */}
      <div className="w-28 h-28 sm:h-full flex-shrink-0 relative overflow-hidden">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* DETAILS */}
      <div className="flex-grow p-3 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          {/* Title + Badge */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1">
              {item.name}
            </h3>
            <div
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                          ${item.type === "veg" ? "border-green-600" : "border-red-600"}`}
            >
              <div
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full
                            ${item.type === "veg" ? "bg-green-600" : "bg-red-600"}`}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div
            className={`text-xs text-gray-600 leading-snug font-light overflow-y-auto pr-1
                        ${readMore ? "max-h-16" : "line-clamp-2"} 
                        scrollbar-thin scrollbar-thumb-gray-300`}
          >
            {item.description || "Freshly made with authentic Indian spices and love."}
          </div>

          {/* READ MORE */}
          {item.description && item.description.length > 60 && (
            <button
              onClick={() => setReadMore(!readMore)}
              className="flex items-center gap-1 text-xs text-orange-600 font-medium mt-1 w-fit hover:text-orange-700 transition-colors"
            >
              {readMore ? <>Less <ChevronUp className="w-3 h-3" /></> : <>More <ChevronDown className="w-3 h-3" /></>}
            </button>
          )}
        </div>

        {/* PRICE + ADD / QUANTITY */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-base sm:text-lg font-bold text-orange-600">₹{item.price}</p>

          {quantity === 0 ? (
            <button
              onClick={() => onAdd(item)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 
                         text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all duration-300 
                         shadow-md hover:shadow-lg flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-orange-100 rounded-full px-1 py-0.5">
              <button
                onClick={() => onRemove(item)}
                className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition active:scale-90"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 font-bold text-orange-700 text-sm min-w-[1.5rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => onAdd(item)}
                className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition active:scale-90"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}