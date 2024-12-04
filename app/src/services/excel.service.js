/* eslint-disable no-param-reassign */
const Excel = require('exceljs');

const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

const generateExcel = async ({ sheets = [], location }) => {
  const workbook = new Excel.Workbook();

  sheets.forEach(
    ({ columns, rows, subColumns, merge, sheetName = 'Sheet1', filterHeading, headerTo = 'N', headerTitle = '' }) => {
      const worksheet = workbook.addWorksheet(sheetName);

      console.log(rows);

      worksheet.columns = columns.map((c) => ({
        ...c,
        style: {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'e9e9e9' },
          },
          border: {
            top: { style: 'thin', color: { argb: '000000' } },
            left: { style: 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: 'thin', color: { argb: '000000' } },
          },
          ...(c.style || {}),
        },
      }));

      // Duplicated my headers in 3 rows (1,2,3).
      worksheet.duplicateRow(1, 2, true); //duplicate header row 2 times with values and style; in row2 and row3

      worksheet.getRow(1).values = [];
      // worksheet.getRow(1).height = 20;
      // Added metadata in 1st row
      worksheet.getCell('A1').value = headerTitle;
      worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getCell('A1').font = {
        size: 14,
        bold: true,
      };

      worksheet.mergeCells('A1', `${headerTo}1`);
      // worksheet.getRow(1).values = ['Some meta data']; //Replace row1 headers with "Berry Type";here we pass an array where each index denotes a cells

      // Removing duplicated headers from 2nd row
      worksheet.getRow(2).values = [];
      // worksheet.getRow(2).height = 30;
      // Added metadata in 1st row
      worksheet.getCell('A2').value = filterHeading;
      worksheet.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getCell('A2').font = {
        size: 12,
      };
      worksheet.mergeCells('A2', `${headerTo}2`);

      if (subColumns.length) {
        worksheet.addRow(subColumns);
      }

      if (merge) {
        merge.forEach((rC) => {
          worksheet.mergeCells(rC);
        });
      }

      const headerRow = worksheet.getRow(3);

      headerRow.eachCell((cell) => {
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true,
        };
        cell.style = {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'AFE1AF' },
          },
          font: {
            bold: true,
          },
          border: {
            top: { style: 'double', color: { argb: '000000' } },
            left: { style: 'double', color: { argb: '000000' } },
            bottom: { style: 'double', color: { argb: '000000' } },
            right: { style: 'double', color: { argb: '000000' } },
          },
        };
      });

      worksheet.addRows(rows);
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index <= rows.length; index++) {
        const row = worksheet.getRow(index + 3);
        row.eachCell((cell) => {
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
          };
        });
      }
    }
  );
  return workbook.xlsx.writeFile(location);
};

const readExcelFile = async (path, headerAt = 1, headerMetaData = {}, sheet = 1) => {
  const wb = new Excel.Workbook();
  return wb.xlsx
    .readFile(path)
    .then(async () => {
      const ws = wb.getWorksheet(sheet);

      const r1 = ws.getRow(headerAt);
      const headers = [];

      r1.eachCell((r) => {
        headers.push(r.text);
      });

      const noOfRows = ws.rowCount;
      const data = [];
      for (let index = (headerAt || 1) + 1; index <= noOfRows; index++) {
        const singleRow = {};
        const rowData = ws.getRow(index);
        rowData.eachCell((row, colNo) => {
          const headerValue = headerMetaData[headers[colNo - 1]] || headers[colNo - 1];
          if (typeof headerValue === 'string') {
            singleRow[headerValue] = row.text;
          } else if (Array.isArray(headerValue)) {
            const key = singleRow[headerValue[0]];
            if (!key)
              singleRow[headerValue[0]] = {
                [headerValue[1]]: row.text,
              };
            else
              singleRow[headerValue[0]] = {
                ...singleRow[headerValue[0]],
                [headerValue[1]]: row.text,
              };
          }
        });
        if (Object.keys(singleRow).length !== 0) data.push(singleRow);
      }
      // await unlinkAsync(path);
      return data;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  generateExcel,
  readExcelFile,
};
