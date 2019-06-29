'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    'Course',
    {
      userId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      estimatedTime: DataTypes.STRING,
      materialsNeeded: DataTypes.STRING,
    },
    {}
  );
  Course.associate = models => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreginKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };
  return Course;
};
