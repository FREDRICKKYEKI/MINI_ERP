/**
 * @description Contribution model
CREATE TABLE IF NOT EXISTS contributions (
    id TEXT PRIMARY KEY NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    purpose VARCHAR(255),
    user_id TEXT NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
 */
import { DataTypes, Model } from "sequelize";
import db from "../db";

interface ContributionAttributes {
  id?: string;
  transaction_id: string;
  purpose: string;
  user_id: string;
}

class Contribution extends Model<ContributionAttributes> {}

Contribution.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    purpose: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "contribution",
    tableName: "contributions",
    timestamps: false,
  }
);

export default Contribution;
