// src/CustomerWebsite/Components/MenuItemCard.jsx
import { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";

export default function MenuItemCard({ item, onAdd, onRemove, quantity = 0 }) {
  const [readMore, setReadMore] = useState(false);

  const hasLongDescription = item.description && item.description.length > 100;
  const shortDesc = hasLongDescription 
    ? item.description.slice(0, 100) 
    : item.description;

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl m-2 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex gap-3 items-start">

        {/* IMAGE */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
          <img 
            src={item.img} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* DETAILS */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            {/* Name + Veg/Non-Veg */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                {item.name}
              </h3>
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                               ${item.type === "veg" ? "border-green-600" : "border-red-600"}`}>
                <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full
                                 ${item.type === "veg" ? "bg-green-600" : "bg-red-600"}`} />
              </div>
            </div>

          
          </div>

          {/* DESCRIPTION + READ MORE (INLINE) */}
          {item.description ? (
            <div className="mt-1 text-xs sm:text-sm text-gray-600 leading-tight">
              <span className={readMore ? "" : "inline"}>
                {readMore ? item.description : shortDesc}
              </span>

              {/* Read More / Less — Inline at the end */}
              {hasLongDescription && (
                <button
                  onClick={() => setReadMore(!readMore)}
                  className="inline ml-1 text-orange-600 font-semibold hover:text-orange-700 transition-colors align-middle"
                >
                  {readMore ? (
                    <>Less <ChevronUp className="w-3.5 h-3.5 inline align-middle" /></>
                  ) : (
                    <>...More <ChevronDown className="w-3.5 h-3.5 inline align-middle" /></>
                  )}
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic mt-1">Deliciously cooked with premium ingredients.</p>
          )}

          {/* PRICE + ADD BUTTON */}
          <div className="flex items-center justify-between mt-3">
            {/* Price */}
            <p className="font-bold text-orange-600 text-base sm:text-lg">
              ₹{item.price}
            </p>

            {/* Add / Quantity */}
            <div className="flex items-center">
              {quantity === 0 ? (
                <button
                  onClick={() => onAdd(item)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 
                             hover:from-orange-600 hover:to-orange-700 
                             text-white font-bold text-sm sm:text-base 
                             px-5 sm:px-7 py-2 sm:py-2.5 
                             rounded-full shadow-md hover:shadow-xl 
                             active:scale-95 transition-all duration-200 
                             flex items-center justify-center min-w-[100px]"
                >
                  Add
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-orange-100 border border-orange-300 rounded-full px-1.5 py-1">
                  <button
                    onClick={() => onRemove(item)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white 
                               hover:bg-orange-600 active:scale-90 transition-all 
                               flex items-center justify-center"
                  >
                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <span className="px-2.5 font-bold text-orange-700 text-sm sm:text-base min-w-[2rem] text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={() => onAdd(item)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 text-white 
                               hover:bg-orange-600 active:scale-90 transition-all 
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