const Adjustment = require('../model/Adjustment');

async function getAll(req) {
  try {
    const {
      type, sensor_name, status, operation, id_device,
    } = req.query;

    const query = {
      where: {},
      order: [
        ['position', 'asc'],
      ],
    };

    if (type) query.where.type = type;
    if (sensor_name) query.where.sensor_name = sensor_name;
    if (status) query.where.status = status;
    if (operation) query.where.operation = operation;
    if (id_device) query.where.id_device = id_device;

    const result = await Adjustment.findAll(query);

    return {
      status: 200,
      message: 'GET ALL ADJUSMENT CONFIG SUCCESS',
      data: result,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

async function add(body, query) {
  try {
    const { id_device } = query;

    const existingData = await Adjustment.findOne({
      where: {
        id_device,
      },
      order: [
        ['position', 'desc'],
      ],
    });

    let position;
    if (!existingData) {
      position = 1;
    } else {
      position = existingData.position + 1;
    }

    if (body.new_value && body.new_value.toString().includes(',')) {
      body.new_value = body.new_value.toString().replaceAll(',', '.');
    }
    if (body.offset && body.offset.toString().includes(',')) {
      body.offset = body.offset.toString().replaceAll(',', '.');
    }
    if (body.condition && body.condition.includes(',')) {
      body.condition = body.condition.replaceAll(',', '.');
    }

    console.log(body);

    const result = await Adjustment.create({
      ...body,
      id_device,
      position,
    });

    return {
      status: 201,
      message: 'ADD NEW ADJUSMENT SUCCESS',
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      error: error.message,
    };
  }
}

async function update(body, id) {
  try {
    if (body.new_value && body.new_value.toString().includes(',')) {
      body.new_value = body.new_value.toString().replaceAll(',', '.');
    }
    if (body.offset && body.offset.toString().includes(',')) {
      body.offset = body.offset.toString().replaceAll(',', '.');
    }
    if (body.condition && body.condition.includes(',')) {
      body.condition = body.condition.replaceAll(',', '.');
    }
    console.log(body);

    const [updatedRows] = await Adjustment.update(body, {
      where: { id },
    });

    if (updatedRows === 0) {
      throw new Error(`Failed to update Adjustment with ID ${id}. No record found or no changes were made.`);
    }

    const updatedData = await Adjustment.findByPk(id);

    return {
      status: 200,
      message: 'UPDATE ADJUSTMENT SUCCESS',
      data: updatedData,
    };
  } catch (error) {
    console.error('Error updating Adjustment:', error);

    return {
      status: 500,
      message: error.message || 'Internal Server Error',
    };
  }
}

async function remove(id) {
  try {
    const result = await Adjustment.destroy({ where: { id } });
    if (result) {
      return {
        status: 200,
        message: 'DELETE ADJUSMENT DATA SUCCESS',
      };
    }

    throw new Error(`Failed To Delete Adjusment Data with Id ${id}`);
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: error.message,
    };
  }
}

module.exports = {
  getAll,
  add,
  update,
  remove,
};
