const waterLevelService = require('../services/waterLevel.service');

async function getWaterLevelData(req, res) {
  const result = await waterLevelService.getWaterLevel();
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
