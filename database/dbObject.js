const Sequelize = require('sequelize');
const { fn } = require('sequelize');
const { col } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: '../database.sqlite',
});

const Game = require('./models/game')(sequelize, Sequelize.DataTypes);
const Week = require('./models/week')(sequelize, Sequelize.DataTypes);
const Season = require('./models/season')(sequelize, Sequelize.DataTypes);

Week.hasMany(Game),
Season.hasMany(Week),
Game.belongsTo(Week),
Game.belongsTo(Season),
Week.belongsTo(Season);


const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

module.exports = { Game, Week, Season };
