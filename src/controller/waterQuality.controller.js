const waterQualityServcice = require('../services/waterQuality.service');

async function addData(req, res) {
  const result = await waterQualityServcice.add(req);
  res.status(result.status).send(result);
}

async function addWaterLevelData(req, res) {
  const result = await waterQualityServcice.addWaterLevel(req);
  res.status(result.status).send(result);
}

async function updateData(req, res) {
  const result = await waterQualityServcice.update(req.body, req.params.unixtime);
  res.status(result.status).send(result);
}

async function getAllData(req, res) {
  const result = await waterQualityServcice.get(req);
  res.status(result.status).send(result);
}

async function getLatestData(req, res) {
  const result = await waterQualityServcice.getLatest();
  res.status(result.status).send(result);
}

module.exports = {
  addData,
  addWaterLevelData,
  getAllData,
  getLatestData,
  updateData,
};
