import React from "react";
import pinIcon from "../assets/icons/pin-red.png";
import starIcon from "../assets/icons/star-yellow.png";
import heartIcon from "../assets/icons/heart.png";
import clockIcon from "../assets/icons/clock.png";
import distanceIcon from "../assets/icons/distance.png";
import barIcon from "../assets/icons/bar.png";
import noConnectionIcon from "../assets/icons/no-connection.png";

type Variant = "compact" | "detailed";

type BaseProps = {
  name: string;
  distance: string;
  rating: string;
  imageSrc: string;
  imageAlt: string;
};

type CompactProps = BaseProps & {
  variant?: "compact";
};

type DetailedProps = BaseProps & {
  variant: "detailed";
  location: string;
  likes: string;
  description: string;
};

type TrailCardProps = CompactProps | DetailedProps;

export const TrailCard: React.FC<TrailCardProps> = (props) => {
  const { name, distance, rating, imageSrc, imageAlt } = props;

  const isDetailed = (props as DetailedProps).variant === "detailed";

  if (isDetailed) {
    const { location, likes, description } = props as DetailedProps;

    return (
      <article className="flex items-stretch overflow-hidden rounded-3xl bg-neutral-100">
        <div className="w-32 flex-shrink-0">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 pl-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-base font-semibold text-black">{name}</h2>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <img
                  src={starIcon}
                  alt="Rating"
                  className="h-3.5 w-3.5 object-contain"
                />
                <span>{rating}</span>
              </span>
              <span className="flex items-center gap-1">
                <img
                  src={heartIcon}
                  alt="Likes"
                  className="h-3.5 w-3.5 object-contain"
                />
                <span>{likes}</span>
              </span>
            </div>
          </div>

          <div className="mb-1 flex items-center gap-1 text-xs text-gray-600">
            <img
              src={pinIcon}
              alt="Location"
              className="h-3.5 w-3.5 object-contain"
            />
            <span>{location}</span>
          </div>

          <p className="mb-3 text-xs text-gray-400">{description}</p>

          <div className="mt-auto flex flex-wrap gap-4 text-[10px] text-gray-600">
            <span className="flex items-center gap-1">
              <img
                src={clockIcon}
                alt="Duration"
                className="h-3.5 w-3.5 object-contain"
              />
              <span>4 hours of hike</span>
            </span>
            <span className="flex items-center gap-1">
              <img
                src={distanceIcon}
                alt="Distance"
                className="h-3.5 w-3.5 object-contain"
              />
              <span>{distance}</span>
            </span>
            <span className="flex items-center gap-1">
              <img
                src={barIcon}
                alt="Difficulty"
                className="h-3.5 w-3.5 object-contain"
              />
              <span>Hard</span>
            </span>
            <span className="flex items-center gap-1">
              <img
                src={noConnectionIcon}
                alt="Offline map"
                className="h-3.5 w-3.5 object-contain"
              />
              <span>Offline map available</span>
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Compact card used on home screen
  return (
    <article className="flex flex-1 flex-col">
      <div className="mb-2 aspect-[3/4] w-full overflow-hidden rounded-2xl">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="mb-1 text-[11px] font-medium text-black">{name}</h3>
      <div className="flex flex-nowrap items-center gap-2 text-[9px] text-gray-500">
        <div className="flex items-center gap-1 whitespace-nowrap">
          <img
            src={pinIcon}
            alt="Distance"
            className="h-3 w-3 object-contain"
          />
          <span>{distance}</span>
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <img
            src={starIcon}
            alt="Rating"
            className="h-3 w-3 object-contain"
          />
          <span>{rating}</span>
        </div>
      </div>
    </article>
  );
};


