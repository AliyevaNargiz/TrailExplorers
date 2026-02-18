import React from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionAlignBottom?: boolean;
  onActionClick?: () => void;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  actionAlignBottom = true,
  onActionClick,
}) => {
  return (
    <div
      className={`flex items-${
        actionAlignBottom ? "end" : "center"
      } justify-between gap-2`}
    >
      <div className="flex flex-col">
        <h2 className="text-sm font-semibold text-black">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
        )}
      </div>
      {actionText && (
        <button
          type="button"
          className="text-xs text-gray-400 underline"
          onClick={onActionClick}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};


