const API_BASE = 'https://digital-condiciones-contractuales-594761951101.europe-west1.run.app/api';

const convertirUrlProxy = (url) => {
    if (!url) return null;
    const match = url.match(/storage\.googleapis\.com\/([^/]+)\/(.+?)(\?|$)/);
    if (!match) return url;
    const bucket = match[1];
    const path = match[2];
    return `${API_BASE}/imagen?bucket=${bucket}&path=${encodeURIComponent(path)}`;
};

class Firmador {
    constructor(canvasId, soloLectura = false) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.dibujando = false;
        this.ultimoX = 0;
        this.ultimoY = 0;
        this.firmaPrecargada = false;

        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;

        if (soloLectura) {
            this.canvas.style.cursor = 'default';
            return;
        }

        this.canvas.addEventListener('mousedown', this.iniciarDibujo.bind(this));
        this.canvas.addEventListener('mousemove', this.dibujar.bind(this));
        this.canvas.addEventListener('mouseup', this.detenerDibujo.bind(this));
        this.canvas.addEventListener('mouseout', this.detenerDibujo.bind(this));

        this.canvas.addEventListener('touchstart', this.iniciarDibujoTactil.bind(this));
        this.canvas.addEventListener('touchmove', this.dibujarTactil.bind(this));
        this.canvas.addEventListener('touchend', this.detenerDibujo.bind(this));
    }

    iniciarDibujo(e) {
        e.preventDefault();

        if (this.firmaPrecargada) {
            this.limpiar();
            this.firmaPrecargada = false;
        }

        this.dibujando = true;
        const pos = this.getPosicion(e);
        this.ultimoX = pos.x;
        this.ultimoY = pos.y;
        this.ctx.beginPath();
        this.ctx.moveTo(this.ultimoX, this.ultimoY);
    }

    dibujar(e) {
        e.preventDefault();
        if (!this.dibujando) return;

        const pos = this.getPosicion(e);
        const x = pos.x;
        const y = pos.y;

        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);

        this.ultimoX = x;
        this.ultimoY = y;
    }

    detenerDibujo() {
        this.dibujando = false;
        this.ctx.beginPath();
    }

    iniciarDibujoTactil(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    dibujarTactil(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    getPosicion(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    limpiar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
    }
}

const firmadorColab = new Firmador('firmaColaborador');
const firmadorAnalista = new Firmador('firmaAnalista', true);

const cargarDatosActcon = async () => {
    const params = new URLSearchParams(window.location.search);
    const identificacion = params.get('id');

    if (!identificacion) {
        alert('No se encontró identificación en la URL.');
        return;
    }

    const res = await fetch(`${API_BASE}/actcon?identificacion=${identificacion}`);
    const json = await res.json();
    const actcon = json.data[0];

    if (!actcon) {
        alert('No se encontró el registro para esta identificación.');
        return;
    }

    document.getElementById('nombreColaborador').textContent = actcon.trabajador;
    document.getElementById('identificacionColaborador').textContent = actcon.identificacion;

    if (actcon.firma_url) {
        const urlProxy = convertirUrlProxy(actcon.firma_url);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onerror = (e) => console.error('Error cargando firma:', e);
        img.onload = () => {
            firmadorColab.ctx.drawImage(img, 0, 0, firmadorColab.canvas.width, firmadorColab.canvas.height);
            firmadorColab.firmaPrecargada = true;
        };
        img.src = urlProxy;
    }
};

const cargarAnalistas = async () => {
    const res = await fetch(`${API_BASE}/analistas`);
    const json = await res.json();
    const selectAnalista = document.getElementById('selectAnalista');

    json.data.forEach(a => {
        const option = document.createElement('option');
        option.value = a.identificacion;
        option.textContent = a.trabajador.includes('**')
            ? a.trabajador.split('**')[1].trim()
            : a.trabajador;
        selectAnalista.appendChild(option);
    });
};

document.getElementById('selectAnalista').addEventListener('change', async function () {
    firmadorAnalista.limpiar();
    const identificacion = this.value;
    console.log('Analista seleccionado:', identificacion);
    if (!identificacion) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = (e) => console.error('Error cargando firma analista:', e);
    img.onload = () => firmadorAnalista.ctx.drawImage(img, 0, 0, firmadorAnalista.canvas.width, firmadorAnalista.canvas.height);
    img.src = `${API_BASE}/analistas/firma/${identificacion}`;
});

document.getElementById('btnGuardar').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;

    const btnGuardar = document.getElementById('btnGuardar');
    const selectAnalista = document.getElementById('selectAnalista');
    const nombreAnalista = selectAnalista.options[selectAnalista.selectedIndex]?.text ?? '';
    const canvasColab = document.getElementById('firmaColaborador');
    const canvasAnalista = document.getElementById('firmaAnalista');

    btnGuardar.style.display = 'none';
    selectAnalista.style.display = 'none';
    canvasColab.style.border = 'none';
    canvasAnalista.style.border = 'none';

    const analistaNombreEl = document.createElement('div');
    analistaNombreEl.style.fontFamily = "'Times New Roman', Times, serif";
    analistaNombreEl.style.fontSize = '14px';
    analistaNombreEl.style.marginBottom = '8px';
    analistaNombreEl.textContent = nombreAnalista;
    selectAnalista.parentNode.insertBefore(analistaNombreEl, selectAnalista);

    const documento = document.querySelector('.documento-pdf');
    const canvas = await html2canvas(documento, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const pdfBase64 = pdf.output('datauristring').split(',')[1];
    const firmaBase64 = canvasColab.toDataURL('image/png');
    const identificacion = document.getElementById('identificacionColaborador').textContent;

    btnGuardar.style.display = 'block';
    selectAnalista.style.display = 'block';
    analistaNombreEl.remove();
    canvasColab.style.border = '1px solid #ccc';
    canvasAnalista.style.border = '1px solid #ccc';

    const res = await fetch(`${API_BASE}/guardar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identificacion,
            pdfBase64,
            firmaBase64,
            firmaModificada: !firmadorColab.firmaPrecargada
        })
    });

    const json = await res.json();

    if (json.success) {
        alert('Acta guardada correctamente.');
    } else {
        alert('Error al guardar: ' + json.message);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        firmadorColab.limpiar();
        firmadorAnalista.limpiar();
        alert('Canvas limpiados');
    }
});

cargarDatosActcon();
cargarAnalistas();