const express = require('express');
const adjustmentController = require('../controller/adjustment.controller');
const middleware = require('../middlewares/VerifyToken');

const router = express.Router();

router.get('/', middleware.verifyToken, adjustmentController.getAllAdjusment);
router.post('/', middleware.verifyToken, adjustmentController.createAdjusment);
router.patch('/:id', middleware.verifyToken, adjustmentController.updateAdjusment);
router.delete('/:id', middleware.verifyToken, adjustmentController.deleteAdjusment);

module.exports = router;
