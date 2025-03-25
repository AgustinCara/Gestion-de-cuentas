// Arreglos que almacenan ingresos, egresos y ahorros
const ingresos = [];
const egresos = [];
const ahorros = [];

// Cargar datos desde LocalStorage al iniciar la aplicación
const cargarDesdeLocalStorage = () => {
    const datosGuardados = localStorage.getItem("datosFinancieros");
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        ingresos.push(...datos.ingresos);
        egresos.push(...datos.egresos);
        ahorros.push(...datos.ahorros);
    }
};

// Guardar datos en LocalStorage
const guardarEnLocalStorage = () => {
    const datos = { ingresos, egresos, ahorros };
    localStorage.setItem("datosFinancieros", JSON.stringify(datos));
};

// Función principal que inicializa la aplicación
let cargarApp = () => {
    cargarDesdeLocalStorage();
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
    cargarAhorros();
};

// Función que calcula el total de ingresos
let totalIngresos = () => {
    let totalIngreso = 0;
    for (let ingreso of ingresos) {
        totalIngreso += ingreso.valor;
    }
    return totalIngreso;
};

// Función que calcula el total de egresos
let totalEgresos = () => {
    let totalEgreso = 0;
    for (let egreso of egresos) {
        totalEgreso += egreso.valor;
    }
    return totalEgreso;
};

// Función que calcula el total de ahorros
let totalAhorros = () => {
    let totalAhorro = 0;
    for (let ahorro of ahorros) {
        totalAhorro += ahorro.valor;
    }
    return totalAhorro;
};

// Función que carga el encabezado con los valores actualizados
let cargarCabecero = () => {
    let ingresosTotal = totalIngresos();
    let egresosTotal = totalEgresos();
    let ahorrosTotal = totalAhorros();
    
    let presupuesto = ingresosTotal - egresosTotal;
    let porcentajeEgreso = ingresosTotal > 0 ? egresosTotal / ingresosTotal : 0;
    let porcentajeAhorro = ingresosTotal > 0 ? ahorrosTotal / ingresosTotal : 0;

    document.getElementById('presupuesto').innerHTML = formatoMoneda(presupuesto);
    document.getElementById('porcentaje').innerHTML = formatoPorcentaje(porcentajeEgreso);
    document.getElementById('ingresos').innerHTML = formatoMoneda(ingresosTotal);
    document.getElementById('egresos').innerHTML = formatoMoneda(egresosTotal);
    document.getElementById('ahorros').innerHTML = formatoMoneda(ahorrosTotal);
};

// Función que da formato a los valores monetarios
const formatoMoneda = (valor) => {
    return valor.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
};

// Función que da formato a los valores porcentuales
const formatoPorcentaje = (valor) => {
    return valor.toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 });
};

// Función que carga los ingresos en el HTML
const cargarIngresos = () => {
    let ingresosHTML = '';
    for (let ingreso of ingresos) {
        ingresosHTML += crearIngresoHTML(ingreso);
    }
    document.getElementById('lista-ingresos').innerHTML = ingresosHTML;
};

// Función que genera el HTML de un ingreso
const crearIngresoHTML = (ingreso) => {
    return `
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${ingreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">+ ${formatoMoneda(ingreso.valor)}</div>
            <div class="elemento_eliminar">
                <button class='elemento_eliminar--btn'>
                    <ion-icon name='close-circle-outline' onclick='eliminarIngreso(${ingreso.id})'></ion-icon>
                </button>
            </div>
        </div>
    </div>`;
};

// Función que elimina un ingreso por ID
const eliminarIngreso = (id) => {
    let indiceEliminar = ingresos.findIndex(ingreso => ingreso.id === id);
    if (indiceEliminar !== -1) {
        ingresos.splice(indiceEliminar, 1);
        guardarEnLocalStorage();
        cargarCabecero();
        cargarIngresos();
    }
};

// Función que carga los egresos en el HTML
const cargarEgresos = () => {
    let egresosHTML = '';
    for (let egreso of egresos) {
        egresosHTML += crearEgresoHTML(egreso);
    }
    document.getElementById('lista-egresos').innerHTML = egresosHTML;
};

// Función que genera el HTML de un egreso
const crearEgresoHTML = (egreso) => {
    return `
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${egreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">- ${formatoMoneda(egreso.valor)}</div>
            <div class="elemento_porcentaje">${formatoPorcentaje(egreso.valor / totalEgresos())}</div>
            <div class="elemento_eliminar">
                <button class='elemento_eliminar--btn'>
                    <ion-icon name='close-circle-outline' onclick='eliminarEgreso(${egreso.id})'></ion-icon>
                </button>
            </div>
        </div>
    </div>`;
};

// Función que elimina un egreso por ID
const eliminarEgreso = (id) => {
    let indiceEliminar = egresos.findIndex(egreso => egreso.id === id);
    if (indiceEliminar !== -1) {
        egresos.splice(indiceEliminar, 1);
        cargarCabecero();
        cargarEgresos();
    }
};

// Función que carga los ahorros en el HTML
const cargarAhorros = () => {
    let ahorrosHTML = '';
    for (let ahorro of ahorros) {
       ahorrosHTML += crearAhorroHTML(ahorro);
    }
    document.getElementById('lista-ahorros').innerHTML = ahorrosHTML;
};

// Función que genera el HTML de un ahorro
const crearAhorroHTML = (ahorro) => {
    return `
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${ahorro.descripcion}</div>
        <div class="derecha limpiar">
            <div class="elemento_valor">- ${formatoMoneda(ahorro.valor)}</div>
            <div class="elemento_eliminar">
                <button class='elemento_eliminar--btn'>
                    <ion-icon name='close-circle-outline' onclick='eliminarAhorro(${ahorro.id})'></ion-icon>
                </button>
            </div>
        </div>
    </div>`;
};

// Función que elimina un ahorro por ID
const eliminarAhorro = (id) => {
    let indiceEliminar = ahorros.findIndex(ahorro => ahorro.id === id);
    if (indiceEliminar !== -1) {
        ahorros.splice(indiceEliminar, 1);
        cargarCabecero();
        cargarAhorros();
    }
};

// Función para agregar ingresos, egresos o ahorros desde el formulario
let agregarDato = () => {
    let forma = document.forms['forma'];
    let tipo = forma['tipo'].value;
    let descripcion = forma['descripcion'].value;
    let valor = Number(forma['valor'].value);
    
    if (descripcion !== '' && valor > 0) {
        let nuevoDato = { id: Date.now(), descripcion, valor };
        if (tipo === 'ingreso') {
            ingresos.push(nuevoDato);
            cargarIngresos();
        } else if (tipo === 'egreso') {
            egresos.push(nuevoDato);
            cargarEgresos();
        } else if (tipo === 'ahorro') {
            ahorros.push(nuevoDato);
            cargarAhorros();
        }
        guardarEnLocalStorage();
        cargarCabecero();
    }
};


// Función para descargar los datos en diferentes formatos
const descargarArchivo = (contenido, nombreArchivo, tipo) => {
    const blob = new Blob([contenido], { type: tipo });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Guardar datos en formato TXT
const guardarComoTXT = () => {
    let txtContent = "Ingresos:\n" + ingresos.map(i => `${i.descripcion}: ${i.valor}`).join('\n');
    txtContent += "\n\nEgresos:\n" + egresos.map(e => `${e.descripcion}: ${e.valor}`).join('\n');
    txtContent += "\n\nAhorros:\n" + ahorros.map(a => `${a.descripcion}: ${a.valor}`).join('\n');
    descargarArchivo(txtContent, "datos.txt", "text/plain");
};


// // Guardar datos en formato JSON
// const guardarComoJSON = () => {
//     const datos = { ingresos, egresos, ahorros };
//     descargarArchivo(JSON.stringify(datos, null, 2), "datos.json", "application/json");
// };
