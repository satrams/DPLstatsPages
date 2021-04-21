module.exports = (sequelize, DataTypes) => {
	return sequelize.define('season', {
		id: {
			type: DataTypes.STRING,
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
		tableName: 'season',
		freezeTableName: true,
		name: {
			singular: "season",
			plural: "seasons",
		}
	});
};
