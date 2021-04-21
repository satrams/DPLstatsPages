var express = require('express'), bodyParser = require('body-parser');
var app = express();

const Sequelize = require('sequelize');

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

	Season.findOne({ where: { name: `season${req.body.season}` } }).then((s) => {
		console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
		console.log(s);
		if (s == null) {
			console.log("e");
			s = Season.create( { name: `season${req.body.season}` } );
		}

		console.log("aaaaaa");
		w = Week.findOne({ where: { name: `week${req.body.week}`, seasonName: `season${req.body.season}` }}).then( (w) => {

			console.log("bbbbbbb")
			if (w == null) {
				w = Week.create( { name: `week${req.body.week}` } ).catch((err) => {
					console.log(err);
				});
				w.setSeason(s);
			}
			return Game.create( { name: `game${req.body.game}`} ).then((tempg) => {
				tempg.setSeason(s);
				tempg.setWeek(w);

				g = tempg;
			});
		});
	});

	return g;
}


app.post('/statsupload', function (req, res) {

  res.send('success');
  Game.findOne({ where: { name: `game${req.body.game}`, weekName: `week${req.body.week}`, seasonName: `season${req.body.season}`}}).then((g) => {
		if (g == null) {
			g = createGame(req).then((g) => {
				g.colorstats = req.body.colorstats;
				console.log(g);
			});
		}
	});

})

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8081, "127.0.0.1", function () {
   var host = server.address().address
   var port = server.address().port


   console.log("Example app listening at http://%s:%s", host, port)
})
