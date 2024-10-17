function opcion(op) {

    let url = "";
    let json = "";
    var funcion;
    switch (op) {
        case "materiales":
            url = "Materiales/addmaterialesFrm.php";
            funcion = GetMateriales;
            break;
        case "usuarios":
            url = "Usuarios/addUsuariosFrm.php";
            funcion = GetUsuario;
            break;
        case "perfilUsu":
            url = "Usuarios/perfilUsuarioFrm.php";
            break;
        case "conceptos":
            url = "Conceptos/addconceptosFrm.php";
            funcion = GetConcepto;
            break;
        case "proyecto":
            url = "Proyectos/addProyectoFrm.php";
            break;
        case "ManoObra":
            url = "ManoObra/addManoObraFrm.php";
            funcion = GetManoObra;
            break;
        case "Catalogo":
            url = "Catalogo/viewFichabasicosFrm.php";
            funcion = AgregarDatosTablaConceptoCatalogo;
            break;
        case "Maquinaria":
            url = "Maquinaria/addMaquinariaFrm.php";
            funcion = GetMaquinaria;
            break;
        case "Basicos":
            url = "Basicos/addBasicosFrm.php";
            funcion = GetBasico;
            break;
        case "Especificaciones":
            url = "Especificaciones/addEspecificaciones.php";
            //funcion = cambiarTamanoMaquinaria;
            break;
        default: alert("Opción incorrecta"); return;
    }

    $.post(url, json, (responseText, status) => {
        try {
            console.log(responseText);

            if (status == "success") {
                document.getElementById("mainContent").innerHTML = responseText;
                EstatusEntidades();
                funcion();

            } else {
                throw e = status;
            }
        } catch (error) {
            console.log("Error: " + error);
        }
    });
}


//Atributos globales

let existe = false;
let paginaActual = 1;
let tamanoPagina = 10;
var totalPag = 1;

let idEliminar;
let ActivarS;



// let filteredData = [...data];
// let rowsPerPage = 10;
// let currentPage = 1;
// Para aplicar orden y filtros
// let currentSortField = null;
// let currentSortOrder = 'asc'; // ascendente o descendente
//Funciones globales

function EstatusEntidades() {
    estatusUsuario = 1;
    estatusMaquinaria = 1;
    estatusMano = 1;
}


//Metodo para imprimir un mensaje en pantalla
//recibe dos valores el mensaje y si el mensaje es positivo se pone true, si es negativo false
function mensajePantalla(msg, valor) {
    let msgModal = document.getElementById('modalMsgUsuarios');
    let parrafoModal = document.getElementById('modParrafo');
    let modUsu = document.getElementById('modUsu');
    let img = document.getElementById('imgPic');
    if (valor) {
        img.src = "../img/imgPalomita.png"
        parrafoModal.innerHTML = msg;
        msgModal.classList.remove("modMsgEsconder");
        modUsu.classList.add("modMsgBien");
        setTimeout(() => {
            msgModal.classList.add("modMsgEsconder");
            modUsu.classList.remove("modMsgBien");
        }, 2500);
    } else {
        img.src = "../img/imgEquis.png"
        parrafoModal.innerHTML = msg;
        msgModal.classList.remove("modMsgEsconder");
        modUsu.classList.add("modMsgMal");
        setTimeout(() => {
            msgModal.classList.add("modMsgEsconder");
            msgModal.classList.remove("modMsgMal");
        }, 2500);
    }
}


//Metodo que asigna los el id y el estatus del material para ver cuales se veran afectados
// Recibe el id del estatus y el valor actual del estatus
function AsignarValores(pidEliminar, pActivarS) {
    idEliminar = pidEliminar;
    ActivarS = pActivarS;
}
// Metodo para obtener cuantas paginas tendra la paginacion
// Recibe el total de datos y el numero de registros a mostrar en la tabla
function obtenerTotalPaginas(totalDatos, tamanoPagina) {
    return Math.ceil(totalDatos / tamanoPagina);
}

//Metodo para hacer visible las acciones de la fila
//Recibe la fila
function mostrarValores(fila) {
    //fila.getElementsByClassName('valores')[0].style.display = 'flex';

    const elementosColoresIcono = fila.querySelectorAll('.coloresIcono');

    // Itera sobre cada elemento y cambia su estilo de color
    elementosColoresIcono.forEach(elemento => {
        elemento.style.color = "#008e5a";
    });
    //fila.('coloresIcono')[0.].style.color = "#858585";
}

//Metodo para oculas las acciones de la fila
//Recibe la fila
function ocultarValores(fila) {
    //fila.getElementsByClassName('valores')[0].style.display = 'none';
    const elementosColoresIcono = fila.querySelectorAll('.coloresIcono');

    // Itera sobre cada elemento y cambia su estilo de color
    elementosColoresIcono.forEach(elemento => {
        elemento.style.color = "#858585";
    });

}

// Metodo que comprueba si el campo contiene un dato
// Recibe el campo
function CompruebaTieneAlgoInput(input) {
    if (input.value) {
        input.classList.add("inputLleno");
        input.classList.remove("inputVacio");
        input.placeholder = ""
    }
}

// cambia de valor la variable existe dependiendo si el valor recibido existe o no
// recibe, valor y el campo que se esta comprobando si existe un dato igual al ingresado
function comprobarExiste(valor, campo) {
    if (valor == "A") {
        existe = true;
        campo.classList.add("inputVacio");
    } else {
        existe = false;
        campo.classList.remove("inputVacio");
    }
}

// Metodo para dar formato a la fecha
//Recibe la fecha a la que se le dara el formato
function FormateoFecha(fecha) {
    let partesFecha = fecha.split("/");
    let dia = partesFecha[0];
    let mes = partesFecha[1];
    let año = partesFecha[2];
    let fechaFormateada = new Date(`${año}/${mes}/${dia}`);
    let añoFormateado = fechaFormateada.getFullYear();
    let mesFormateado = (fechaFormateada.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
    let diaFormateado = fechaFormateada.getDate().toString().padStart(2, '0');
    return fechaFinal = `${añoFormateado}-${mesFormateado}-${diaFormateado}`;
}
