const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Game = require('./game')(sequelize, Sequelize);
db.Participant = require('./participant')(sequelize, Sequelize);
db.Tag = require('./tag')(sequelize, Sequelize);
db.Tournament = require('./tournament')(sequelize, Sequelize);
db.IndividualRound = require('./individualRound')(sequelize, Sequelize);

/* User 1:N game as Manager */
db.User.hasMany(db.Game, {as: 'manager'});
db.Game.belongsTo(db.User, {as: 'manager'});

/* User 1:N Participant */
db.User.hasMany(db.Participant);
db.Participant.belongsTo(db.User);

/* Game N:M Tag */
db.Game.belongsToMany(db.Tag, {through: 'gameTag'});
db.Tag.belongsToMany(db.Game, {through: 'gameTag'});

/* Game 1:N Tournament */
db.Game.hasMany(db.Tournament);
db.Tournament.belongsTo(db.Game);

/* Tournament 1:N individualRound */
db.Tournament.hasMany(db.IndividualRound);
db.IndividualRound.belongsTo(db.Tournament);

/* Tournament 1:N TeamRound */

/* Tournament 1:N swithRound */

/* Game 1:N Participant */
db.Game.hasMany(db.Participant);
db.Participant.belongsTo(db.Game);

/* Participant 1:N IndividualRound */
db.Participant.hasMany(db.IndividualRound, {as: 'firstPlayer'});
db.IndividualRound.belongsTo(db.Participant, {as: 'firstPlayer'});
db.Participant.hasMany(db.IndividualRound, {as: 'secondPlayer'});
db.IndividualRound.belongsTo(db.Participant, {as: 'secondPlayer'});

module.exports = db;