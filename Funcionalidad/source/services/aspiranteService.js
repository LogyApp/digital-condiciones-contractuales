import pool from '../config/database.connection.js';

const getAspirantes = async () => {
    const [rows] = await pool.query(`
        SELECT identificacion, primer_nombre, primer_apellido, segundo_apellido, firma_url
        FROM Dynamic_hv_aspirante
    `);
    return rows;
};

export { getAspirantes };