module.exports = (sequelize, DataTypes) => {
	return sequelize.define('week', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
    stats: {
      type: DataTypes.JSON,
    },
    colorstats: {
      type: DataTypes.JSON,
    },
	}, {
		timestamps: false,
		tableName: 'week',
		freezeTableName: true,
		name: {
			singular: "week",
			plural: "weeks",
		}
	});
};
