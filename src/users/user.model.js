module.exports = (connection, Sequelize) => {
  let UserModel = connection.define("users", {
    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    level: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "guichetier",
    },
    affectation: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "Station",
    },
    active: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  });
  return UserModel;
};
