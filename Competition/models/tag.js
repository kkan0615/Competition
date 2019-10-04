/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Table name: tag
 * Purpose: Game Tag Database
 * Element:
            titile -
            img -
 * Last Update: 10/02/2019
 * Version: 1.0
*****************************************************************************************************/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('tag', {
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING(),
        }
    }, {
        timestamps: true, // Create Time Stamps
        paranoid: true, // Create id
        charset:'utf8', // 한글도 입력가능
        collate:'utf8_general_ci', // 한글도 입력가능
    })
);