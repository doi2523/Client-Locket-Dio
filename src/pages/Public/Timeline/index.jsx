import React from "react";
import { defaultHistorys } from "../../../data/historyData";

export default function Timeline() {
  return (
    <div className="w-full md:w-[90%] max-w-2xl mx-auto px-6 py-5">
      <div className="h-16"></div>
      <h1 className="text-3xl font-bold text-center mb-8">Lịch sử cập nhật</h1>
      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
        {defaultHistorys.map((update, index) => (
          <li key={index}>
            {index !== 0 && <hr />}
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className={`timeline-${index % 2 === 0 ? "start" : "end"} mb-10 md:text-${index % 2 === 0 ? "end" : "start"}`}>
              <time className="font-mono italic">{update.date}</time>
              <div className="text-lg font-black">{update.title}</div>
              <p className="whitespace-pre-line">{update.description}</p>
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
