/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Table name: tag
 * Purpose: Tourament Database
 * Element:
            title -
            description -
 * Last Update: 10/03/2019
 * Version: 1.0
*****************************************************************************************************/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('tournament', {
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    }, {
        timestamps: true, // Create Time Stamps
        paranoid: true, // Create id
        charset:'utf8', // 한글도 입력가능
        collate:'utf8_general_ci', // 한글도 입력가능
    })
);