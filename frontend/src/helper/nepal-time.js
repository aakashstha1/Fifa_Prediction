export const toNepalTime = (dateStr) => {
  return new Date(dateStr).toLocaleString("en-US", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};
