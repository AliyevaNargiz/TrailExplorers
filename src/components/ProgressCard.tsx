import React from "react";
import checkCircleIcon from "../assets/icons/check-circle.png";

const PROGRESS_ITEMS: string[] = [
  "2.5 km total hike completed",
  "Completed 5 different trails",
  "Completed 7 ECO-Challenge",
  "Added 2 new trail for exploration",
  "““Qobustan” trail in progress”",
];

export const ProgressCard: React.FC = () => {
  return (
    <section
      aria-labelledby="your-progress-heading"
      className="mb-8"
    >
      <div className="rounded-3xl bg-neutral-100 px-5 py-4">
        <h2
          id="your-progress-heading"
          className="mb-3 text-xs font-semibold tracking-[0.16em] text-black uppercase"
        >
          YOUR PROGRESS
        </h2>
        <ul className="space-y-2.5">
          {PROGRESS_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <img
                src={checkCircleIcon}
                alt="Completed"
                className="h-5 w-5 object-contain"
              />
              <span className="text-xs text-gray-500">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};


