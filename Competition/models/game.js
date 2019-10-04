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
    sequelize.define('game', {
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        isOnline: {
            type: DataTypes.BOOLEAN(),
            allowNull: false,
            defaultValue: true,
        },
        description: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        max: {
            type: DataTypes.INTEGER(),
            allowNull: false,
        },
        timeToDate: {
            type: DataTypes.DATE(),
            allowNull: false,
        },
        participateDate: {
            type: DataTypes.DATE(),
            allowNull: false,
        },
        rules: {
            type: DataTypes.STRING(),
            allowNull: true,
        },
        option: {
            type: DataTypes.STRING(),
            allowNull: true,
        },
        optionTwo: {
            type: DataTypes.STRING(),
            allowNull: true,
        }
    }, {
        timestamps: true, // Create Time Stamps
        paranoid: true, // Create id
        charset:'utf8', // 한글도 입력가능
        collate:'utf8_general_ci', // 한글도 입력가능
    })
);