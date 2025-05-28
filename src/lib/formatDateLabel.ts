export const formatMinorDateLabels = (date: Date, scale: string): string => {
  const dateObj = new Date(date);
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth(); // 0-based
  const day = dateObj.getUTCDate();
  const hour = dateObj.getUTCHours();
  const minute = dateObj.getUTCMinutes();
  const second = dateObj.getUTCSeconds();
  const millisecond = dateObj.getUTCMilliseconds();
  const weekday = dateObj.getUTCDay(); // 0 (Sun) - 6 (Sat)

  const monthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const weekdayNamesShort = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];

  // Get ISO week number
  const getWeekNumber = (d: Date): number => {
    const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const dayNum = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    return Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  switch (scale) {
    case "millisecond":
      return millisecond.toString().padStart(3, "0");

    case "second":
      return second.toString();

    case "minute":
    case "hour":
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

    case "weekday":
      return `${weekdayNamesShort[weekday]} ${day}`;

    case "day":
      return `${day}`;

    case "week":
      return getWeekNumber(dateObj).toString();

    case "month":
      return `${monthNamesShort[month]}`;

    case "year":
      return year.toString(); // same as original function

    default:
      return year.toString();
  }
};

export const formatMajorDateLabels = (date: Date, scale: string): string => {
  const dateObj = new Date(date);
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth(); // 0-based
  const day = dateObj.getUTCDate();
  const hour = dateObj.getUTCHours();
  const minute = dateObj.getUTCMinutes();
  const second = dateObj.getUTCSeconds();
  const weekday = dateObj.getUTCDay(); // 0 (Sun) - 6 (Sat)

  const monthNamesFull = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekdayNamesShort = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];

  const pad = (value: number, length = 2) => value.toString().padStart(length, "0");

  switch (scale) {
    case "millisecond":
      // 'HH:mm:ss'
      return `${pad(hour)}:${pad(minute)}:${pad(second)}`;

    case "second":
      // 'D MMMM HH:mm'
      return `${day} ${monthNamesFull[month]} ${pad(hour)}:${pad(minute)}`;

    case "minute":
    case "hour":
      // 'ddd D MMMM'
      return `${weekdayNamesShort[weekday]} ${day} ${monthNamesFull[month]}`;

    case "weekday":
    case "day":
    case "week":
      // 'MMMM YYYY'
      return `${monthNamesFull[month]} ${year}`;

    case "month":
      // 'YYYY'
      return year.toString();

    case "year":
      // empty string
      return "";

    default:
      return year.toString();
  }
};
