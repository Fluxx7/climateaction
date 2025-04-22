
CREATE DATABASE IF NOT EXISTS climate_action_app;

USE climate_action_app;

CREATE TABLE IF NOT EXISTS Users {
    id INT AUTO_INCREMENT PRIMARY KEY,
    referred_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referred_by) REFERENCES users(id)
};