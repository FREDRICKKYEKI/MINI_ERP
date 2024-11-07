-- Description: SQL script to create a sample database schema for a simple user management system with roles,
-- transactions, subscriptions, and contributions tables.
-- NOTE: This script is intended for MySQL or MariaDB databases.
-- Create the database
CREATE DATABASE IF NOT EXISTS dev_db;

-- Use the database
USE dev_db;

-- Create a database user and grant privileges
CREATE USER IF NOT EXISTS 'dev_user'@'localhost' IDENTIFIED BY 'pwd';
GRANT ALL PRIVILEGES ON dev_db.* TO 'dev_user'@'localhost';
FLUSH PRIVILEGES;

-- Create the `users` table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the `roles` table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the `transactions` table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type ENUM('subscription', 'contribution') NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the `subscriptions` table
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('active', 'expired') NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

-- Create the `contributions` table
CREATE TABLE IF NOT EXISTS contributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT UNIQUE NOT NULL,
    purpose VARCHAR(255),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

-- Sample data for the `users` table
INSERT IGNORE INTO users (name, email, phone, role_id) VALUES 
    ('Alice Doe', 'alice@example.com', '1234567890', 1),
    ('Bob Smith', 'bob@example.com', '0987654321', 2);
