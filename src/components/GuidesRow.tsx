import React from "react";

export const GuidesRow: React.FC = () => {
  const guides = [1, 2, 3, 4, 5];

  return (
    <div className="mt-6 flex justify-between">
      {guides.map((id) => (
        <div
          key={id}
          className="h-10 w-10 rounded-full bg-[#1e0303]"
        />
      ))}
    </div>
  );
};


