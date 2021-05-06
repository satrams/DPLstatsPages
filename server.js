var express = require('express'), bodyParser = require('body-parser');
var app = express();

const Sequelize = require('sequelize');

const { fn, col } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Game = require('./database/models/game')(sequelize, Sequelize.DataTypes);
const Week = require('./database/models/week')(sequelize, Sequelize.DataTypes);
const Season = require('./database/models/season')(sequelize, Sequelize.DataTypes);

Week.hasMany(Game),
Season.hasMany(Week),
Game.belongsTo(Week),
Game.belongsTo(Season),
Week.belongsTo(Season);

app.use(express.static('Assets'));
app.use(bodyParser.json());
// Set EJS as templating engine
app.set('view engine', 'ejs');

app.get('/makestats', function (req, res) {
   res.sendFile( __dirname + "/" + "DPLAnimationSelector.html" );
})

async function createGame(req) {

	var s,w,g;

	const sMaxId = await Season.max('id') || 0;

	const wMaxId = await Week.max('id') || 0;

	const gMaxId = await Game.max('id') || 0;


	s = await Season.findOne({ where: { name: `season${req.body.season}`}}) ?? await Season.create( { id: sMaxId+1, name: `season${req.body.season}`} );
	w = await s.getWeeks({ where: { name: `week${req.body.week}`}})[0] ?? await Week.create( { id: wMaxId+1, name: `week${req.body.week}`});
	w.setSeason(s);
	g = await Game.create( {id: `${parseInt(gMaxId)+1}`, name: `game${req.body.game}`});
	g.setWeek(w);
	g.setSeason(s);
	return g;

}


app.post('/statsupload', async function (req, res) {

	try {
		if (req.body.season == "" || req.body.week == "" || req.body.game == "") {throw "one of your things doesn't have a value:("};

	  g = await Game.findOne({ where: { name: `game${req.body.game}`},
			include: [{
				model: Week,
				as: 'week',
				where: { name: `week${req.body.week}`}
			},
			{
				model: Season,
				as: 'season',
				where: { name: `season${req.body.season}`}
			}]
		 }
	 ) ?? await createGame(req); //wacky thing that basically searches for the game you're looking for using the 'include' parameter to reference the values of associated models

		g.colorstats = req.body.colorstats;
		g.save();

		res.send('success, stats updated');
	}
	catch (err) {
		console.log(err);
		res.send('enountered error: ' + err);
	}
});

app.get('/streamstats', async function (req, res) {

	if (req.query.season == null || req.query.week == null || req.query.game == null) {return res.send("one of your things doesn't have a value:(")};

	g = await Game.findOne({ where: { name: `game${req.query.game}`},
		include: [{
			model: Week,
			as: 'week',
			where: { name: `week${req.query.week}`}
		},
		{
			model: Season,
			as: 'season',
			where: { name: `season${req.query.season}`}
		}]
	 }
 );

 if (g == null) {
	 return res.send("could not find game")
 }

	res.render("streamanimation", {colorstats: g.colorstats});
});

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8081, "127.0.0.1", function () {
   var host = server.address().address
   var port = server.address().port


   console.log("Example app listening at http://%s:%s", host, port)
})
