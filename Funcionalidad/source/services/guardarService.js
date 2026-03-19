import storage from '../config/gcs.js';

const guardarPDF = async (identificacion, buffer) => {
    const bucket = storage.bucket('hojas_vida_logyser');
    const timestamp = Date.now();
    const nombreArchivo = `${identificacion}/${identificacion}.ACTCON.${timestamp}.pdf`;
    const archivo = bucket.file(nombreArchivo);

    await archivo.save(buffer, { contentType: 'application/pdf' });

    return `https://storage.googleapis.com/hojas_vida_logyser/${nombreArchivo}`;
};

const guardarFirma = async (identificacion, buffer) => {
    const bucket = storage.bucket('firmas-images');
    const timestamp = Date.now();
    const nombreArchivo = `${identificacion}/${identificacion}.FIRMA.${timestamp}.png`;
    const archivo = bucket.file(nombreArchivo);

    await archivo.save(buffer, { contentType: 'image/png' });

    return `https://storage.googleapis.com/firmas-images/${nombreArchivo}`;
};

export { guardarPDF, guardarFirma };