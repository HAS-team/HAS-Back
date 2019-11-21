export const UserInfo = (sequelize, DataTypes) => {
    return sequelize.define('user_info', {
        email: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: false
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
