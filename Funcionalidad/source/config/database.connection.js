import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORT_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

try {
    const conn = await pool.getConnection();
    console.log('Conexión a la base de datos establecida con éxito.');
    conn.release();
} catch (error) {
    console.log('Fallo al establecer conexión con la base de datos:', error.message);
}

export default pool;