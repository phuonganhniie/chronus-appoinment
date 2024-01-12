import dayjs from "dayjs";

export function getMonth(date = dayjs()) {
  if (!(date instanceof dayjs)) {
    date = dayjs(date);
  }
  let month = date.month();
  let year = date.year();
  if (month < 0) {
    let offset = Math.abs(month) % 12;
    year -= Math.ceil(Math.abs(month) / 12);
    month = 12 - offset;
  } else if (month > 11) {
    year += Math.floor(month / 12);
    month = month % 12;
  }
  const firstDayOFTheMonth = dayjs(new Date(year, month, 1)).day();
  let generateMonth = 0 - firstDayOFTheMonth;
  const generateMonthDaysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      generateMonth++;
      return dayjs(new Date(year, month, generateMonth));
    });
  });
  return generateMonthDaysMatrix;
}

export function getWeek(day = dayjs()) {
  const startOfWeek = day.startOf("week");
  let generateHour = -1;
  const generateWeekHoursMatrix = new Array(24).fill(null).map(() => {
    generateHour++;
    return new Array(7).fill(null).map((dayOffSet, index) => {
      return startOfWeek
        .clone()
        .add(index, "day")
        .hour(generateHour % 24);
    });
  });
  return generateWeekHoursMatrix;
}

export function getDay(day = dayjs()) {
  const year = day.year();
  const month = day.month();
  const date = day.date();
  const generateDayHoursMatrix = new Array(24).fill(null).map((_, hour) => {
    return dayjs(new Date(year, month, date, hour));
  });
  return generateDayHoursMatrix;
}

export function getYear(year = dayjs().year()) {
  const generateYearMonthsMatrix = new Array(12).fill(null).map((_, month) => {
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let generateMonth = 0 - firstDayOfTheMonth;
    return new Array(5).fill([]).map(() => {
      return new Array(7).fill(null).map(() => {
        generateMonth++;
        return dayjs(new Date(year, month, generateMonth));
      });
    });
  });
  return generateYearMonthsMatrix;
}
