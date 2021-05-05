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

async function doStuff(Game, Week, Season) {

	var sMaxId;

	const sMax = await Season.findAll({
		attributes: [[fn('max', col('id')), 'id']],
		raw: true,
	});

	sMaxId = sMax[0]['id'] ?? -1;


	const wMax = await Week.findAll({
		attributes: [[fn('max', col('id')), 'id']],
		raw: true,
	});

	const wMaxId = wMax[0]['id'] ?? -1;

	const gMax = await Game.findAll({
		attributes: [[fn('max', col('id')), 'id']],
		raw: true,
	});

	const gMaxId = gMax[0]['id'] ?? -1;


	const e = await Game.findAll({
		attributes: [[fn('max', col('id')), 'id']],
		raw: true,
	});

	console.log(e);

	console.log(sMax);
	console.log(sMax[0]['id']);

	console.log(sMaxId);
	console.log(getMethods(sMax));
	console.log("eeeeeeeeeeeeeeee");

	season1 = await Season.create({ id: parseInt(sMaxId)+1, name: "season1" }).catch( error => {console.log(error)});
	week1 = await Week.create({ id: parseInt(wMaxId)+1, name: "week11" }).catch( error => {console.log(error)});
	game1 = await Game.create({ id: parseInt(gMaxId)+1, name: "game11" }).catch( error => {console.log(error)});

	console.log(Object.keys(game1.rawAttributes));

	console.log(getMethods(week1));

	game1.setWeek(week1)
	game1.setSeason(season1).then((value) => {
		console.log(game1);
	});

}

doStuff(Game, Week, Season);

module.exports = { Game, Week, Season };
