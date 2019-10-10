/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Table name: game,
 * Element:
 *          participantId - 1:N with user table
 *          Point - swith game Point! It's not big deal for tournament
 *
 * Last Update: 10/03/2019
 * Version: 1.0
*****************************************************************************************************/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('participant', {
        point: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        option: {
            type: DataTypes.STRING(),
        },
        optionTwo: {
            type: DataTypes.STRING(),
        }
    }, {
        timestamps: true, // Create Time Stamps
        paranoid: true, // Create id
        charset:'utf8', // 한글도 입력가능
        collate:'utf8_general_ci', // 한글도 입력가능
    })
);