module.exports = (sequelize, Sequelize) => {
  const clientModel = sequelize.define("clients", {
    uuid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    maritalStatus: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    nationality: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    drivingLicenceNumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    active: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    syncStatus: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });
  return clientModel;
};
