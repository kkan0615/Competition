require('dotenv').config();

module.exports = {
    development: {
      username: 'root',
      password: process.env.SEQUELIZE_PASSWORD_DEV,
      database: 'competition',
      host: '127.0.0.1',
      dialect: 'mysql',
      operatorsAliases: 'false'
    },
    test: {
      username: 'root',
      password: process.env.SEQUELIZE_PASSWORD,
      database: 'competition',
      host: '127.0.0.1',
      dialect: 'mysql'
    },
    production: {
      username: process.env.SEQUELIZE_USERNAME,
      password: process.env.SEQUELIZE_PASSWORD,
      database: 'competition',
      host: process.env.SEQUELIZE_HOST,
      dialect: 'mysql',
      operatorsAliases: 'false',
      logging: false,
    }
}
