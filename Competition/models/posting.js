/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Table name: news
 * Purpose: news about game.
 * Element:
        gameId - 1:N with Game table
        userId - 1:N with User table
        content - 내용이 안에 들어감
 * Last Update: 11/02/2019
 * Version: 1.0
*****************************************************************************************************/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('post', {
        content: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
    }, {
        //timestamps: true, // Create Time Stamps
        paranoid: true, // Create id
        charset:'utf8', // 한글도 입력가능
        collate:'utf8_general_ci', // 한글도 입력가능
    })
);