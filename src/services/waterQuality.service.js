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

// ======================
// MODEL CACHE
// ======================
const oldModelCache = {};
const newModelCache = {};

function getOldModel(ids) {
  if (!oldModelCache[ids]) {
    oldModelCache[ids] = defineDynamicOldModel(ids);
  }
  return oldModelCache[ids];
}

function getNewModel(ids) {
  if (!newModelCache[ids]) {
    newModelCache[ids] = defineDynamicNewModel(ids);
  }
  return newModelCache[ids];
}

// ======================
// WHITELIST
// ======================
const whitelistOldTable = [
  'sparing01', 'sparing02', 'sparing03', 'sparing04', 'sparing05',
  'sparing06', 'sparing07', 'sparing08', 'sparing09', 'sparing10', 'sparing11',
];

const whitelistNewTable = ['sparing12', 'sparing13'];

// ======================
// MAIN FUNCTION
// ======================
async function add(req) {
  try {
    const input = req.body;

    // VALIDASI TABLE
    if (
      !whitelistOldTable.includes(input.ids) && !whitelistNewTable.includes(input.ids)
    ) {
      return {
        status: 400,
        message: 'TABLE NAME NOT VALID',
      };
    }

    const isOld = whitelistOldTable.includes(input.ids);

    // AMBIL MODEL (CACHE)
    const Model = isOld
      ? getOldModel(input.ids)
      : getNewModel(input.ids);

    // ======================
    // FORMAT DATA
    // ======================
    let formattedBody;

    if (isOld) {
      const {
        rs_stat,
        feedback,
        createdAt,
        diff_debit_old,
        diff_debit_adjust,
        ids,
        ...rest
      } = input;

      formattedBody = {
        ...rest,
        id_device: ids,
        debit2: diff_debit_adjust,
        umpanbalik: feedback,
        time: createdAt,
      };
    } else {
      const {
        rs_stat,
        feedback,
        createdAt,
        diff_debit_old,
        diff_debit_adjust,
        ...rest
      } = input;

      formattedBody = {
        ...rest,
        debit2: diff_debit_old,
        debitAdjust: diff_debit_adjust,
        umpanbalik: feedback,
        time: createdAt,
      };
    }

    // ======================
    // DEVICE UPDATE
    // ======================
    const inputDevice = {
      id_device: input.ids,
      last_update: input.createdAt,
      cod: input.cod,
      tss: input.tss,
      ph: input.ph,
      debit: input.debit,
      debit2: input.diff_debit_adjust,
      umpanbalik: input.feedback,
    };

    const existingDate = await Model.findOne({
      where: {
        time: input.createdAt,
      },
    });

    if (existingDate) {
      return {
        status: 409,
        message: 'ADD DATA FAILED: EXISTING DATE',
      };
    }

    // ======================
    // PARALLEL EXECUTION
    // ======================
    const [result] = await Promise.all([
      Model.upsert(formattedBody), // insert/update tanpa findOne
      Device.update(inputDevice, {
        where: { id_device: input.ids },
      }),
    ]);

    return {
      status: 200,
      data: result,
    };
  } catch (error) {
    console.error('ADD ERROR:', error);
    return {
      status: 500,
      message: 'INTERNAL SERVER ERROR',
      error: error.message,
    };
  }
}

/* async function add(req) {
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
      const existingDate = await DynamicOldModel.findOne({
        where: {
          time: createdAt,
        },
      });

      if (existingDate) {
        return {
          status: 409,
          message: 'ADD DATA FAILED: EXISTING DATE',
        };
      }
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
      await DynamicNewModel.sync();

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
      const existingDate = await DynamicNewModel.findOne({
        where: {
          time: createdAt,
        },
      });

      if (existingDate) {
        return {
          status: 409,
          message: 'ADD DATA FAILED: EXISTING DATE',
        };
      }
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
} */

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
    // const whitelistOldTable = ['sparing01', 'sparing02', 'sparing03', 'sparing04', 'sparing05',
    // 'sparing06', 'sparing07', 'sparing08', 'sparing09', 'sparing10', 'sparing11'];
    // const whitelistNewTable = ['sparing12', 'sparing13'];
    console.log(unixtime);
    if (!whitelistOldTable.includes(body.ids)
      && !whitelistNewTable.includes(body.ids)) {
      return {
        status: 400,
        message: 'TABLE NAME NOT VALID',
      };
    }

    if (whitelistOldTable.includes(body.ids)) {
      const DynamicOldModel = defineDynamicOldModel(body.ids);
      await DynamicOldModel.sync();

      const updatedData = await DynamicOldModel.findOne({
        where: { unixtime },
      });

      console.log(body);

      updatedData.umpanbalik = body.feedback;

      updatedData.save();
    } else {
      const DynamicNewModel = defineDynamicNewModel(body.ids);
      await DynamicNewModel.sync();

      const updatedData = await DynamicNewModel.findOne({
        where: { unixtime },
      });

      console.log(body);
      if (body.status) {
        updatedData.status_1h = body.status;
      }
      updatedData.umpanbalik = body.feedback;

      updatedData.save();
    }

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
