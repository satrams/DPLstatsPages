const { Game, Week, Season } = require('./dbObject');

var args = process.argv.slice(2);

eval(args[0]).findAll().then( (tables) => {
  console.log(tables);
}).catch( (err) => {
  console.log(err);
});
