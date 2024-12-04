/* eslint-disable prettier/prettier */
const { date } = require('joi');
const bsDateService = require('./bsdate.service');

const n = '०१२३४५६७८९';
const nN = n.split('');

const getNepaliNumber = (n, d = false) => {
  let sN = String(n);
  if (!d) sN = sN.replace(/[^\d.]/g, '');
  let sNN = '';
  for (let i = 0; i < sN.length; i++) {
    sNN += nN[parseInt(sN[i])] || sN[i];
  }
  return sNN;
};

const getEnglishNumber = (n, d = false) => {
  let sN = String(n);
  let sNN = '';
  if (!d) sN = sN.replace(/[^\०१२३४५६७८९.]/g, '');
  for (let i = 0; i < sN.length; i++) {
    if (nN.indexOf(sN[i]) > -1) sNN += nN.indexOf(sN[i]);
    else sNN += sN[i];
  }
  return sNN;
};

const getCurrentDate = () => {
  const today = new Date().toISOString();
  const dateString = today.split('T')[0];
  const bsDateString = bsDateService.ADToBS(dateString);
  return bsDateString;
};

const getCurrentDate_np = () => {
  return getNepaliNumber(getCurrentDate(), true);
};

const noOfDaysMonth = (month, year) => {
  if (year < 1970 || year > 2099) return 32;
  if (month > 0 && month < 13) return bsDateService.calendarData[year][month - 1];
  return 32;
};

const generateDates = ({ year, month, date, dayDiff }) => {
  const dates = [];
  for (let i = 0; i < dayDiff; i++) {
    dates.push(`${year}-${('0' + month.toString()).slice(-2)}-${('0' + (+date + i).toString()).slice(-2)}`);
  }
  return dates;
};

const getDatesBetween = (start, end) => {
  const [sY, sM, sD] = start.replace('/', '-').split('-');
  const [eY, eM, eD] = end.replace('/', '-').split('-');
  if (!sY || !sM || !sD || !eY || !eM || !eD) return [];
  if (sY === eY) {
    if (sM === eM) {
      const dayDiff = +eD - +sD + 1;
      return generateDates({ year: sY, month: sM, date: sD, dayDiff });
    }
    const monthDiff = +eM - +sM;
    let startDate = +sD;
    let endDate = +eD;
    let dayDiff = +bsDateService.calendarData[sY][+sM - 1];
    let dates = [];
    for (let i = 0; i <= monthDiff; i++) {
      dates = [...dates, ...generateDates({ year: sY, month: +sM + i, date: startDate, dayDiff: dayDiff - startDate + 1 })];
      startDate = 1;
      if (i === monthDiff - 1) {
        dayDiff = endDate;
      } else dayDiff = +bsDateService.calendarData[sY][+sM - 1 + i];
    }
    return dates;
  }
  if (sY < eY) {
    const yearDiff = +eY - +sY;
    let dates = [];
    let startMonth = +sM;
    let endMonth = 12;
    let startDate = +sD;
    let endDate = +eD;
    let dayDiff = +bsDateService.calendarData[sY][+sM - 1];
    const monthDiff = +eM - +sM;
    for (let i = 0; i <= yearDiff; i++) {
      for (let j = startMonth - 1; j < endMonth; j++) {
        dates = [
          ...dates,
          ...generateDates({
            year: +sY + i,
            month: j + 1,
            date: startDate,
            dayDiff: dayDiff - startDate + 1,
          }),
        ];
        startDate = 1;
        dayDiff = +bsDateService.calendarData[+sY + i][+sM - 1 + i];
        if (i === yearDiff - 1) {
          if (j === endMonth - 1) {
            dayDiff = endDate;
          } else dayDiff = +bsDateService.calendarData[sY][+sM - 1 + i];
        }
      }

      startMonth = 1;
      if (i === yearDiff - 1) {
        endMonth = +eM;
      }
    }

    return dates;
  }
  return [];
};

module.exports = {
  getCurrentDate,
  getCurrentDate_np,
  getNepaliNumber,
  getEnglishNumber,
  noOfDaysMonth,
  getDatesBetween,
};
