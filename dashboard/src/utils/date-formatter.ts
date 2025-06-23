export const dateToESString = (date: Date) =>
  date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const toESString = (dateString: string) => dateToESString(new Date(dateString));

/*
Format a Date object to a string in the format HH:mm:ss.SSS.
*/
export function dateToTimeFormattedString(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export const toTimeFormattedString = (dateString: string) =>
  dateToTimeFormattedString(new Date(dateString));
