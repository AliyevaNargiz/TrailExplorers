import React from "react";
import menuIcon from "../assets/icons/menu.png";
import recordIcon from "../assets/icons/record.png";
import addIcon from "../assets/icons/add.png";
import searchIcon from "../assets/icons/search.png";

type TopIconRowProps = {
  onSearchClick?: () => void;
};

export const TopIconRow: React.FC<TopIconRowProps> = ({ onSearchClick }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <button type="button" aria-label="Open menu">
        <img
          src={menuIcon}
          alt="Menu"
          className="h-6 w-6 object-contain"
        />
      </button>

      <div className="flex items-center gap-4">
        <img
          src={recordIcon}
          alt="Record"
          className="h-6 w-6 object-contain"
        />
        <img
          src={addIcon}
          alt="Add"
          className="h-6 w-6 object-contain"
        />
        <button
          type="button"
          aria-label="Search trails"
          onClick={onSearchClick}
        >
          <img
            src={searchIcon}
            alt="Search"
            className="h-6 w-6 object-contain"
          />
        </button>
      </div>
    </div>
  );
};


