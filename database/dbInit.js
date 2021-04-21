const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: '../database.sqlite',
});

const Game = require('./models/game')(sequelize, Sequelize.DataTypes);
const Week = require('./models/week')(sequelize, Sequelize.DataTypes);
const Season = require('./models/season')(sequelize, Sequelize.DataTypes);


const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force: true});

const stuff = [
	Week.hasMany(Game),
	Season.hasMany(Week),
	Game.belongsTo(Week),
	Week.belongsTo(Season),
	Game.belongsTo(Season),
]
Promise.all(stuff).then(() => {
	sequelize.sync();
})
