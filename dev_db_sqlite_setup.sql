-- database: ./dev_db.db

-- SELECT * FROM roles;


-- Description: SQL script to create the database schema for the Mini ERP application using SQLite
-- database: C:\Users\FRED\MINI_ERP\dev_db.db
-- Create the `users` table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Create the `roles` table
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the `transactions` table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type TEXT CHECK(transaction_type IN ('subscription', 'contribution')) NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create the `subscriptions` table
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY NOT NULL,
    transaction_id INT UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT CHECK(status IN ('active', 'expired')) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

-- Create the `contributions` table
CREATE TABLE IF NOT EXISTS contributions (
    id TEXT PRIMARY KEY NOT NULL,
    transaction_id INT UNIQUE NOT NULL,
    purpose VARCHAR(255),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

INSERT INTO roles (role_name, description) VALUES
    ('admin', 'Administrator role'),
    ('member', 'Standard member role');


-- Optional: Insert test user data (for testing purposes)
INSERT INTO users (id, name, email, phone, role_id) VALUES
    ('sdcs-vsdvs-sdvsdvr-34g3rem', 'Alice Doe', 'alice@example.com', '1234567890', 1),
    ('swg34-234fg-234g34v-34gv3b4', 'Bob Smith', 'bob@example.com', '0987654321', 2);
