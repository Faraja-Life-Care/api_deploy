const { Op } = require("sequelize");
const ClientService = require("../clients/client.service");
const { consumption } = require("../config/database.conf");
const { dateFormator } = require("../helpers/uuid_generator.helper");
const { uuidGenerator } = require("../helpers/uuid_generator.helper");
const UserService = require("../users/user.service");

const ConsumptionService = {};

ConsumptionService.findAll = async (value, params) => {
  let condition = {};
  if (value) {
    condition = {
      [Op.or]: {
        driver_uuid: value,
        user_uuid: value,
        consumption_date: value,
        fuel_type: value,
      },
    };
  }
  let res = await consumption.findAll({ where: condition });
  for (let index = 0; index < res.length; index++) {
    if (
      params?.populate?.toString().toLowerCase() == "all" ||
      params?.populate?.toString().toLowerCase() == "driver"
    ) {
      res[index].dataValues["driver"] = await ClientService.findOne(
        res[index].dataValues.driver_uuid
      );
    }
    if (
      params?.populate?.toString().toLowerCase() == "all" ||
      params?.populate?.toString().toLowerCase() == "user"
    ) {
      res[index].dataValues["user"] = await UserService.findOne(
        res[index].dataValues.user_uuid
      );
    }
  }
  return res;
};

ConsumptionService.create = async (data) => {
  if (!data.driver_uuid || !data.user_uuid || !data.fuel_type) {
    return { status: 403, data: null, message: "Invalid data submitted" };
  }
  data.consumption_date = data.consumption_date ?? dateFormator();

  let res = await consumption.create({
    uuid: data.uuid ?? uuidGenerator(),
    driver_uuid: data.driver_uuid,
    user_uuid: data.user_uuid,
    fuel_type: data.fuel_type,
    quantity: data.quantity,
    consumption_date: data.consumption_date,
  });
  return { status: 200, data: res, message: "Success" };
};

ConsumptionService.sync = async (data) => {
  let dataToSave = [];
  if (data.constructor !== Array) {
    return {
      status: 400,
      data: [],
      message: "Invalid data submitted, only arrays are supported",
    };
  }
  let hasErrors = false;
  for (let index = 0; index < data.length; index++) {
    let currentData = data[index];

    if (
      !currentData.driver_uuid ||
      !currentData.user_uuid ||
      !currentData.fuel_type
    ) {
      hasErrors = true;
    }
    currentData.uuid = currentData.uuid ?? uuidGenerator();
    let checkDuplication = await consumption.findAll({
      where: { [Op.or]: { uuid: currentData.uuid } },
    });
    if (checkDuplication.length > 0) {
      hasErrors = true;
      continue;
    }
    dataToSave.push({
      uuid: currentData.uuid,
      driver_uuid: currentData.driver_uuid,
      user_uuid: currentData.user_uuid,
      fuel_type: currentData.fuel_type,
      quantity: currentData.quantity,
      consumption_date: currentData.consumption_date ?? dateFormator(),
    });
  }
  if (hasErrors == true) {
    return {
      status: 400,
      data: [],
      message:
        "Certaines consommations existent deja et ne peuvent être enregistrées ou un mauvais formattage des données détecté",
    };
  }
  try {
    await consumption.bulkCreate(dataToSave);
    return { status: 200, data: [], message: "Data saved" };
  } catch (error) {
    console.log(error.message);
    return { status: 500, data: [], message: "Error occured" };
  }
};

module.exports = ConsumptionService;
