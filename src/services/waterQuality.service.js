const { Device } = require('../model/Device');
const defineDynamicNewModel = require('../model/DynamicNewData');
const defineDynamicOldModel = require('../model/DynamicOldData');
const { WaterLevel } = require('../model/WaterLevel');
const { WaterQuality } = require('../model/WaterQuality');

async function get() {
  try {
    const resultData = await WaterQuality.findAll();
    if (!resultData) {
      return {
        status: 500,
        message: 'ERROR GET SENSOR DATA',
      };
    }

    return {
      status: 200,
      data: resultData,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

async function getLatest() {
  try {
    const result = await WaterQuality.findOne({
      order: [
        ['time', 'desc'],
      ],
    });

    return {
      status: 200,
      data: result,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

async function add(req) {
  try {
    // create input fields
    const whitelistOldTable = ['sparing01', 'sparing02', 'sparing03', 'sparing04', 'sparing05', 'sparing06', 'sparing07', 'sparing08', 'sparing09', 'sparing10', 'sparing11'];
    const whitelistNewTable = ['sparing12', 'sparing13'];
    console.log(req.body);
    const inputServer = req.body;

    if (!whitelistOldTable.includes(inputServer.ids)
      && !whitelistNewTable.includes(inputServer.ids)) {
      return {
        status: 400,
        message: 'TABLE NAME NOT VALID',
      };
    }

    let result = null;
    let result_device = null;

    if (whitelistOldTable.includes(inputServer.ids)) {
      const DynamicOldModel = defineDynamicOldModel(inputServer.ids);
      await DynamicOldModel.sync();
      const {
        rs_stat, feedback, createdAt, diff_debit_old, diff_debit_adjust, ids, ...rawInputServer
      } = inputServer;
      const formattedBody = {
        ...rawInputServer,
        id_device: ids,
        debit2: diff_debit_adjust,
        umpanbalik: feedback,
        time: createdAt,
      };
      result = await DynamicOldModel.create(formattedBody);

      // ADD TO DEVICE TBL
      const inputDevice = {
        id_device: inputServer.ids,
        last_update: inputServer.createdAt,
        cod: inputServer.cod,
        tss: inputServer.tss,
        ph: inputServer.ph,
        debit: inputServer.debit,
        debit2: inputServer.diff_debit_adjust,
        umpanbalik: inputServer.feedback,
      };
      result_device = await Device.update(inputDevice, {
        where: {
          id_device: inputServer.ids,
        },
      });
    } else {
      const DynamicNewModel = defineDynamicNewModel(inputServer.ids);
      await DynamicNewModel.sync({ alter: true });

      const {
        rs_stat, feedback, createdAt, diff_debit_old, diff_debit_adjust, ...rawInputServer
      } = inputServer;
      const formattedBody = {
        ...rawInputServer,
        debit2: diff_debit_old,
        debitAdjust: diff_debit_adjust,
        umpanbalik: feedback,
        time: createdAt,
      };
      result = await DynamicNewModel.create(formattedBody);

      // ADD TO DEVICE TBL
      const inputDevice = {
        id_device: inputServer.ids,
        last_update: inputServer.createdAt,
        cod: inputServer.cod,
        tss: inputServer.tss,
        ph: inputServer.ph,
        debit: inputServer.debit,
        debit2: inputServer.diff_debit_adjust,
        umpanbalik: inputServer.feedback,
      };
      result_device = await Device.update(inputDevice, {
        where: {
          id_device: inputServer.ids,
        },
      });
    }

    if (!result && !result_device) {
      return {
        status: 500,
        message: 'ERROR ADD AND UPDATE SENSOR DATA',
      };
    }

    return {
      status: 200,
      data: result,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

async function addWaterLevel(req) {
  try {
    console.log(req.body);
    const result = await WaterLevel.create(req.body);
    return {
      status: 200,
      data: result,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

async function update(body, unixtime) {
  try {
    console.log(unixtime);
    const updatedData = await WaterQuality.findOne({
      where: { unixtime },
    });

    console.log(body);
    if (body.status_1h) {
      updatedData.status_1h = body.status;
    }
    updatedData.umpanbalik = body.feedback;

    updatedData.save();

    return {
      status: 200,
      message: 'UPDATE WATER QUALITY DATA SUCCESS',
    };
  } catch (error) {
    console.error(error.message);
    return {
      status: 500,
      message: 'UPDATE WATER QUALITY DATA FAILED',
      stack: error,
    };
  }
}

module.exports = {
  add,
  addWaterLevel,
  get,
  getLatest,
  update,
};
