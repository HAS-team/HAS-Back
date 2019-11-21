export const CourseInfo = (sequelize, DataTypes) => {
    return sequelize.define('course_info', {
        courseIdx: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sort: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        target: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        studentSize: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lectTime: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        operTime: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        totalTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        openTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        closeTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    })
}
