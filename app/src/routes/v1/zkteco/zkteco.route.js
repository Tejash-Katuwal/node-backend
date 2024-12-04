const express = require('express');
const { ATTLOGMAP, verify, operationLogMap, operationType, LF, infoMap, userMap } = require('../../../config/zktecoConfig');

const attendanceLogService = require('../../../services/attendanceLog.service');
const userService = require('../../../services/user.service');
const deviceService = require('../../../services/device.service');
const operationLogService = require('../../../services/operationLog.service');

const { deviceQueue } = require('../../../services/schedule.service');
const { ADToBS } = require('../../../services/bsdate.service');

const router = express.Router();

router
  .route('/cdata')
  .post(async (req, res) => {
    const deviceInfo = await deviceService.getDeviceBySerialNumber(req.query.SN);
    if (!deviceInfo) {
      return res.send('OK\n');
    }
    if (req.query.table === 'ATTLOG') {
      // ${Pin}${HT}${Time}${HT}${Status}${HT}${Verify}${HT}${Workcode}${HT}${Reserved}${HT}${Reserved}
      const datas = req.body.split('\n').filter((i) => i);
      const data = datas.map((data) => {
        let dataObj = { SN: req.query.SN, organization: deviceInfo.organization };
        data.split('\t').forEach((d, idx) => {
          const key = ATTLOGMAP[idx];
          if (key === 'verify') {
            dataObj = { ...dataObj, [key]: verify[d] };
          } else if (key === 'time') {
            const date = d.substring(0, 10);
            dataObj = { ...dataObj, [key]: d, date: ADToBS(date) };
          } else if (key) {
            dataObj = { ...dataObj, [key]: d };
          }
        });
        return dataObj;
      });

      await attendanceLogService.createAttendanceLog(data);
    } else if (req.query.table === 'OPERLOG') {
      if (req.body.startsWith('OPLOG ')) {
        // OPLOG${SP}${OpType}${HT}${OpWho}${HT}${OpTime}${HT}${Value1}${HT}${Value2}${HT}${Value3}${HT}${Reserved}
        const datas = req.body
          .replaceAll('OPLOG ', '')
          .split('\n')
          .filter((i) => i);

        const data = datas.map((data) => {
          let dataObj = { SN: req.query.SN, organization: deviceInfo.organization };
          data.split('\t').forEach((d, idx) => {
            const key = operationLogMap[idx];
            if (key === 'type') {
              dataObj = { ...dataObj, [key]: operationType[d] || '' };
            } else if (key) {
              dataObj = { ...dataObj, [key]: d };
            }
          });
          return dataObj;
        });
        const deletedUsers = data
          .filter((d) => d.type === operationType['9'] && d.value1)
          .map((d) => ({ userId: d.value1, status: 'deleted_from_device' }));
        if (deletedUsers.length) {
          await userService.updateUserByIdDiscreminator(deletedUsers, false, deviceInfo.organization);
        }
        const newData = await operationLogService.createOperationLog(data);
        console.log(newData);
      } else if (req.body.startsWith('USER ')) {
        // USER${SP}PIN=${XXX}${HT}Name=${XXX}${HT}Pri=${XXX}${HT}Passwd=${XXX}${HT}Card=${XXX}${HT}Grp=${XXX}${HT}TZ=${XXX}${HT}Verify=${XXX}${HT}ViceCard=${XXX}
        const datas = req.body
          .replaceAll('USER ', '')
          .split('\n')
          .filter((i) => i);

        const data = datas.map((data) => {
          let dataObj = { organization: deviceInfo.organization };
          data.split('\t').forEach((d, idx) => {
            let [key, ...value] = d.split('=');
            value = value.join('=');
            if (key === 'Verify' && value) {
              dataObj = { ...dataObj, [userMap[key]]: verify[value] };
            } else if (key === 'Name' && value) {
              let tmpArray = value.split(' ');
              let first_name = '',
                last_name = '';
              if (tmpArray.length > 1) {
                last_name = tmpArray.pop();
                first_name = tmpArray.join(' ');
              } else {
                first_name = tmpArray[0] || '';
              }
              dataObj = { ...dataObj, first_name, last_name: last_name || '' };
            } else if (key === 'PIN' && value) {
              dataObj = {
                ...dataObj,
                [userMap[key]]: +value,
              };
            } else if (key && value) {
              dataObj = { ...dataObj, [userMap[key]]: value };
            }
          });
          return dataObj;
        });
        // await userService.updateUserByIdDiscreminator(data, true, deviceInfo.organization);

        // console.log(data);
      }
      // else if (req.body.startsWith('IDCARD ')) {
      //   // IDCARD${SP}PIN=${XXX}${HT}SNNum=${XXX}${HT}IDNum=${XXX}${HT}DNNum=${XXX}${HT}Name=${XXX}${HT}Gender=${XXX}${HT}Nation=${XXX}${HT}Birthday=${XXX}${HT}ValidInfo=${XXX}${HT}Address=${XXX}${HT}AdditionalInfo=${XXX}${HT}Issuer=${XXX}${HT}Photo=${XXX}${HT}FPTemplate1=${XXX}${HT}FPTemplate2=${XXX}${HT}Reserve=${XXX}${HT}Notice=${XXX}
      //   const datas = req.body
      //     .replaceAll('IDCARD ', '')
      //     .split('\n')
      //     .filter((i) => i);

      //   const data = datas.map((data) => {
      //     let dataObj = {};
      //     data.split('\t').forEach((d, idx) => {
      //       let [key, ...value] = d.split('=');
      // value= value.join('=')
      //       if (key && value) {
      //         dataObj = { ...dataObj, [key]: value };
      //       }
      //     });
      //     return dataObj;
      //   });

      //   console.log(data);
      // }
      // else if (req.body.startsWith('FP ')) {
      //   // FP${SP}PIN=${XXX}${HT}FID=${XXX}${HT}Size=${XXX}${HT}Valid=${XXX}${HT}TMP=${XXX}
      //   const datas = req.body
      //     .replaceAll('FP ', '')
      //     .split('\n')
      //     .filter((i) => i);

      //   const data = datas.map((data) => {
      //     let dataObj = {};
      //     data.split('\t').forEach((d, idx) => {
      //       let [key, ...value] = d.split('=');
      // value= value.join('=')
      //       if (key && value) {
      //         dataObj = { ...dataObj, [key]: value };
      //       }
      //     });
      //     return dataObj;
      //   });

      //   console.log(data, 'data');
      // }
      else if (req.query.table === 'ERRORLOG ') {
        // ERRORLOG ErrCode=${XXX}$(HT)ErrMsg=${XXX}$(HT)DataOrigin=${XXX}$(HT)CmdId=${XXX}$(HT)Additi
        const datas = req.body
          .replaceAll('ERRORLOG ', '')
          .split('\n')
          .filter((i) => i);

        const data = datas.map((data) => {
          let dataObj = { organization: deviceInfo.organization };
          data.split('\t').forEach((d, idx) => {
            let [key, ...value] = d.split('=');
            value = value.join('=');
            if (key && value) {
              dataObj = { ...dataObj, [key]: value };
            }
          });
          return dataObj;
        });

        console.log(data);
      }
    }
    res.send('OK\n');
  })
  .get(async (req, res) => {
    const deviceInfo = await deviceService.getDeviceBySerialNumber(req.query.SN);
    if (!deviceInfo) {
      return res.send('OK\n');
    }
    // let request=`GET OPTION FROM: ${SerialNumber}${LF}${XXX}Stamp=${XXX}${LF}ErrorDelay=${XXX}${LF}Delay=${XXX}${LF}TransTimes=${XXX}${LF}TransInterval=${XXX}${LF}TransFlag=${XXX}${LF}TimeZone=${XXX}${LF}Realtime=${XXX}${LF}Encrypt=${XXX}${LF}ServerVer=${XXX}${LF}PushProtVer=${XXX}${LF}PushOptionsFlag=${XXX}${LF}PushOptions=${XXX}`
    let request = `GET OPTION FROM: ${req.query.SN}${LF}ATTLOGStamp=9999${LF}OPERLOGStamp=9999${LF}ATTPHOTOStamp=9999${LF}ErrorDelay=30${LF}Delay=10${LF}TransTimes=10: 05;14: 05${LF}TransInterval=1${LF}TransFlag=TransData AttLog OpLog AttPhoto EnrollUser ChgUser EnrollFP ChgFP UserPic WORKCODE BioPhoto${LF}TimeZone=345${LF}Realtime=1${LF}Encrypt=None`;
    res.setHeader('Date', new Date().toUTCString());
    res.status(200).send(`${request}${LF}`);
  });

router.route('/getrequest').get(async (req, res) => {
  if (req.query.INFO) {
    const info = req.query.INFO.split(',');
    let infoData = {};
    info.forEach((i, idx) => {
      const key = infoMap[idx];
      if (key) infoData = { ...infoData, [key]: i };
    });
    await deviceService.updateDeviceINFOBySN(req.query.SN, { config: infoData });
  }

  const job = await deviceQueue.getNextJob(req.query.SN);
  if (job) {
    if (job.data && job.data.cmd) {
      return res.send(`C:${job.id}:${job.data.cmd}`);
    }
  }
  res.send('OK\n');
});

router.route('/devicecmd').post(express.raw(), async (req, res) => {
  if (req.body) {
    const bodyString = req.body.toString();

    if (bodyString) {
      const datas = bodyString.split('\n').filter((i) => i);
      const data = datas.map((data) => {
        let dataObj = {};
        data.split('&').forEach((d, idx) => {
          let [key, ...value] = d.split('=');
          value = value.join('=');
          if (key && value) {
            dataObj = { ...dataObj, [key]: value };
          }
        });
        return dataObj;
      });
      if (data.length) {
        const responseData = data[0];

        const success = responseData.Return === '0';
        const jobId = responseData.CMD;
        if (jobId) {
          const job = await deviceQueue.getJob(req.query.SN, jobId);
          if (job) {
            if (success) {
              await job.moveToCompleted('success', true, true);
            } else {
              await job.moveToFailed(new Error('some error message'), true);
            }
          }
        }
      }
    }
    console.log(req.query, req.body.toString(), 'devicemd');
  }
  res.send('OK\n');
});

// app.get('/iclock/accounts/login/', (req, res) => {
//   console.log(req.query, req.body, 'login');
//   device = { ...req.query };
//   res.send('OK\n');
// });

// app.get('/iclock/ping', (req, res) => {
//   console.log(req.query, req.body, 'ping');
//   res.send('OK\n');
// });

// app.post('/iclock/exchange', (req, res) => {
//   console.log(req.query, req.body, 'exchange');
//   res.send('OK\n');
// });

module.exports = router;
