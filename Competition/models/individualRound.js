/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Table name: individualRound
 * Purpose: Tourament Database
 * Element:
            gameId - 1:N with Game table
 * Last Update: 10/20/2019
 * Version: 1.0
*****************************************************************************************************/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('individualRound', {
        number: {
            type: DataTypes.INTEGER(),
            allowNull: false,

        }
    }, {
        timestamps: true, // Create Time Stamps
        paranoid: true, // Create id
        charset:'utf8', // 한글도 입력가능
        collate:'utf8_general_ci', // 한글도 입력가능
    })
);