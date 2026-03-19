import pool from '../config/database.connection.js';

const getActcon = async (identificacion) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                da.id,
                da.identificacion,
                da.trabajador,
                da.fecha_firma,
                da.url_pdf,
                dh.firma_url
            FROM Digital_ACTCON da
            LEFT JOIN Dynamic_hv_aspirante dh ON da.identificacion = dh.identificacion
            WHERE da.identificacion = ?
        `, [identificacion]);
        return rows;
    } catch (error) {
        console.error('ERROR en getActcon:', error.message);
        throw error;
    }
};

export { getActcon };