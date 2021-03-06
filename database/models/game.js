module.exports = (sequelize, DataTypes) => {
	return sequelize.define('game', {
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
		tableName: 'game',
		freezeTableName: true,
		name: {
			singular: "game",
			plural: "games",
		}
	});
};
