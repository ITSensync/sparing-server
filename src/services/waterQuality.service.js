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
        ['createdAt', 'asc'],
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
    const requestBody = req.body;

    const result = await WaterQuality.create(requestBody.input);

    if (!result) {
      return {
        status: 500,
        message: 'ERROR ADD SENSOR DATA',
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
