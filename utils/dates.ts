export const getEndOfMonth = (selectedDate?: Date | null): Date => {
  const date = selectedDate || new Date();
  const year = date.getFullYear(); // Get the current year
  const month = date.getMonth(); // Get the current month

  // Create a new date object for the first day of the next month
  const firstDayOfNextMonth = new Date(year, month + 1, 1);

  // Subtract one millisecond to get the last second of the last day of the current month
  return new Date(firstDayOfNextMonth.getTime() - 1);
};

export const getFormattedDate = (date: Date): string => {
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear() - 2000;

  return `${month}/${year}`;
};
