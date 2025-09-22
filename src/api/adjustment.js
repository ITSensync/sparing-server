const express = require('express');
const adjustmentController = require('../controller/adjustment.controller');

const router = express.Router();

router.get('/', adjustmentController.getAllAdjusment);
router.post('/', adjustmentController.createAdjusment);
router.patch('/:id', adjustmentController.updateAdjusment);
router.delete('/:id', adjustmentController.deleteAdjusment);

module.exports = router;
