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
db.IndividualGame = require('./individualGame')(sequelize, Sequelize);
db.News = require('./news')(sequelize, Sequelize);
db.Chat = require('./chat')(sequelize, Sequelize);
db.Post = require('./posting')(sequelize, Sequelize);

/* User 1:N game as Manager */
db.User.hasMany(db.Game, {as: 'manager'});
db.Game.belongsTo(db.User, {as: 'manager'});

/* User 1:N Participant */
db.User.hasMany(db.Participant);
db.Participant.belongsTo(db.User);

/* Game N:M Tag */
db.Game.belongsToMany(db.Tag, {through: 'gameTag'});
db.Tag.belongsToMany(db.Game, {through: 'gameTag'});

/* Game 1:N IndividualRound */
db.Game.hasMany(db.IndividualRound);
db.IndividualRound.belongsTo(db.Game);

/* IndividualRound 1:N IndividualGame */
db.IndividualRound.hasMany(db.IndividualGame);
db.IndividualGame.belongsTo(db.IndividualRound);

/* Tournament 1:N TeamRound */

/* Tournament 1:N swithRound */

/* Game 1:N Participant */
db.Game.hasMany(db.Participant);
db.Participant.belongsTo(db.Game);

/* Participant 1:N IndividualRound */
db.Participant.hasMany(db.IndividualGame, {as: 'firstPlayer'});
db.IndividualGame.belongsTo(db.Participant, {as: 'firstPlayer'});
db.Participant.hasMany(db.IndividualGame, {as: 'secondPlayer'});
db.IndividualGame.belongsTo(db.Participant, {as: 'secondPlayer'});

/* User 1:N Chat */
db.User.hasMany(db.Chat);
db.Chat.belongsTo(db.User);

/* Game 1:N Chat */
db.Game.hasMany(db.Chat);
db.Chat.belongsTo(db.Game);

/* IndividualRound 1:N Chat */
db.IndividualRound.hasMany(db.Chat);
db.Chat.belongsTo(db.IndividualRound);

/* IndividualGame 1:N Chat */
db.IndividualGame.hasMany(db.Chat);
db.Chat.belongsTo(db.IndividualGame);

/* game 1 : N News - 게임은 많은 뉴스를 가질 수 있다 */
db.Game.hasMany(db.News);
db.News.belongsTo(db.Game);

/* game 1 : N News - 게임은 많은 뉴스를 가질 수 있다 */
db.Game.hasMany(db.Post);
db.Post.belongsTo(db.Game);

/* game 1 : N News - 게임은 많은 뉴스를 가질 수 있다 */
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

module.exports = db;