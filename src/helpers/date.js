import moment from 'moment';

/**
 *
 * @param {Date} date
 * @returns
 */
export const getDatesOfMonth = (date) => {
  const arr = [];

  const momentDate = moment(date);
  const year = momentDate.year();
  const month = momentDate.month();

  for (let day = 1; day <= momentDate.daysInMonth(); day++) {
    arr.push(moment().year(year).month(month).date(day).hour(12));
  }

  return arr;
};
