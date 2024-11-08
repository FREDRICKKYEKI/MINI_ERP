import { Model, DataTypes } from "sequelize";
import db from "../db";

interface SubscriptionAttributes {
  id?: string;
  transaction_id: string;
  start_date: string;
  expiry_date: string;
  status?: "active" | "expired";
}

class Subscription extends Model<SubscriptionAttributes> {}

Subscription.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "transactions",
        key: "id",
      },
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "expired"),
      defaultValue: "active",
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Subscription",
    tableName: "subscriptions",
    timestamps: false,
  }
);

export default Subscription;
