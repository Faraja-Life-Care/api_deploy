const Sequelize = require("sequelize");

const connexion = new Sequelize("flc_db", "root", "", {
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
  operatorsAliases: false,
  define: {
    underscored: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 1000,
  },
});

let database = {};
database.connexion = connexion;
database.user = require("../users/user.model")(database.connexion, Sequelize);
database.accounts = require("../accounts/account.model")(
  database.connexion,
  Sequelize
);
database.clients = require("../clients/client.model")(
  database.connexion,
  Sequelize
);
database.consumption = require("../consumptions/consumption.model")(
  database.connexion,
  Sequelize
);

module.exports = database;
