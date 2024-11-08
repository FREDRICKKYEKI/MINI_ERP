/**
 * @description User model
 */
import { DataTypes, Model } from "sequelize";
import pkg_db from "../db";
import pkg_bcrypt from "bcrypt";
import pkg_jwt from "jsonwebtoken";

const db = pkg_db;
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

class User extends Model<UserAttributes> implements UserAttributes {
  //   public id!: string;
  public name!: string;
  public email!: string;
  //   public phone?: string;
  public password!: string;
  //   public role_id?: number;
  //   public created_at!: Date;
  //   public updated_at!: Date;
  // compare password method
  public comparePassword(password: string): boolean {
    return bcrypt.compareSync(password, this.getDataValue("password"));
  }

  // generate token method
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
        if (user.changed("password")) {
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

export default User;
