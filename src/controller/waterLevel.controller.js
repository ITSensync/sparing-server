const waterLevelService = require('../services/waterLevel.service');

async function getWaterLevelData(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await waterLevelService.getWaterLevel(page, limit);
  res.status(result.status).send(result);
}

async function addWaterLevelData(req, res) {
  const result = await waterLevelService.addWaterLevel(req.body);
  res.status(result.status).send(result);
}

module.exports = {
  getWaterLevelData,
  addWaterLevelData,
};
