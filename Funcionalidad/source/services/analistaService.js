import pool from '../config/database.connection.js';
import storage from '../config/gcs.js';

const getAnalistas = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT \`identificación\` AS identificacion, trabajador
            FROM \`Maestro_Vinculación\`
            WHERE estado = 'Activo'
            AND cargo LIKE '%CONTRATACION%'
        `);
        return rows;
    } catch (error) {
        console.error('ERROR en getAnalistas:', error.message);
        throw error;
    }
};

const getFirmaAnalista = async (identificacion) => {
    try {
        const [archivos] = await storage.bucket('firmas-images').getFiles({
            prefix: `${identificacion}/`
        });

        if (!archivos.length) return null;

        const masReciente = archivos.sort((a, b) => {
            const fechaA = new Date(a.metadata.timeCreated);
            const fechaB = new Date(b.metadata.timeCreated);
            return fechaB - fechaA;
        })[0];

        return masReciente.name;
    } catch (error) {
        console.error('ERROR en getFirmaAnalista:', error.message);
        throw error;
    }
};

export { getAnalistas, getFirmaAnalista };