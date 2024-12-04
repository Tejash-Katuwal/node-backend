/* eslint-disable no-await-in-loop */
const mongoose = require('mongoose');
// const fs = require('fs');

const config = require('../config/config');
const logger = require('../config/logger');

const excelService = require('../services/excel.service');
const classService = require('../services/class.service');
const userService = require('../services/user.service');
const { BSToAD } = require('../services/bsdate.service');
const Student = require('../models/student.model');
const Temp = require('../models/tempUser.model');
const scheduleService = require('../services/schedule.service');
const { userCreateUpdateCommand } = require('../services/command.service');

const getClassSpecificStudents = async ({ sheets = [], class_number = 8, userIdPointer = 1 }) => {
  let data = [];
  for (let index = 0; index < sheets.length; index++) {
    const element = sheets[index];
    const section = element.split(' ')[1] || 'A';
    let classData, classDataB;
    if (class_number === 4) {
      classData = await classService.getClassByClassNumber(class_number, 'A');
      classDataB = await classService.getClassByClassNumber(class_number, 'B');
    } else {
      classData = await classService.getClassByClassNumber(class_number, section);
    }

    const result = await excelService.readExcelFile('./students.xlsx', 1, {}, element);
    const newResults = [...result];
    const filtered = newResults
      .filter((r) => r.ROLL)
      .map((r) => {
        const res = { ...r };
        if (class_number === 4)
          if (+res.ROLL % 2 === 0) res.grade = classDataB && classDataB._id;
          else res.grade = classData && classData._id;
        else res.grade = classData && classData._id;
        return { ...res };
      });
    data = [...data, ...filtered];
  }
  // await scheduleService.initDeviceSchedule();

  const students = data
    .map((d, i) => {
      let tmpArray = filter.name.split(' ');
      let first_name = '',
        last_name = '';
      if (tmpArray.length > 1) {
        last_name = tmpArray.pop();
        first_name = tmpArray.join(' ');
      } else {
        first_name = tmpArray[0] || '';
      }
      const data = {
        first_name,
        last_name,
        image: d.Photo,
        address: d.Address,
        phone: d.Contact,
        date_of_birth_bs: d.DOB,
        roll_no: d.ROLL,
        userId: userIdPointer + +d.ROLL,
        status: 'active',
        grade: d.grade,
        role: 'student',
        userType: 'Student',
        date_of_birth_ad: d.DOB ? BSToAD(d.DOB) : '',
        validity: '2081-12-32',
      };

      if (d.Card) {
        data.card_number = d.Card;
      }
      // scheduleService.deviceQueue.addBySN('GED7235100933', userCreateUpdateCommand(data));
      return data;
    })
    .sort((a, b) => a.roll_no - b.roll_no);

  return students;
};

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    const eight = await getClassSpecificStudents({ sheets: ['Eight A', 'Eight B'], class_number: 8, userIdPointer: 200 });

    console.log('eight', 201);

    let nextUserIdPointer = eight[eight.length - 1].userId;
    const seven = await getClassSpecificStudents({
      sheets: ['Seven A', 'Seven B'],
      class_number: 7,
      userIdPointer: nextUserIdPointer,
    });

    console.log('seven', nextUserIdPointer + 1);

    nextUserIdPointer = seven[seven.length - 1].userId;
    const six = await getClassSpecificStudents({
      sheets: ['Six A', 'Six B'],
      class_number: 6,
      userIdPointer: nextUserIdPointer,
    });

    console.log('six', nextUserIdPointer + 1);

    nextUserIdPointer = six[six.length - 1].userId;
    const five = await getClassSpecificStudents({
      sheets: ['Five A', 'Five B'],
      class_number: 5,
      userIdPointer: nextUserIdPointer,
    });

    console.log('five', nextUserIdPointer + 1);

    nextUserIdPointer = five[five.length - 1].userId;
    const four = await getClassSpecificStudents({
      sheets: ['Four'],
      class_number: 4,
      userIdPointer: nextUserIdPointer,
    });

    console.log('four', nextUserIdPointer + 1);

    nextUserIdPointer = four[four.length - 1].userId;
    const three = await getClassSpecificStudents({
      sheets: ['Three'],
      class_number: 3,
      userIdPointer: nextUserIdPointer,
    });

    console.log('three', nextUserIdPointer + 1);

    nextUserIdPointer = three[three.length - 1].userId;
    const two = await getClassSpecificStudents({
      sheets: ['Two'],
      class_number: 2,
      userIdPointer: nextUserIdPointer,
    });

    console.log('two', nextUserIdPointer + 1);

    nextUserIdPointer = two[two.length - 1].userId;
    const one = await getClassSpecificStudents({
      sheets: ['One'],
      class_number: 1,
      userIdPointer: nextUserIdPointer,
    });

    console.log('one', nextUserIdPointer + 1);

    nextUserIdPointer = one[one.length - 1].userId;
    const ukg = await getClassSpecificStudents({
      sheets: ['UKG'],
      class_number: 'UKG',
      userIdPointer: nextUserIdPointer,
    });

    console.log('ukg', nextUserIdPointer + 1);

    nextUserIdPointer = ukg[ukg.length - 1].userId;
    const lkg = await getClassSpecificStudents({
      sheets: ['LKG'],
      class_number: 'LKG',
      userIdPointer: nextUserIdPointer,
    });

    console.log('lkg', nextUserIdPointer + 1);

    nextUserIdPointer = lkg[lkg.length - 1].userId;
    const nursury = await getClassSpecificStudents({
      sheets: ['Nursery'],
      class_number: 'Nursery',
      userIdPointer: nextUserIdPointer,
    });

    console.log('nursery', nextUserIdPointer + 1);

    // const allStudents = [...eight, ...seven, ...six, ...five, ...four, ...three, ...two, ...one, ...ukg, ...lkg, ...nursury];
    // const ten = await getClassSpecificStudents({
    //   sheets: ['Ten'],
    //   class_number: 10,
    //   userIdPointer: 0,
    // });

    // let nextUserIdPointer = ten[ten.length - 1].userId;
    // const nine = await getClassSpecificStudents({
    //   sheets: ['Nine A', 'Nine B', 'Nine C'],
    //   class_number: 9,
    //   userIdPointer: nextUserIdPointer,
    // });

    // const allStudents = [...ten, ...nine];
    // await userService.updateUserByIdDiscreminator(allStudents, true);
    console.log('done');
  } catch (e) {
    console.log(e);
  }
};
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  importData();
});
