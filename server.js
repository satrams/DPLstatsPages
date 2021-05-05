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

app.get('/DPLAnimationSelector.html', function (req, res) {
   res.sendFile( __dirname + "/" + "DPLAnimationSelector.html" );
})

async function createGame(req) {

	console.log("doing this");
	var s,w,g;

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


	s = await Season.findOne({ where: { name: `season${req.body.season}`}}) ?? await Season.create( { id: `${parseInt(sMaxId)+1}`, name: `season${req.body.season}`} );
	w = await s.getWeeks({ where: { name: `week${req.body.week}`}})[0] ?? await Week.create( { id: `${parseInt(wMaxId)+1}`, name: `week${req.body.week}`});
	w.setSeason(s);
	g = await Game.create( {id: `${parseInt(gMaxId)+1}`, name: `game${req.body.game}`});
	g.setWeek(w);
	g.setSeason(s);
	return g;
	/*Season.findOne({ where: { name: `season${req.body.season}` } }).then((s) => {
		console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
		console.log(s);
		if (s == null) {
			console.log("e");
			s = Season.create( { id: parseInt(sMaxId)+1, name: `season${req.body.season}` } );
		}
		else {
			console.log(s);
			console.log("aaaaaa");
			w = s.getWeek({ where: { name: `week${req.body.week}` }}).then( (w) => {

				console.log("bbbbbbb")
				if (w == null) {
					w = Week.create( { id: parseInt(wMaxId)+1, name: `week${req.body.week}` } ).catch((err) => {
						console.log(err);
					});
					w.setSeason(s);
				}
				return Game.create( { id: parseInt(gMaxId)+1, name: `game${req.body.game}`} ).then((tempg) => {
					tempg.setSeason(s);
					tempg.setWeek(w);

					console.log(tempg);
					g = tempg;
		}

			});
		});
	});
	*/
	return g;
}


app.post('/statsupload', async function (req, res) {



	console.log(req.body.season);

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
		res.send('enountered error: ' + err);
	}

})

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8081, "127.0.0.1", function () {
   var host = server.address().address
   var port = server.address().port


   console.log("Example app listening at http://%s:%s", host, port)
})
