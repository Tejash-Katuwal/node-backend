const Queue = require('bull');
const deviceService = require('../services/device.service');
const organizationService = require('../services/organization.service');

class parallelQueue {
  static instances = [];

  static getInstance(queueName) {
    const result = this.instances.find(({ queueInstanceName }) => queueInstanceName === queueName);
    if (result) {
      return result.queueInstance;
    }
    return null;
  }

  static getInstances(queueNames = []) {
    const result = this.instances.filter(({ queueInstanceName }) => queueNames.includes(queueInstanceName));
    if (result.length) {
      return result.map(({ queueInstance }) => queueInstance);
    }
    return [];
  }

  static async createInstance(queueName) {
    const result = this.instances.find(({ queueInstanceName }) => queueInstanceName === queueName);
    if (result) {
      return result.queueInstance;
    } else {
      const queueInstance = await this.initializeQueue(queueName);
      this.instances.push({ queueInstanceName: queueName, queueInstance: queueInstance });
      return queueInstance;
    }
  }

  static async initializeQueue(queueName) {
    const queueInstance = new Queue(queueName, 'redis://redis:6379/0', {
      settings: {
        lockDuration: 60000,
        drainDelay: 0.01,
      },
    });
    return queueInstance;
  }
}

const initDeviceSchedule = async () => {
  const { results } = await deviceService.getDevices();
  if (results?.length) {
    for (let index = 0; index < results.length; index++) {
      const device = results[index];
      await parallelQueue.createInstance(device.serial_number);
    }

    // const queueInstance = parallelQueue.getInstance('GED7235100961');
    // if (queueInstance) {
    //   queueInstance.add(holiday());
    // }
  }
};

const add = async (orgId, data) => {
  if (orgId) {
    const organization = await organizationService.getOrganizationById(orgId);
    if (!organization) return;

    const queueInstance = parallelQueue.getInstances(organization.device || []);
    if (queueInstance.length) {
      queueInstance.forEach(async (queue) => {
        await queue.add(data);
      });
    }
  }
};

const addBySN = async (serial_number, data) => {
  const queueInstance = parallelQueue.getInstance(serial_number);
  if (queueInstance) {
    await queueInstance.add(data);
  }
};

const getJob = async (serial_number, jobId) => {
  const queueInstance = parallelQueue.getInstance(serial_number);
  if (queueInstance) return await queueInstance.getJob(jobId);
  return;
};

const getNextJob = async (serial_number) => {
  const queueInstance = parallelQueue.getInstance(serial_number);
  if (queueInstance) return await queueInstance.getNextJob();
  return;
};

module.exports = {
  parallelQueue,
  initDeviceSchedule,
  deviceQueue: { add, getJob, getNextJob, addBySN },
};
