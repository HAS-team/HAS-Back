export const UserInfo = (sequelize, DataTypes) => {
    return sequelize.define('user_info', {
        userIdx: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        grade: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        class: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        no: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    })
}
