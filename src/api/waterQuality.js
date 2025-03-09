const express = require('express');
const waterQualityController = require('../controller/waterQuality.controller');

const router = express.Router();

router.get('/', waterQualityController.getAllData);
router.post('/', waterQualityController.addData);
router.patch('/:unixtime', waterQualityController.updateData);
router.post('/test/water-level', waterQualityController.addWaterLevelData);

module.exports = router;
