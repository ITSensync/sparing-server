const express = require('express');
const waterQualityController = require('../controller/waterQuality.controller');

const router = express.Router();

router.get('/', waterQualityController.getAllData);
router.post('/', waterQualityController.addData);
router.put('/:unixtime', waterQualityController.updateData);

module.exports = router;
