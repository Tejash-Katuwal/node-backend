const { privilegeMap, SP, HT } = require('../config/zktecoConfig');

const clearAllData = () => {
  return {
    cmd: `CLEAR${SP}DATA`,
  };
};

const holiday = () => {
  return {
    cmd: `DATA${SP}UPDATE${SP}AccHoliday${SP}UID=${1}${HT}HolidayName=${'aja'}${HT}StartDate=${'0805'}${HT}EndDate=${'0805'}${HT}TimeZone=${'345'}`,
  };
};

const userCreateUpdateCommand = (userInfo = {}) => {
  return {
    cmd: `DATA UPDATE USERINFO PIN=${userInfo.userId}	Name=${userInfo.first_name}${` ${userInfo.last_name || ''}`}	Pri=${
      privilegeMap[userInfo.privilege] || ''
    }	Passwd=${userInfo.Passwd || ''}	Card=${userInfo.card_number || ''}	Grp=1	TZ=0000000100000000	Category=0`,
  };
};

const userDeleteCommand = (userId) => {
  return {
    cmd: `DATA DELETE USERINFO PIN=${userId}`,
  };
};

const getAttendanceLogCommand = (startTime, endTime) => {
  return {
    cmd: `DATA${SP}QUERY${SP}ATTLOG${SP}StartTime=${startTime || ''}${HT}EndTime=${endTime || ''}`,
  };
};

const getUserInfoLog = (userId) => {
  return {
    cmd: userId ? `DATA${SP}QUERY${SP}USERINFO${SP}PIN=${userId}` : `DATA${SP}QUERY${SP}USERINFO${SP}`,
  };
};

const log = () => {
  return {
    cmd: `LOG`,
  };
};

const reloadOptions = () => {
  return {
    cmd: `RELOAD${SP}OPTIONS`,
  };
};

const info = () => {
  return {
    cmd: `INFO`,
  };
};

const reboot = () => {
  return {
    cmd: `REBOOT`,
  };
};

const clearLog = () => {
  return {
    cmd: `CLEAR${SP}LOG`,
  };
};

const clearData = () => {
  return {
    cmd: `CLEAR${SP}DATA`,
  };
};

module.exports = {
  userCreateUpdateCommand,
  userDeleteCommand,
  getAttendanceLogCommand,
  getUserInfoLog,
  log,
  reloadOptions,
  info,
  reboot,
  clearLog,
  clearData,
  holiday,
  clearAllData,
};
