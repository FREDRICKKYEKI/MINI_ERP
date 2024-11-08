/**
 * @description Database model for User Roles
 */
import { DataTypes, Model } from "sequelize";
import pkg_db from "../db";

const db = pkg_db;
class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    modelName: "Role",
    tableName: "roles",
    timestamps: false, // Disables Sequelize's automatic `createdAt` and `updatedAt`
  }
);

export default Role;
