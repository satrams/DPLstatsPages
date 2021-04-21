module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
      primaryKey: true,
			unique: true,
		},
    password: {
      type: DataTypes.JSON,
    },
    perms: {
      type: DataTypes.JSON,
    },
	}, {
		timestamps: false,
		tableName: 'user',
		freezeTableName: true,
		name: {
			singular: "user",
			plural: "users",
		}
	});
};
