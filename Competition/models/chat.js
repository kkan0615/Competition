/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Table name: game,
 * Element:
 *          manager - 1:N with user table
 *          title -
 *          img -
 *          open -
 *          isOnline -
 *          description -
 *          max - Maximum User can paricipate
 *          participateDate -
 *          rules -
 *          option -
 *          optionTwo -
 * Last Update: 10/03/2019
 * Version: 1.0
*****************************************************************************************************/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('chat', {
        img: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        content: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
    }, {
        paranoid: true, // Create id
        charset:'utf8', // 한글도 입력가능
        collate:'utf8_general_ci', // 한글도 입력가능
    })
);