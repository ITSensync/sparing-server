const { Device } = require('../model/Device');
const defineDynamicNewModel = require('../model/DynamicNewData');
const defineDynamicOldModel = require('../model/DynamicOldData');
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
        ['createdAt', 'desc'],
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
      result = await DynamicOldModel.create(inputServer);

      // ADD TO DEVICE TBL
      const now = new Date();
      now.setSeconds(0, 0);
      const inputDevice = {
        id_device: inputServer.ids,
        last_update: now,
        cod: inputServer.cod,
        tss: inputServer.tss,
        ph: inputServer.ph,
        debit: inputServer.debit,
        debit2: inputServer.diff_debit,
        umpanbalik: inputServer.feedback,
      };
      result_device = await Device.upsert(inputDevice);
    } else {
      const DynamicNewModel = defineDynamicNewModel(inputServer.ids);
      await DynamicNewModel.sync();
      result = await DynamicNewModel.create(inputServer);
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

async function update(body, unixtime) {
  try {
    console.log(unixtime);
    const updatedData = await WaterQuality.findOne({
      where: { unixtime },
    });

    console.log(body);
    console.log(updatedData.feedback);
    if (body.status_2m) {
      updatedData.status_2m = body.status_2m;
    }
    if (body.status_1h) {
      updatedData.status_1h = body.status_1h;
    }
    updatedData.feedback = body.feedback;

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
  get,
  getLatest,
  update,
};
