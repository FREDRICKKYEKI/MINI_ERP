/**
 * @description User model
 */
import { DataTypes, Model } from "sequelize";
import db from "../db";
import pkg_bcrypt from "bcrypt";
import pkg_jwt from "jsonwebtoken";
import pkg_sub from "./Subscription";
import Contribution from "./Contribution";
import Transaction from "./Transaction";

const Subscription = pkg_sub;
const bcrypt = pkg_bcrypt;
const jwt = pkg_jwt;

const { PWD_SALT_ROUNDS, JWT_SECRET } = process.env;

if (!PWD_SALT_ROUNDS) {
  throw new Error("PWD_SALT not found in the environment variables");
} else if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not found in the environment variables");
}
interface UserAttributes {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

class User extends Model<UserAttributes> {
  /**
   * @description: Compares the password with the hashed password
   * @param password
   * @returns boolean
   */
  public comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.getDataValue("password"));
  }

  /**
   * @description: Generates a JWT token
   * @returns a JWT token
   */
  public generateToken(): string {
    return jwt.sign(
      {
        id: this.getDataValue("id"),
        email: this.getDataValue("email"),
        role_id: this.getDataValue("role_id"),
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID, // Use UUID for primary key
      defaultValue: DataTypes.UUIDV4, // Automatically generates UUIDs
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "roles", // References the roles table
        key: "id",
      },
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
    hooks: {
      // Save password as a salted hash
      beforeCreate: async (user) => {
        const saltRounds = parseInt(PWD_SALT_ROUNDS);
        const salt = await bcrypt.genSalt(saltRounds);

        user.setDataValue(
          "password",
          bcrypt.hashSync(user.getDataValue("password"), salt)
        );
      },
      beforeUpdate: async (user) => {
        if (user.getDataValue("password")) {
          const salt = await bcrypt.genSalt(parseInt(PWD_SALT_ROUNDS));

          user.setDataValue(
            "password",
            bcrypt.hashSync(user.getDataValue("password"), salt)
          );
        }
      },
    },
    sequelize: db,
    modelName: "User",
    tableName: "users",
    timestamps: false, // Disables Sequelize's automatic `createdAt` and `updatedAt`
  }
);

// associations
// 1. User has one Subscription
// User.hasOne(Subscription, { foreignKey: "user_id" });
// 2. User has many Contributions
User.hasMany(Contribution, { foreignKey: "user_id" });
// 3. User has many Transactions
User.hasMany(Transaction, { foreignKey: "user_id" });
export default User;
