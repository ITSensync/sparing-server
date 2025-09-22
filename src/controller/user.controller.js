const userService = require('../services/user.service');

async function login(req, res) {
  const result = await userService.login(req.body);
  res.status(result.status).send(result);
}

module.exports = {
  login,
};
