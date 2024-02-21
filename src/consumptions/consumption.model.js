module.exports = (connection, Sequelize) => {
  const ConsumptionModel = connection.define("consumptions", {
    uuid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    driver_uuid: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_uuid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    quantity: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fuel_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    consumption_date: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    syncStatus: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
  });
  return ConsumptionModel;
};
