const adjustmentService = require('../services/adjustment.service');

async function getAllAdjusment(req, res) {
  const response = await adjustmentService.getAll(req);
  res.status(response.status).send(response);
}

async function createAdjusment(req, res) {
  const response = await adjustmentService.add(req.body, req.query);
  res.status(response.status).send(response);
}

async function updateAdjusment(req, res) {
  const response = await adjustmentService.update(req.body, req.params.id);
  res.status(response.status).send(response);
}

async function deleteAdjusment(req, res) {
  const response = await adjustmentService.remove(req.params.id);
  res.status(response.status).send(response);
}

module.exports = {
  getAllAdjusment,
  createAdjusment,
  updateAdjusment,
  deleteAdjusment,
};
