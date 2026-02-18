import React from "react";

type TitleProps = {
  text: string;
};

export const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <h1 className="mb-4 text-2xl font-bold tracking-wide text-black">
      {text}
    </h1>
  );
};


