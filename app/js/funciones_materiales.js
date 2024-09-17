
//Mensajes
let msgEliminar = "Materal deshabilitado";
let msgActivar = "Material habilitado";
let msgAgregar = "Material agregado";
let msgModificar = "Material modificado";

let msgPesoMaximo = "Maximo 200kb";
let msgNoEsImagen = "No es una imagen";

//Metodo para cambiar el tamaño de los registros que se muestran
function cambiarTamano() {
    const cantidad = document.getElementById("cantRegistros");
    tamanoPagina = parseInt(cantidad.value);
    paginaActual = 1;
    GetMateriales();
}


//Metodo que valida el formulario para agregar materiales y al mismo tiempo agrega el material
function AddMaterialValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let id = document.querySelector('#AddidInput');
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID del material"
        vacio = true;
        PrimerValorVacio = id;
    }
    datos.id = id.value;

    let norma = document.querySelector('#AddnormaInput');
    if (norma.value == "") {
        norma.classList.add("inputVacio");
        norma.placeholder = "Requerida la Norma del material"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = norma;
        }

    }
    datos.norma = norma.value;
    let descripcion = document.querySelector('#AdddescripcionInput');
    if (descripcion.value == "") {
        descripcion.classList.add("inputVacio");
        descripcion.placeholder = "Requerida la Descripcion del material"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = descripcion;
        }

    }
    datos.descripcion = descripcion.value;
    let precio = document.querySelector('#AddprecioInput');
    if (precio.value == "") {
        precio.classList.add("inputVacio");
        precio.placeholder = "Requerido el Precio del material"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = precio;
        }
    }
    datos.precio = precio.value;
    let fecha = document.querySelector('#AddfechaPrecioInput');
    if (fecha.value == "") {
        fecha.classList.add("inputVacio");
        fecha.placeholder = "Requerida la Fecha del material"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = fecha;
        }

    }
    datos.precioFecha = FormateoFecha(fecha.value);
    let unidad = document.querySelector('#AddunidadInput');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }

    }
    datos.unidad = unidad.value;

    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    let json = JSON.stringify(datos);
    let url = "../ws/Materiales/wsAddMaterial.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    var inputFile = document.getElementById('AddimagenInput');
                    if (inputFile.value) {
                        AddAgregarImagen();
                    }
                    AddCerrarModal();
                    mensajePantalla(msgAgregar, true)
                    GetMateriales();
                } else {
                    id.classList.add("inputVacio");
                    id.focus();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });

}
//Metodo para validar el modal para modificar un material y al mismo tiempo valida los datos
function UpdMaterialValidar() {

    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let idA = document.querySelector('#UpdidAnteriorMaterial');
    let id = document.querySelector('#UpdidInput');

    let idCambiado = id.value !== idA.value;
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID del material"
        vacio = true;
        PrimerValorVacio = id;
    }
    datos.idA = idA.value;
    datos.id = id.value;
    datos.idCambiado = idCambiado;
    let norma = document.querySelector('#UpdnormaInput');
    if (norma.value == "") {
        norma.classList.add("inputVacio");
        norma.placeholder = "Requerida la Norma del material"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = norma;
        }
    }
    datos.norma = norma.value;
    let descripcion = document.querySelector('#UpddescripcionInput');
    if (descripcion.value == "") {
        descripcion.classList.add("inputVacio");
        descripcion.placeholder = "Requerida la Descripcion del material"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = descripcion;
        }
    }
    datos.descripcion = descripcion.value;
    let precio = document.querySelector('#UpdprecioInput');
    if (precio.value == "") {
        precio.classList.add("inputVacio");
        precio.placeholder = "Requerido el Precio del material"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = precio;
        }
    }
    datos.precio = precio.value;
    let fecha = document.querySelector('#UpdfechaPrecioInput');
    if (fecha.value == "") {
        fecha.classList.add("inputVacio");
        fecha.placeholder = "Requerida la Fecha del material"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = fecha;
        }
    }
    datos.precioFecha = FormateoFecha(fecha.value);
    let unidad = document.querySelector('#UpdunidadInput');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }
    }
    datos.unidad = unidad.value;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }
    let json = JSON.stringify(datos);

    let url = "../ws/Materiales/wsUpdMaterial.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    var inputFile = document.getElementById('UpdimagenInput');
                    if (inputFile.value || id.value !== idA.value) {
                        UpdAgregarImagen();
                    }
                    UpdateCerrarModal();
                    GetMateriales();
                    mensajePantalla(msgModificar, true)
                } else {

                    id.focus();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function checkMaterial(modal) {
    const datos = {}
    if (modal == "Add") {
        var idVali = document.querySelector('#AddidInput');
    } else {
        var idVali = document.querySelector('#UpdidInput');
        let idAnterior = document.querySelector('#UpdidAnteriorMaterial');
        if (idVali.value == idAnterior.value) {
            existe = false;
            return;
        }
    }

    if (idVali.value == "") {
        return;
    }
    datos.id = idVali.value;
    let json = JSON.stringify(datos);

    let url = "../ws/Materiales/wsBuscarMaterialId.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {

                let resp = JSON.parse(responseText);

                comprobarExiste(resp.estado, idVali)
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}


//Metodo para cambiar el estatus de los materiales
function CambioEstatus() {
    let msgModal = document.getElementById('modalMsgMateriales');
    let parrafoModal = document.getElementById('modParrafo');
    const datos = {};
    datos.id = idEliminar;
    if (ActivarS == 1) {
        datos.estatus = "Inactivo";
    } else {
        datos.estatus = "Activo";
    }
    let json = JSON.stringify(datos);
    switch (parseInt(ActivarS)) {
        case 0: {
            let url = "../ws/Materiales/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        mensajePantalla(msgActivar, true)

                        paginaActual = 1;
                        GetMateriales();
                    } else {
                        throw e = status;
                    }
                } catch (error) {
                    alert("Error: " + error)
                }
            });
            break;
        }
        case 1: {
            let url = "../ws/Materiales/wsCambiarStatus.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        GetMateriales();
                        paginaActual = 1;
                        mensajePantalla(msgEliminar, true)

                    } else {
                        throw e = status;
                    }
                } catch (error) {
                    alert("Error: " + error)
                }
            });
            break;
        }
        default: {
            console.error("Error")
        }
    }

}

//Metodo para regresar una pagina en la paginacion
function paginaAnterior() {
    if (paginaActual > 1) {
        paginaActual--;
        GetMateriales();
    }
}

//Metodo para cambiar de pagona dando clic a la paginacion
//Recobe el numero de pagina al cual se cambiara
function NoPag(pagi) {
    paginaActual = pagi;
    GetMateriales();
}

//Metodo para cambiar a la pagina siguiente en la paginacion
function paginaSiguiente() {
    if (paginaActual < totalPag) {
        paginaActual++;
        GetMateriales();
    }
}

// Metodo para obtener cuantas paginas tendra la paginacion
// Recibe el total de datos y el numero de registros a mostrar en la tabla
function obtenerTotalPaginas(totalDatos, tamanoPagina) {
    return Math.ceil(totalDatos / tamanoPagina);
}

//Metodo para hacer la consulta de los materiales tomando en cuanta los filtros
function GetMateriales() {
    const datos = {};
    let buscar = document.querySelector('#searchInput');
    let estatus = document.getElementById('ValCheEsta').checked;
    let unidad = document.getElementById('selectUnidad');
    datos.buscar = buscar.value;
    datos.estatus = estatus;
    datos.unidad = unidad.value;
    let json = JSON.stringify(datos);
    let url = "../ws/Materiales/wsGetMateriales.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {

                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Llamar a la función para mostrar los datos en la tabla

                    mostrarDatosEnTabla(resp.datos, paginaActual, tamanoPagina);

                } else {
                    // Mostrar mensaje de error si el estado no es "OK"
                    mostrarDatosEnTabla(resp.mensaje, paginaActual, tamanoPagina);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

// metodo para mostrar los datos en la tabla con los datos que salieron de la consulta
//recibe los datos, la pagina actual y el tamaño de los registros que hay que mostrar a la vez
function mostrarDatosEnTabla(datos, paginaActual, tamanoPagina) {
    let totalPaginas = obtenerTotalPaginas(datos.length, tamanoPagina);
    totalPag = totalPaginas;
    let tbody = document.getElementById("tabla-materiales").getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";
    if (datos == "N") {
        let fila = document.createElement("tr");
        fila.innerHTML = `
        <td colspan="8">Sin resultados</td>
        `;
        tbody.appendChild(fila);

        actualizarPaginacion(datos, paginaActual, tamanoPagina);
        return;
    }
    let startIndex = (paginaActual - 1) * tamanoPagina;
    let endIndex = Math.min(startIndex + tamanoPagina, datos.length);


    for (let i = startIndex; i < endIndex; i++) {
        let material = datos[i];
        let fila = document.createElement("tr");
        fila.classList.add("fila")
        fila.addEventListener("mouseover", () => mostrarValores(fila));
        fila.addEventListener("mouseout", () => ocultarValores(fila));
        const formatoMXN = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        });

        // Asegurarse de que el precio se formatee correctamente
        const precioFormateado = (material.precio !== undefined && material.precio !== "")
            ? formatoMXN.format(material.precio)
            : "---";
        // Agregar las celdas a la fila

        fila.innerHTML = `
            <td class="Code">${material.codigo}</td>
            <td>${(!material.norma == "") ? material.norma : "---"}</td>
            <td>${(!material.descripcion == "") ? material.descripcion : "---"}</td>
            <td>${precioFormateado}</td>
            <td>${(!material.fechaprecio == "") ? material.fechaprecio : "---"}</td>
            <td>${(!material.unidad == "") ? material.unidad : "---"}</td>
            <td class="estatus">
                <div style="display: flex; justify-content: space-around; align-items: center; ">
                    <div class="miDiv imaCuadro">
                        <img class="imagenPreview" src="../Materiales/118" >
                    </div>
                </div>
                        <div class="" style="display: flex; justify-content: space-around; align-items: center; ">
                            <i class="miImagen coloresIcono fa-regular fa-images" style="cursor: pointer;" alt="Mostrar Imagen" onmouseover="mostrarDiv(this)" onmouseout="ocultarDiv(this)"></i>
                            ${material.estatus == 1 ? `                            <i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificar(${material.codigo},'${material.norma}','${material.descripcion}',${material.precio},'${material.fechaprecio}','${material.unidad}')"></i>` : ``}
                            ${material.estatus == 1 ?
                `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${material.codigo},${material.estatus})"></i>` :
                `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${material.codigo},${material.estatus})"></i>`
            }

                        </div>
                </div>
            </td>   
        `;
        // Agregar la fila a la tabla
        tbody.appendChild(fila);

    }
    actualizarPaginacion(datos.length, paginaActual, tamanoPagina);
}
//Metodo para actualizar la paginacion, este metodo se ejecuta cuando hay nuevos datos en la tabla
//recibe la cantidad de datos, la pagina actual y el tamaño de registros a mostrar
function actualizarPaginacion(totalDatos, paginaActual, tamanoPagina) {
    if (totalDatos == "N") {
        let paginationList = document.getElementById("pagination-list");
        paginationList.innerHTML = "";
        return;
    }
    let paginationList = document.getElementById("pagination-list");
    paginationList.innerHTML = "";
    let totalPaginas = Math.ceil(totalDatos / tamanoPagina);
    let rangoMostrar = 2; //Rango a mostrar de numeros de pagina
    let liPrev = document.createElement("li");
    liPrev.innerHTML = `<button onclick="paginaAnterior()" style="background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;"><i class="fa-solid fa-angles-left"></i></button>`;
    paginationList.appendChild(liPrev);
    // Ajuste del rango para mostrar siempre 5 páginas
    let startPage = Math.max(1, paginaActual - rangoMostrar);
    let endPage = Math.min(totalPaginas, paginaActual + rangoMostrar);
    if (endPage - startPage < 4) {
        if (startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        } else if (endPage < totalPaginas) {
            endPage = Math.min(totalPaginas, startPage + 4);
        }
    }
    // Generar enlaces de página
    for (let i = startPage; i <= endPage; i++) {
        let li = document.createElement("li");
        if (i === paginaActual) {
            li.classList.add("active");
            li.innerHTML = `<button class="active" style="color: #ffffff; border: 3px solid #008e5a;" onclick="NoPag(${i})">${i}</button>`;
        } else {
            li.innerHTML = `<button style="color: #008e5a; border: 3px solid #008e5a;" onclick="NoPag(${i})">${i}</button>`;
        }
        paginationList.appendChild(li);
    }
    let liNext = document.createElement("li");
    liNext.innerHTML = `<button onclick="paginaSiguiente()" style="background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;"><i class="fa-solid fa-angles-right"></i></button>`;
    paginationList.appendChild(liNext);

}

// Muestra el panel donde se muestra la imagen del material
//Recibe la ubicacion de la fila del cual se mostrara la imagen
function mostrarDiv(imagen) {
    var div = imagen.parentElement.parentElement.querySelector(".miDiv");
    var id = imagen.parentElement.parentElement.parentElement.querySelector(".Code").innerHTML;
    rutaCarpeta = "../Materiales/" + id;
    cargarImagenCuadro(div)
    // Mostrar el div
    div.style.display = "block";
}

// Muestra el panel donde se muestra la imagen del material
//Recibe la ubicacion de la fila del cual se ocultara la imagen
function ocultarDiv(imagen) {
    var div = imagen.parentElement.parentElement.querySelector(".miDiv");
    // Ocultar el div
    div.style.display = "none";
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

//Metodo para limpiar el modal de agregar material
function AddlimpiarModal() {
    let id = document.querySelector('#AddidInput');
    let norma = document.querySelector('#AddnormaInput');
    let descripcion = document.querySelector('#AdddescripcionInput');
    let precio = document.querySelector('#AddprecioInput');
    let unidad = document.querySelector('#AddunidadInput');
    let img = document.querySelector('#AddimagenPreview');
    let inputImg = document.querySelector('#AddimagenInput');
    img.src = "img/sinimagen.png";
    img.alt = "";
    inputImg.value = "";
    let fechaActual = new Date();
    let año = fechaActual.getFullYear();
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    let dia = fechaActual.getDate().toString().padStart(2, '0');
    let fechaFormateada = `${año}-${mes}-${dia}`;
    document.querySelector('#AddfechaPrecioInput').value = fechaFormateada;

    id.value = "";
    norma.value = "";
    descripcion.value = "";
    precio.value = "";
    unidad.value = "";

    id.placeholder = "";
    norma.placeholder = "";
    descripcion.placeholder = "";
    precio.placeholder = "";

    id.classList.remove("inputVacio");
    norma.classList.remove("inputVacio");
    descripcion.classList.remove("inputVacio");
    precio.classList.remove("inputVacio");
    unidad.classList.remove("inputVacio");
}

//Metodo para que se cree la carpeta y se le introduzca la imagen seleccionada a la hora de guardar el material
function AddAgregarImagen() {
    let id = document.querySelector('#AddidInput').value;
    var inputFile = document.getElementById('AddimagenInput');
    var file = inputFile.files[0];
    // Verificar el tamaño del archivo (en bytes)
    var maxSizeBytes = 200 * 1024;
    if (file.size <= maxSizeBytes) {
        // Verificar si el archivo es una imagen con formato PNG o JPG
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            var formData = new FormData();
            formData.append('imagen', file);
            formData.append('id', id);
            // Enviar la imagen al servidor
            $.ajax({
                url: './js/guardar_imagen.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log('Imagen guardada:', response);
                },
                error: function (error) {
                    console.error('Error al guardar la imagen:', error);
                }
            });
        } else {
            mensajePantalla('El archivo seleccionado no es una imagen en formato PNG o JPG.', false);
        }
    } else {
        mensajePantalla('El tamaño del archivo excede el límite de 200 KB.', false);

    }

}

//Metodo para que se cree la carpeta y se le introduzca la imagen seleccionada a la hora de modificar el material
function UpdAgregarImagen() {
    let id = document.querySelector('#UpdidInput').value;
    let idAnterior = document.querySelector('#UpdidAnteriorMaterial').value; // Obtener el ID anterior
    var inputFile = document.getElementById('UpdimagenInput');
    var file = inputFile.files[0];
    console.log(id, idAnterior)

    // Verificar el tamaño del archivo (en bytes)
    var maxSizeBytes = 200 * 1024;
    if (file.size <= maxSizeBytes) {
        // Verificar si el archivo es una imagen con formato PNG o JPG
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            var formData = new FormData();
            formData.append('imagen', file);
            formData.append('id', id);
            formData.append('idAnterior', idAnterior); // Añadir el ID anterior al FormData

            // Enviar la imagen al servidor
            $.ajax({
                url: './js/guardar_imagen.php', // Asegúrate de que la ruta es correcta
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log('Imagen guardada:', response);
                },
                error: function (error) {
                    console.error('Error al guardar la imagen:', error);
                }
            });
        } else {
            mensajePantalla('El archivo seleccionado no es una imagen en formato PNG o JPG.', false);
        }
    } else {
        mensajePantalla('El tamaño del archivo excede el límite de 200 KB.', false);
    }
}


//Metodo para mostrar la imagen en el modal de agregar Material, recibe la imagen seleccionada
function AddmostrarImagen(input) {
    const imagenPreview = document.getElementById('AddimagenPreview');

    // Verifica que haya un archivo seleccionado
    if (input.files && input.files[0]) {
        const archivo = input.files[0]; // Obtener el archivo seleccionado

        // Verifica el tipo MIME del archivo para asegurarse de que es una imagen
        const tiposImagen = ['image/jpeg', 'image/png', 'image/gif']; // Tipos MIME permitidos para imágenes
        if (!tiposImagen.includes(archivo.type)) {
            mensajePantalla(msgNoEsImagen, false);
            input.value = ""; // Limpiar el input para que el usuario pueda seleccionar otro archivo
            imagenPreview.src = "/paginacfe/app/img/sinimagen.png"; // Limpiar el preview
            return; // Salir de la función para evitar cargar un archivo no imagen
        }

        // Comprueba si el tamaño del archivo es mayor a 200 KB (200 * 1024 = 204800 bytes)
        if (archivo.size > 204800) {
            mensajePantalla(msgPesoMaximo, false);
            input.value = ""; // Limpiar el input para que el usuario pueda seleccionar otro archivo
            imagenPreview.src = "/paginacfe/app/img/sinimagen.png"; // Limpiar el preview
            return; // Salir de la función para evitar cargar la imagen grande
        }

        const reader = new FileReader(); // Crea un lector de archivos
        reader.onload = function (e) {
            imagenPreview.src = e.target.result; // Muestra la imagen en el preview
        };
        reader.readAsDataURL(archivo); // Lee el archivo seleccionado
    }
}

//Metodo para mostrar la imagen en el modal de Modificar Material, recibe la imagen seleccionada
function UpdAgregarImagen() {
    let id = document.querySelector('#UpdidInput').value;
    let idAnterior = document.querySelector('#UpdidAnteriorMaterial').value; // Obtener el ID anterior
    var inputFile = document.getElementById('UpdimagenInput');
    var file = inputFile.files[0];

    var formData = new FormData();
    formData.append('id', id);
    formData.append('idAnterior', idAnterior);

    // Solo añadir la imagen si se ha seleccionado un archivo
    if (file) {
        // Verificar el tamaño del archivo (en bytes)
        var maxSizeBytes = 200 * 1024;
        if (file.size <= maxSizeBytes) {
            // Verificar si el archivo es una imagen con formato PNG o JPG
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                formData.append('imagen', file);
            } else {
                mensajePantalla('El archivo seleccionado no es una imagen en formato PNG o JPG.', false);
                return; // Detener la ejecución si el archivo no es válido
            }
        } else {
            mensajePantalla('El tamaño del archivo excede el límite de 200 KB.', false);
            return; // Detener la ejecución si el archivo es demasiado grande
        }
    }

    // Enviar la imagen al servidor
    $.ajax({
        url: './js/guardar_imagen.php',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log('Operación completada:', response);
        },
        error: function (error) {
            console.error('Error al procesar la solicitud:', error);
        }
    });
}

//Metodo para cambiar la imagen del toggle a la hora de darle clic para cambiar entre materiales activos e inactivos
function valStatus() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png"
    } else {
        imgcheck.src = "../img/toggle_off_35px.png"
    }
}

//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del material
function llenarModalModificar(id, norma, descripcion, precio, fechaPrecio, unidad) { //Llenado de datos en el modal


    let idM = document.querySelector('#UpdidInput');
    let idA = document.querySelector('#UpdidAnteriorMaterial');
    let normaM = document.querySelector('#UpdnormaInput');
    let descripcionM = document.querySelector('#UpddescripcionInput');
    let precioM = document.querySelector('#UpdprecioInput');
    let unidadM = document.querySelector('#UpdunidadInput');
    let inputImg = document.querySelector('#UpdimagenInput');

    inputImg.value = "";
    idM.value = id;
    idA.value = id;
    normaM.value = norma;
    descripcionM.value = descripcion;
    precioM.value = precio;
    unidadM.value = unidad;
    rutaCarpeta = "../Materiales/" + id;
    cargarImagen()
    //llenar el select de responsables
    for (var i = 0; i < unidadM.options.length; i++) {
        if (unidadM.options[i].value === unidad) {
            unidadM.options[i].selected = true;
            break;
        }
    }
    if (normaM.value == "null") {
        normaM.value = "";
    }
    if (fechaPrecio != "null") {
        document.querySelector('#UpdfechaPrecioInput').value = FormateoFecha(fechaPrecio);
    } else {
        let fechaActual = new Date();
        let año = fechaActual.getFullYear();
        let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
        let dia = fechaActual.getDate().toString().padStart(2, '0');
        let fechaFormateada = `${año}-${mes}-${dia}`;
        document.querySelector('#UpdfechaPrecioInput').value = fechaFormateada;
    }

    idM.placeholder = "";
    normaM.placeholder = "";
    descripcionM.placeholder = "";
    precioM.placeholder = "";

    idM.classList.remove("inputVacio");
    normaM.classList.remove("inputVacio");
    descripcionM.classList.remove("inputVacio");
    precioM.classList.remove("inputVacio");
    unidadM.classList.remove("inputVacio");
}

var rutaCarpeta = '../Materiales/1';
//Metodo para que cuando se modifique algun material se cargue la imagen que este tenga
function cargarImagen() {
    obtenerArchivosEnCarpeta(rutaCarpeta)
        .then(archivos => {
            // Seleccionar la única imagen encontrada en la carpeta
            const imagen = archivos.find(archivo => archivo.endsWith('.JPG') || archivo.endsWith('.jpg') || archivo.endsWith('.png') || archivo.endsWith('.jpeg'));

            if (imagen == undefined) {
                const elementoImagen = document.getElementById('UpdimagenPreview');
                elementoImagen.src = "/paginacfe/app/img/sinimagen.png";
            } else {
                // Crear la ruta completa de la imagen
                const rutaImagen = `${rutaCarpeta}/${imagen}`;

                // Obtener el elemento img
                const elementoImagen = document.getElementById('UpdimagenPreview');

                // Asignar la ruta de la imagen al src del elemento img
                elementoImagen.src = rutaImagen;
            }
        })
        .catch(error => console.error('Error al obtener archivos en la carpeta.', error));
}

//Metodo para buscar la carpeta donde se encuentra la imagen del material
function cargarImagenCuadro(imagen) {
    var div = imagen.parentElement.querySelector(".miDiv");
    // Obtener la lista de archivos en la carpeta
    obtenerArchivosEnCarpeta(rutaCarpeta)
        .then(archivos => {
            // Seleccionar la única imagen encontrada en la carpeta
            const imagen = archivos.find(archivo => archivo.endsWith('.JPG') || archivo.endsWith('.jpg') || archivo.endsWith('.png') || archivo.endsWith('.jpeg'));
            if (imagen == undefined) {
                const elementoImagen = div.querySelector(".imagenPreview");
                elementoImagen.src = "/paginacfe/app/img/sinimagen.png";
            } else {
                // Crear la ruta completa de la imagen
                const rutaImagen = `${rutaCarpeta}/${imagen}`;

                // Obtener el elemento img
                const elementoImagen = div.querySelector(".imagenPreview");

                // Asignar la ruta de la imagen al src del elemento img
                elementoImagen.src = rutaImagen;
            }
        })
        .catch(error => {
            console.error('Error al obtener archivos en la carpeta.', error);
        })
}
//Metodo para obtener los archivos de la carpeta
//Recibe la ruta de donde se encuentra la carpeta 
async function obtenerArchivosEnCarpeta(rutaCarpeta) {
    const response = await fetch(rutaCarpeta);
    const textoHtml = await response.text();
    // Analizar el HTML para extraer los nombres de archivo
    const parser = new DOMParser();
    const htmlDocumento = parser.parseFromString(textoHtml, 'text/html');
    const enlaces = htmlDocumento.querySelectorAll('a');
    // Filtrar los nombres de archivo
    const archivos = Array.from(enlaces)
        .map(enlace => enlace.getAttribute('href'))
        .filter(archivo => archivo !== '../' && !archivo.startsWith('#'));
    return archivos;
}


//Metodo para cerrar el modal de agregar material
function AddCerrarModal() {
    $('#AgregarModal').modal('hide');
}
//Metodo para cerrar el modal de modificar material
function UpdateCerrarModal() {

    $('#EditarModal').modal('hide');
}
function ActivarCerrarModal() {

    $('#confirmActivationModal').modal('hide');
}
function EliminarCerrarModal() {

    $('#confirmAdditionalModal').modal('hide');
}

function AbrirModalConfirm() {
    $('#confirmAdditionalModal').modal('show');
}
//Metodo para abrir el modal dependiendo si se abre para activar o eliminar
function AbrirModalConfirm1() {
    let estatus = document.getElementById('ValCheEsta').checked;
    if (estatus) {
        $('#confirmDeleteModal').modal('show');
    } else {
        $('#confirmActivationModal').modal('show');
    }

}

