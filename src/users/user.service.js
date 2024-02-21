const { Op, QueryTypes } = require("sequelize");
const { user, connexion } = require("../config/database.conf");
const AccountService = require("../accounts/account.service");

const UserService = {};

UserService.findAll = async (value) => {
  let condition = {};
  if (value) {
    condition = {
      [Op.or]: {
        fullname: value,
        phone: value,
      },
    };
  }
  let res = await user.findAll({ where: condition });
  return res;
};

UserService.findOne = async (value) => {
  if (!value) {
    return {};
  }
  let data = await connexion.query(
    `SELECT users.* FROM users WHERE users.id='${value}'`,
    { type: QueryTypes.SELECT }
  );
  // console.log(data);
  // await clients.findAll(value != null ? { where: condition } : {});
  try {
    if (!data) {
      return null;
    }
    return data[0];
  } catch (error) {
    return null;
  }
};

UserService.login = async (data) => {
  let response = await connexion.query(
    `SELECT users.* FROM users WHERE (username='${data.username}' OR phone='${data.username}') AND password='${data.password}' AND users.active=1`,
    { type: QueryTypes.SELECT }
  );
  if (response) {
    if (response.length == 1) {
      let accounts = await AccountService.findAll(response[0].id);
      let user = {
        ...response[0],
        accounts: accounts ?? [],
      };
      return { status: 200, data: user, message: "User exists" };
    }
    return {
      status: 401,
      data: {},
      message: "Username ou mot de passe incorrect",
    };
  }
  return { status: 403, data: {}, message: "Aucune correspondance" };
};

UserService.create = async (data) => {
  if (
    !data.fullname ||
    !data.username ||
    !data.password ||
    !data.level ||
    !data.phone
  ) {
    return { status: 403, data: {}, message: "Invalid data submitted" };
  }
  let checkUser = await user.findAll({
    where: { [Op.or]: { username: data.username, phone: data.phone } },
  });
  if (checkUser && checkUser.length > 0) {
    return {
      status: 401,
      data: {},
      message: "The email or phone number is already used",
    };
  }
  let userData = {
    fullname: data.fullname,
    phone: data.phone,
    username: data.username,
    password: data.password,
    level: data.level,
    active: data.active,
  };
  try {
    let response = await user.create(userData);
    AccountService.create({ user_id: response.id });
    return { status: 200, data: response, message: "Success" };
  } catch (error) {
    return {
      status: 400,
      data: {},
      message: "Error occured while processing data",
    };
  }
};

UserService.update = async (data, id) => {
  if (!id) {
    return {
      status: 404,
      data: {},
      message: "Unable to find the requested data",
    };
  }
  if (
    !data.fullname ||
    !data.username ||
    !data.password ||
    !data.level ||
    !data.phone
  ) {
    return { status: 403, data: {}, message: "Invalid data submitted" };
  }
  let checkUser = await user.findAll({
    where: {
      [Op.or]: { username: data.username, phone: data.phone },
      [Op.and]: { id: { [Op.ne]: id } },
    },
  });
  if (checkUser.length > 0) {
    return {
      status: 401,
      data: {},
      message: "The email or phone number is already used",
    };
  }
  let user = {
    fullname: data.fullname,
    phone: data.phone,
    username: data.username,
    // password: data.password,
    level: data.level,
    active: data.active,
    division_id: data.division_id,
    radius_group_uuid: data.radius_group_uuid,
  };
  try {
    let response = await user.update(user, { where: { id: id } });
    let account = await accounts.update(
      { active: data.active },
      { where: { user_id: id } }
    );
    return { status: 200, data: response, message: "Success" };
  } catch (error) {
    return {
      status: 400,
      data: {},
      message: "Error occured while processing data",
    };
  }
};

UserService.updatePassword = async (data, id) => {
  if (!id) {
    return {
      status: 404,
      data: {},
      message: "Unable to find the requested data",
    };
  }
  if (!data.oldPassword || !data.newPassword) {
    return { status: 403, data: {}, message: "Invalid data submitted" };
  }
  if (data.oldPassword == data.newPassword) {
    return {
      status: 403,
      data: {},
      message: "Choisissez un mot de passe différent de l'ancien mot de passe",
    };
  }
  try {
    let response = await user.update(
      { password: data.newPassword },
      { where: { id: id } }
    );
    return { status: 200, data: response, message: "Success" };
  } catch (error) {
    return {
      status: 400,
      data: {},
      message: "Error occured while processing data",
    };
  }
};

module.exports = UserService;
