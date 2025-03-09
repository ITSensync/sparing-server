const { WaterLevel } = require('../model/WaterLevel');

async function getWaterLevel() {
  try {
    const result = await WaterLevel.findAll({
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

async function addWaterLevel(body) {
  try {
    console.log(body);
    const result = await WaterLevel.create(body);
    return {
      status: 200,
      data: result,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

module.exports = {
  getWaterLevel,
  addWaterLevel,
};
