const { Op, QueryTypes } = require("sequelize");
const { clients, connexion } = require("../config/database.conf");
const { uuidGenerator } = require("../helpers/uuid_generator.helper");

const ClientService = {};

ClientService.findAll = async (value) => {
  let condition = {};
  if (value != null) {
    condition = { [Op.or]: { uuid: value, phone: value } };
  }
  let data = await connexion.query(`SELECT clients.* FROM clients`, {
    type: QueryTypes.SELECT,
  });

  // await clients.findAll(value != null ? { where: condition } : {});
  return data;
};

ClientService.findOne = async (value) => {
  if (!value) {
    return {};
  }
  let data = await connexion.query(
    `SELECT clients.* FROM clients WHERE clients.uuid='${value}'`,
    { type: QueryTypes.SELECT }
  );
  // console.log(data);
  // await clients.findAll(value != null ? { where: condition } : {});
  try {
    return data[0];
  } catch (error) {
    return null;
  }
};

ClientService.create = async (data) => {
  if (!data.fullname || !data.phone) {
    return { status: 400, data: [], message: "Invalid data submitted" };
  }
  let client = {
    uuid: data.uuid ?? uuidGenerator(),
    fullname: data.fullname,
    phone: data.phone,
    email: data.email,
    maritalStatus: data.maritalStatus,
    nationality: data.nationality,
    drivingLicenceNumber: data.drivingLicenceNumber,
    gender: data.gender,
    address: data.address,
    syncStatus: 1,
  };
  let checkDuplication = await clients.findAll({
    where: { [Op.or]: { fullname: data.fullname, phone: data.phone } },
  });
  if (checkDuplication.length > 0) {
    return {
      status: 400,
      data: [],
      message: "Ce nom ou numéro de téléphone existe dans le système",
    };
  }
  try {
    let savedData = await clients.create(client);
    return { status: 200, data: savedData, message: "Data saved" };
  } catch (error) {
    return {
      status: 400,
      data: [],
      message: "Error occured while saving data",
    };
  }
};

ClientService.update = async (data, uuid) => {
  if (!uuid) {
    return { status: 400, data: [], message: "Unable to find requested data" };
  }
  if (!data.fullname || !data.phone) {
    return { status: 400, data: [], message: "Invalid data submitted" };
  }
  let client = {
    fullname: data.fullname,
    phone: data.phone,
    email: data.email,
    maritalStatus: data.maritalStatus,
    nationality: data.nationality,
    drivingLicenceNumber: data.drivingLicenceNumber,
    gender: data.gender,
    address: data.address,
    syncStatus: data.syncStatus || 1,
  };
  let checkDuplication = await clients.findAll({
    where: {
      [Op.and]: {
        [Op.or]: { fullname: data.fullname, phone: data.phone },
        uuid: { [Op.ne]: uuid },
      },
    },
  });
  if (checkDuplication.length > 0) {
    return {
      status: 400,
      data: [],
      message: "Ce nom ou numéro de téléphone existe dans le système",
    };
  }
  try {
    let savedData = await clients.update(client, { where: { uuid: uuid } });
    return { status: 200, data: savedData, message: "Data saved" };
  } catch (error) {
    // console.log(error.message);
    return {
      status: 400,
      data: [],
      message: "Error occured while saving data",
    };
  }
};

ClientService.sync = async (data) => {
  let dataToSave = [];
  if (data.constructor !== Array) {
    return { status: 400, data: [], message: "Invalid data submitted" };
  }
  let hasErrors = false;
  for (let index = 0; index < data.length; index++) {
    let client = data[index];
    if (!client.fullname || !client.phone) {
      hasErrors = true;
    }
    let checkDuplication = await clients.findAll({
      where: { [Op.or]: { fullname: client.fullname, phone: client.phone } },
    });
    if (checkDuplication.length > 0) {
      hasErrors = true;
      continue;
    }
    dataToSave.push({
      uuid: client.uuid ?? uuidGenerator(),
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
      maritalStatus: data.maritalStatus,
      nationality: data.nationality,
      drivingLicenceNumber: data.drivingLicenceNumber,
      gender: data.gender,
      address: data.address,
      syncStatus: 1,
    });
  }
  if (hasErrors == true) {
    return {
      status: 400,
      data: [],
      message:
        "Certaines données des clients existent deja et ne peuvent être enregistrées",
    };
  }
  try {
    await clients.bulkCreate(dataToSave);
    return { status: 200, data: [], message: "Data saved" };
  } catch (error) {
    console.log(error.message);
    return { status: 500, data: [], message: "Error occured" };
  }
};

module.exports = ClientService;
