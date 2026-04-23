const { WaterLevel } = require('../model/WaterLevel');

async function getWaterLevel(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await WaterLevel.findAndCountAll({
      offset,
      limit,
      order: [
        ['time', 'desc'],
      ],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      status: 200,
      data: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
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
