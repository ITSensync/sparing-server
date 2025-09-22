const express = require('express');

const waterQuality = require('./waterQuality');
const telegram = require('./telegram');
const user = require('./user');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - SPARING SERVER',
  });
});

router.use('/water-quality', waterQuality);
router.use('/telegram', telegram);
router.use('/auth', user);

module.exports = router;
