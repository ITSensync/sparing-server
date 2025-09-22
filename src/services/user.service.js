/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-throw-literal */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../model/User');

async function login(body) {
  try {
    const SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;

    const { username, password } = body;
    const existedUser = await User.findOne({
      where: {
        username,
      },
    });

    if (!existedUser) {
      throw {
        status: 400,
        message: 'Invalid credentials',
      };
    }

    const hashedPassword = await crypto.createHash('md5').update(password).digest('hex');
    const comparePass = hashedPassword === existedUser.password;

    if (!comparePass) {
      throw {
        status: 400,
        message: ' Invalid crdentials',
      };
    }

    const token = jwt.sign({ id: existedUser.id, username: existedUser.username }, SECRET_TOKEN, { expiresIn: '1h' });

    existedUser.accessToken = token;
    existedUser.save();

    return {
      status: 200,
      access_token: token,
      id_device: existedUser.id_device,
      expires_in: '1h',
    };
  } catch (error) {
    console.log(error);
    return {
      status: error.status || 500,
      message: error.message,
    };
  }
}

module.exports = {
  login,
};
