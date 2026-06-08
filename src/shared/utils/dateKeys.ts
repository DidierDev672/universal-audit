/** YYYY-MM-DD en hora local. */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDateRange(startDate: string, endDate: string): string {
  if (startDate === endDate) return startDate;
  return `${startDate} – ${endDate}`;
}
