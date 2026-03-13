import React from "react";
import { StarProgress } from "./StarProgress";

export function StarRating({ rating }) {
  // rating là số thực từ 0 đến 5, ví dụ 2.2
  const stars = [];

  for (let i = 0; i < 5; i++) {
    let fillPercent = 0;

    if (rating >= i + 1) {
      fillPercent = 100; // sao đầy
    } else if (rating > i) {
      fillPercent = (rating - i) * 100; // sao được tô theo %
    }

    stars.push(
      <StarProgress
        key={i}
        size={24}
        fillPercent={fillPercent}
        className="inline-block"
      />
    );
  }

  return <div className="flex gap-1">{stars}</div>;
}
