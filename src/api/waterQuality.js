const express = require('express');
const waterQualityController = require('../controller/waterQuality.controller');
const waterLevelController = require('../controller/waterLevel.controller');

const router = express.Router();

router.get('/', waterQualityController.getAllData);
router.post('/', waterQualityController.addData);
router.patch('/:unixtime', waterQualityController.updateData);

router.post('/test/water-level', waterLevelController.addWaterLevelData);
router.get('/test/water-level', waterLevelController.getWaterLevelData);

module.exports = router;
