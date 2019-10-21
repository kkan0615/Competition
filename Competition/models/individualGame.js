/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Table name: individualRound
 * Purpose: Tourament Database
 * Element:
            individualRound - 1:N with individualRound table, round number
            number - Number in round 라운드에서의 번호
            firstPlayer - 1:N with user table
            firstPoint -
            secondPlayer - 1:N with user table
            secondPoint -
            winner - 1:N with user table
 * Last Update: 10/20/2019
 * Version: 1.0
*****************************************************************************************************/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('individualGame', {
        number: {
            type: DataTypes.INTEGER(),
            allowNull: false,
        },
        firstPoint: {
            type: DataTypes.INTEGER(),
            allowNull: false,
        },
        secondPoint: {
            type: DataTypes.INTEGER(),
            allowNull: false,
        },
    }, {
        timestamps: true, // Create Time Stamps
        paranoid: true, // Create id
        charset:'utf8', // 한글도 입력가능
        collate:'utf8_general_ci', // 한글도 입력가능
    })
);