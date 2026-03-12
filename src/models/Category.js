import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';
class Category extends Model { }
Category.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    use_in_menu: {
        type: DataTypes.BOOLEAN,
         defaultValue: 0,
         allowNull:true
    }
},
    {
        sequelize,
        modelName: 'Category',
        tableName: 'category',
        timestamps: true,
        underscored: true
    }
)

export default Category