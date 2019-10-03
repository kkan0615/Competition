/****************************************************************************************************
 * Authour: Youngjin Kwak(곽영진)
 * Element:
 *          email
 *          nickname - User's nickaname
 *          password
 *          isAdmin
 *          isValid
 *          point - User can buy many things from shop
 *          winnings - How many times user have won
 *          provider - SNS Login
 *          snsId
 *          img - Main profile image
 * Last Update: 10/02/2019
 * Version: 1.0
*****************************************************************************************************/
module.exports = (sequelize, DataTypes) => (
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        nickname: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN(),
            defaultValue: true, // 바꿔주세요 TO FALSE
        },
        isValid: {
            type: DataTypes.BOOLEAN(),
            defaultValue: true, // 바꿔주세요 TO FALSE
        },
        point: {
            type: DataTypes.INTEGER(),
            defaultValue: 100,
        },
        winnings: {
            type: DataTypes.INTEGER(),
            defaultValue: 0,
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        snsId: {
            type: DataTypes.STRING(50),
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    }, {
        timestamps: true, // Create Time Stamps
        paranoid: true, // Create id
        charset:'utf8', // 한글도 입력가능
        collate:'utf8_general_ci', // 한글도 입력가능
    })
);