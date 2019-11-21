export const CourseApply = (sequelize, DataTypes) => {
    return sequelize.define('course_apply', {
        applyIdx: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        courseIdx: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    })
}
