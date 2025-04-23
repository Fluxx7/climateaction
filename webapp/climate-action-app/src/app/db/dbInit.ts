import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export async function initializeDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true,
    });

    const sql = fs.readFileSync(path.join(process.cwd(), 'src', 'app', 'db', 'init.sql'), 'utf-8');

    try {
        await connection.query(sql);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await connection.end();
    }
}
