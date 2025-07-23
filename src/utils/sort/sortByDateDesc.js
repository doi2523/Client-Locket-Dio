// utils/sort.js
export const sortByDateDesc = (arr) =>
    [...arr].sort((a, b) => new Date(b.date) - new Date(a.date));  