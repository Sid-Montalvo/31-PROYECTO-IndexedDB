// Campos del formulario-----------------------------------------------------------------------------------------------------------------------
let DB;
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');


// UI ----------------------------------------------------------------------------------------------------------------------------------------
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor () {
        this.citas = [];
    }

    agregarCita(cita) {
         this.citas = [...this.citas, cita];

         console.log(this.citas);
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id);

    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }

}

class UI {

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en base al tipo de error
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error 
        divMensaje.textContent = mensaje;

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'))

        // Quitar la alerta despues de 5 seg
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas({citas}){

        this.limpiarHTML();
        
        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita= document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = ` 
                <span class="font-weight-bolder"> Propietario: </span> ${propietario}
                `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = ` 
                 <span class="font-weight-bolder"> Teléfono: </span> ${telefono}
                 `;
            
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = ` 
                 <span class="font-weight-bolder"> Fecha: </span> ${fecha}
                 `;
 
            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = ` 
                  <span class="font-weight-bolder"> Hora: </span> ${hora}
                  `;
            
            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = ` 
                 <span class="font-weight-bolder"> Síntomas: </span> ${sintomas}
                 `;
            
            // Boton para eliminar cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> '; 
            
            btnEliminar.onclick = () => eliminarCita(id);

            // Botón para editar cita
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>'

            btnEditar.onclick = () => cargarEdicion(cita);



   

            // Agregar los parrafos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar );
            divCita.appendChild(btnEditar );




            // agregar las citas al HTML
            contenedorCitas.appendChild(divCita);

        })
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

// Instanciar las clases

const ui = new UI ();
const administrarCitas = new Citas();


window.onload = () => {
        eventListeners(); 
    
        crearDB();
}

// Event Listeners-----------------------------------------------------------------------------------------------------------------------------
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

// Objeto con la información de lacita ---------------------------------------------------------------------------------------------------------

const citaObj = {
    mascota: '',
    propietario: '',
    telefono:'',
    fecha:'',
    hora:'',
    sintomas:''
}



// Agrega datos al objeto de cita----------------------------------------------------------------------------------------------------------------
function datosCita(e){
    citaObj[e.target.name] = e.target.value;

}


// Valida y agrega una nueva cita a la clase de citas

function nuevaCita(e) {
    e.preventDefault();

    // Extraer la información del objeto de cita
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    // Validar
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ) {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

        return;
    }

    if(editando) {
        ui.imprimirAlerta('Editado correctamente');

        // Pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj})


        // Regresar el texto del botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

        // Quitar modo edición
        editando = false;

    } else {
        // Generar un id único
        citaObj.id = Date.now();

        // Creando una nueva cita

        administrarCitas.agregarCita({...citaObj});


        // NUEVO: 
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');
        
        // console.log(objectStore);
        objectStore.add(citaObj);

        transaction.oncomplete = () => {
            console.log('Cita agregada!');

            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Se agregó correctamente');
        }

    }

    // Mensaje de agregado correctamente
    ui.imprimirAlerta('Se agregó correctamente');

    // Reiniciar el objeto para la validación

    reiniciarObjeto();

    // Reiniciar el formulario 
    formulario.reset();

    // Mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas);

}


function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';

}

function eliminarCita(id) {
    // Eliminar la cita
    administrarCitas.eliminarCita(id);

    // Muestre un mensaje
    ui.imprimirAlerta('La cita se eliminó exitosamente');


    // Refrescar las citas
    ui.imprimirCitas(administrarCitas);
}

function cargarEdicion(cita) {
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    // Llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Reiniciar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}

function crearDB () {
    // Crear la base de datos en version 1.0
    const crearDB = window.indexedDB.open('citas' , 1);

    // Si hay un error
    crearDB.onerror = function () {
        console.log('Hubo un error');
    }


    // Si todo sale bien
    crearDB.onesucces = function () {
        console.log('DB creada');

        DB = crearDB.result;

    }

    // Definir el schema
    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keypath: 'id',
            autoIncrement: true
        });

        // Definir todas las columnas
        objectStore.createIndex('mascota', 'mascota', {unique: false});
        objectStore.createIndex('propietario', 'propietario', {unique: false});
        objectStore.createIndex('telefono', 'telefono', {unique: false});
        objectStore.createIndex('fecha', 'fecha', {unique: false});
        objectStore.createIndex('hora', 'hora', {unique: false});
        objectStore.createIndex('sintomas', 'sintomas', {unique: false});
        objectStore.createIndex('id', 'id', {unique: true});
        console.log('DB Creada y Lista');
    }
}