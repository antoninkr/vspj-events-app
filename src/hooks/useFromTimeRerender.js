import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
/**
 *
 * @param {Date} date1
 * @param {Date} date2
 * @returns
 */
export const useFromTimeRerenderer = (date1, date2 = null) => {
  const [intervalCount, setIntervalCount] = useState(0);
  if (!date2) {
    date2 = moment();
  }
  let refreshIn = 60000;
  const dt = moment(date1);
  const diff = dt.diff(date2, 'minutes');
  if (diff < 0) return [-1];

  if (diff < 44) {
    refreshIn = 60000;
  } else if (diff < 89) {
    refreshIn = 60000 * 5;
  } else if (diff < 21 * 60) {
    refreshIn = 60000 * 20;
  } else if (diff < 35 * 60) {
    refreshIn = 60000 * 120;
  } else {
    refreshIn = 60000 * 60 * 10;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntervalCount((count) => count + 1);
      console.log(`${moment().format('h:mm:ss a')} refresh in ${refreshIn}`);
    }, refreshIn);
    return () => clearTimeout(timer);
  }, [intervalCount]);

  return [refreshIn];
};
