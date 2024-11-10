-- Mini ERP MySQL Database Schema
CREATE DATABASE IF NOT EXISTS MINI_ERP_dev_db;

-- Use the database
USE MINI_ERP_dev_db;

-- Create a database user and grant privileges
CREATE USER IF NOT EXISTS 'dev_user'@'localhost' IDENTIFIED BY 'pwd';
GRANT ALL PRIVILEGES ON MINI_ERP_dev_db.* TO 'dev_user'@'localhost';
FLUSH PRIVILEGES;

-- Create the `roles` table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the `users` table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create the `transactions` table
CREATE TABLE IF NOT EXISTS transactions (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type ENUM('subscription', 'contribution') NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the `subscriptions` table
CREATE TABLE IF NOT EXISTS subscriptions (
    id CHAR(36) PRIMARY KEY,
    transaction_id CHAR(36) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    user_id CHAR(36) NOT NULL,
    type ENUM('Free', 'Pro', 'Enterprise') NOT NULL,
    status ENUM('active', 'expired', 'cancelled') NOT NULL DEFAULT 'active',
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create the `contributions` table
CREATE TABLE IF NOT EXISTS contributions (
    id CHAR(36) PRIMARY KEY,
    transaction_id CHAR(36) UNIQUE NOT NULL,
    purpose VARCHAR(255),
    user_id CHAR(36) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert initial roles into the roles table
INSERT INTO roles (role_name, description) VALUES
    ('admin', 'Administrator role'),
    ('member', 'Standard member role');
