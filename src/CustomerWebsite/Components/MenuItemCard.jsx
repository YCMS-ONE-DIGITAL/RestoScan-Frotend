// MenuItemCard.jsx
import { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";

export default function MenuItemCard({ item, onAdd, onRemove, quantity = 0, index }) {
  const [readMore, setReadMore] = useState(false);

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg m-2 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex gap-3 items-start">


        {/* IMAGE */}
        <div className="w-16 h-full sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img src={item.img} className="w-full h-full object-fit" />
        </div>

        {/* DETAILS */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">

            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
              {item.name}
            </h3>
            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center
                             ${item.type === "veg" ? "border-green-600" : "border-red-600"}`}>
              <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full
                               ${item.type === "veg" ? "bg-green-600" : "bg-red-600"}`} />
            </div>
          </div>

          {/* DESCRIPTION - CONTROLLED HEIGHT */}
          <div
            className={`text-sm sm:text-sm text-gray-600 leading-tight transition-all duration-300
                        ${readMore ? "max-h-20 overflow-y-auto pr-1" : "max-h-10 overflow-hidden"} 
                        scrollbar-thin scrollbar-thumb-gray-300`}
          >
            {item.description || "Deliciously cooked with premium ingredients."}
          </div>

          {/* READ MORE / LESS */}
          {item.description && item.description.length > 80 && (
            <button
              onClick={() => setReadMore(!readMore)}
              className="flex items-center gap-1 text-xs text-orange-600 font-medium mt-1 hover:text-orange-700 transition-colors"
            >
              {readMore ? (
                <>Less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>More <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}

          {/* PRICE + ADD */}
          <div className="flex items-center justify-between mt-3">
  {/* PRICE */}
  <p className="font-bold text-orange-600 text-base sm:text-lg">
    ₹{item.price}
  </p>

  {/* ADD / QTY BUTTONS */}
  <div className="flex items-center justify-end">
    {quantity === 0 ? (
      <button
        onClick={() => onAdd(item)}
        className="bg-gradient-to-r  from-orange-500 to-orange-600 
                   hover:from-orange-600 hover:to-orange-700 
                   text-white font-bold text-md sm:text-base 
                   px-6 sm:px-8 py-2 sm:py-2.5 
                   rounded-full shadow-md hover:shadow-lg 
                   active:scale-95 transition-all duration-200 
                   min-w-[110px] flex items-center justify-center"
      >
        Add
      </button>
    ) : (
      <div className="flex items-center gap-1 bg-orange-100 border border-orange-200 rounded-full px-1.5 py-1">
        {/* MINUS */}
        <button
          onClick={() => onRemove(item)}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white 
                     hover:bg-orange-600 active:scale-90 transition-all duration-150 
                     flex items-center justify-center"
        >
          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* QUANTITY */}
        <span className="px-2.5 font-bold text-orange-700 text-sm sm:text-base min-w-[2rem] text-center">
          {quantity}
        </span>

        {/* PLUS */}
        <button
          onClick={() => onAdd(item)}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white 
                     hover:bg-orange-600 active:scale-90 transition-all duration-150 
                     flex items-center justify-center"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    )}
  </div>
</div>
        </div>
      </div>
    </div>
  );
}