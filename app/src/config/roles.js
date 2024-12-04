const getByOrganization = (req) => {
  if (req.user.organization) {
    req.query.organization = req.user.organization.toString();
    return true;
  }
  return false;
};
const getByOrganizationParams = (req) => {
  if (req.user.organization) {
    req.params.id = req.user.organization.toString();
    return true;
  }
  return false;
};
const updateByOrganization = (req) => {
  if (req.user.organization) {
    req.query.organization = req.user.organization.toString();
    req.body.organization = req.user.organization.toString();
    return true;
  }
  return false;
};
const createByOraganization = (req) => {
  if (req.user.organization) {
    req.body.organization = req.user.organization.toString();
    return true;
  }
  return false;
};

const allRoles = {
  organizationAdmin: {
    static: [
      // fiscalYear
      'getActiveFiscalYear',
    ],
    dynamic: {
      getUsers: getByOrganization,
      manageUsers: (req) => {
        if (req.user.organization) {
          if (req.method === 'GET') {
            req.query.organization = req.user.organization;
            return true;
          } else if (req.method === 'POST') {
            // might need to check if user belongs to same organization before updateing
            req.body.role = 'organizationAdmin';
            req.body.organization = req.user.organization;
            return true;
          } else if (req.method === 'PATCH') {
            req.query.organization = req.user.organization;
            req.body.role = 'organizationAdmin';
            req.body.organization = req.user.organization;
          } else if (req.method === 'DELETE') {
            req.query.organization = req.user.organization;
            return true;
          }
        }
        return true;
      },
      getAttendanceReport: getByOrganization,
      getAttendanceReportExcel: getByOrganization,
      getAbsenceReport: getByOrganization,
      getAbsenceReportExcel: getByOrganization,
      getAttendanceReportIndividual: getByOrganization,
      getAttendanceReportIndividualExcel: getByOrganization,
      getStats: getByOrganization,
      'getAll:shift': getByOrganization,
      'create:shift': createByOraganization,
      'get:shift': getByOrganization,
      'update:shift': updateByOrganization,
      'delete:shift': getByOrganization,
      'getAll:device': getByOrganization,
      'get:device': getByOrganization,
      'create:student': createByOraganization,
      'get:student': getByOrganization,
      'update:student': updateByOrganization,
      'delete:student': getByOrganization,
      'getAll:student': getByOrganization,
      'create:employee': createByOraganization,
      'get:employee': getByOrganization,
      'update:employee': updateByOrganization,
      'delete:employee': getByOrganization,
      'getAll:employee': getByOrganization,
      'create:teacher': createByOraganization,
      'get:teacher': getByOrganization,
      'update:teacher': updateByOrganization,
      'delete:teacher': getByOrganization,
      'getAll:teacher': getByOrganization,
      'get:tempUser': getByOrganization,
      'delete:tempUser': getByOrganization,
      'getAll:tempUser': getByOrganization,
      'create:class': createByOraganization,
      'get:class': getByOrganization,
      'update:class': updateByOrganization,
      'delete:class': getByOrganization,
      'getAll:class': getByOrganization,
      'get:attendanceLog': getByOrganization,
      'getAll:attendanceLog': getByOrganization,
      'get:department': getByOrganizationParams,
      'create:holiday': createByOraganization,
      'get:holiday': getByOrganization,
      'update:holiday': updateByOrganization,
      'delete:holiday': getByOrganization,
      'getAll:holiday': getByOrganization,
    },
  },
  unassigned: {
    static: [],
    dynamic: {},
  },
  student: {
    static: [],
    dynamic: {
      getAttendanceReportIndividualStudent: (req) => {
        req.query.id = req.user.id;
        req.query.stats = false;
        return true;
      },
      'getAll:holiday': getByOrganization,
    },
  },
  teacher: {
    static: [],
    dynamic: {
      getAttendanceReportIndividualStudent: (req) => {
        req.query.id = req.user.id;
        if (!req.user.grade) {
          req.query.stats = false;
        }
        return true;
      },
      'getAll:student': (req) => {
        if (req.user.grade) {
          req.query.class = req.user.grade.toString();
          return true;
        }
        return false;
      },
      getAttendanceReportIndividual: (req) => {
        if (req.user.grade) {
          req.query.id = req.params.id;
          req.query.grade = req.user.grade.toString();
          return true;
        }
        return false;
      },
      'getAll:holiday': getByOrganization,
    },
  },
  employee: {
    static: [],
    dynamic: {
      getAttendanceReportIndividualStudent: (req) => {
        req.query.id = req.user.id;
        return true;
      },
      'getAll:holiday': getByOrganization,
    },
  },
  admin: {
    static: [
      'manageUsers',
      'getUsers',

      // fingerPrint
      'getFingerPrints',
      'getFingerPrint',
      'getFingerPrintApplicant',

      // fiscalYear
      'createFiscalYear',
      'getFiscalYears',
      'getActiveFiscalYear',
      'activateFiscalYear',
      'getFiscalYear',
      'updateFiscalYear',
      'deleteFiscalYear',

      // nagarpalika
      'updateNagarpalika',

      //report
      'getAttendanceReport',
      'getAttendanceReportExcel',
      'getAbsenceReport',
      'getAbsenceReportExcel',
      'getAttendanceReportIndividual',
      'getAttendanceReportIndividualExcel',

      //stats
      'getStats',

      // wards
      'createWard',
      'getWard',
      'updateWard',
      'deleteWard',

      //shifts
      'getAll:shift',
      'create:shift',
      'get:shift',
      'update:shift',
      'delete:shift',

      //device
      'create:device',
      'get:device',
      'update:device',
      'delete:device',
      'getAll:device',

      // organization
      'create:organization',
      'get:organization',
      'update:organization',
      'delete:organization',
      'getAll:organization',
      'get:department',

      // student
      'create:student',
      'get:student',
      'update:student',
      'delete:student',
      'getAll:student',

      // employee
      'create:employee',
      'get:employee',
      'update:employee',
      'delete:employee',
      'getAll:employee',

      // teacher
      'create:teacher',
      'get:teacher',
      'update:teacher',
      'delete:teacher',
      'getAll:teacher',

      // tempUser
      'create:tempUser',
      'get:tempUser',
      'update:tempUser',
      'delete:tempUser',
      'getAll:tempUser',

      // attendanceLog
      'create:attendanceLog',
      'get:attendanceLog',
      'update:attendanceLog',
      'delete:attendanceLog',
      'getAll:attendanceLog',

      // organizationType
      'create:organizationType',
      'get:organizationType',
      'update:organizationType',
      'delete:organizationType',
      'getAll:organizationType',

      // class
      'create:class',
      'get:class',
      'update:class',
      'delete:class',
      'getAll:class',

      // sync
      'sync:user',

      //holiday
      'create:holiday',
      'get:holiday',
      'update:holiday',
      'delete:holiday',
      'getAll:holiday',
    ],
  },
};

const roles = Object.keys(allRoles);

module.exports = {
  roles,
  roleRights: allRoles,
};
