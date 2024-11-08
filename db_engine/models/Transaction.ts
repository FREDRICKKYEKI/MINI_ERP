import { Model, DataTypes } from "sequelize";
import pkg_db from "../db";

const db = pkg_db;

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.ENUM("subscription", "contribution"),
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
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
    modelName: "Transaction",
    tableName: "transactions",
    timestamps: false,
  }
);

export default Transaction;
