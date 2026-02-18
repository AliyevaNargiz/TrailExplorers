import React from "react";
import dropdownIcon from "../assets/icons/dropdown.png";

const FILTERS = ["Location", "Duration", "Difficulty level"] as const;

export const FiltersRow: React.FC = () => {
  return (
    <div className="mb-6 mt-2 flex gap-3">
      {FILTERS.map((label) => (
        <div key={label} className="flex-1">
          <p className="mb-1 text-xs font-medium text-black">{label}</p>
          <button
            type="button"
            className="flex w-full items-center rounded-full border border-gray-200 bg-white px-3 py-2 text-[11px] text-gray-400 shadow-sm"
          >
            <span className="mr-2 flex items-center gap-1.5 whitespace-nowrap">
              <img
                src={dropdownIcon}
                alt=""
                className="h-[14px] w-[14px] object-contain"
              />
              <span>choose option</span>
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};


