function incio() {

    setTimeout(() => {
        GetMateriales();
    }, 800);
}

let paginaActual = 1; // Página actual
let tamanoPagina = 10; // Número de elementos por página
var totalPag = 1;


function cambiarTamano() {
    const cantidad = document.getElementById("cantRegistros");
    tamanoPagina = parseInt(cantidad.value);
    paginaActual = 1;
    console.log(tamanoPagina);
    GetMateriales();
}

function AddMaterialValidar() {

    const datos = {};
    let id = document.querySelector('#AddidInput');
    if (id.value == "") {
        alert('Ingrese un id')
        id.focus();
        return;
    }
    datos.id = id.value;

    let norma = document.querySelector('#AddnormaInput');
    if (norma.value == 0) {
        alert('Ingrese una norma')
        norma.focus();
        return;
    }
    datos.norma = norma.value;
    let descripcion = document.querySelector('#AdddescripcionInput');
    if (descripcion.value == "") {
        alert('Ingrese una descripción')
        descripcion.focus();
        return;
    }
    datos.descripcion = descripcion.value;
    let precio = document.querySelector('#AddprecioInput');
    if (precio.value == "") {
        alert('Ingrese un precio')
        precio.focus();
        return;
    }
    datos.precio = precio.value;
    let fecha = document.querySelector('#AddfechaPrecioInput');
    if (fecha.value == "") {
        alert('Ingrese una fecha')
        fecha.focus();
        return;
    }

    datos.precioFecha = FormateoFecha(fecha.value);

    let unidad = document.querySelector('#AddunidadInput');
    if (unidad.value == "") {
        alert('Ingrese una unidad')
        unidad.focus();
        return;
    }
    datos.unidad = unidad.value;

    let json = JSON.stringify(datos);
    console.log(json);

    let url = "../ws/Materiales/wsAddMaterial.php";
    $.post(url, json, (responseText, status) => {
        try {

            if (status == "success") {
                console.log(responseText);
                let resp = JSON.parse(responseText);
                console.log(resp)
                if (resp.estado == "OK") {
                    alert("Material agregado.");
                    var inputFile = document.getElementById('AddimagenInput');
                    if (inputFile.value) {
                        AddAgregarImagen();
                    }

                    AddCerrarModal();
                    opcion('materiales');
                    setTimeout(() => {
                        GetMateriales();
                    }, 800);
                } else {
                    alert("¡Este código ya existe!")
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
function CambioEstatus(id, estatus) {
    const datos = {};

    datos.id = id;
    if (estatus == 1) {
        datos.estatus = "Inactivo";
    } else {
        datos.estatus = "Activo";
    }
    let json = JSON.stringify(datos);

    switch (parseInt(estatus)) {
        case 0: {
            let conF = confirm("¿Activar este material?")
            if (conF) {
                let url = "../ws/Materiales/wsCambiarStatus.php";
                $.post(url, json, (responseText, status) => {
                    try {

                        if (status == "success") {
                            console.log(responseText);
                            let resp = JSON.parse(responseText);
                            console.log(resp)
                            paginaActual = 1;
                            GetMateriales();
                            if (resp.estado == "OK") {
                                alert("¡Material activo!");
                            }
                        } else {
                            throw e = status;
                        }
                    } catch (error) {
                        alert("Error: " + error)
                    }
                });
            }
            break;
        }

        case 1: {
            let con = confirm("¿Eliminar este material?")
            if (con) {
                con = confirm("¿Está seguro de que desea eliminar este material?")
                if (con) {
                    let url = "../ws/Materiales/wsCambiarStatus.php";
                    $.post(url, json, (responseText, status) => {
                        try {

                            if (status == "success") {
                                console.log(responseText);
                                let resp = JSON.parse(responseText);
                                console.log(resp)
                                GetMateriales();
                                paginaActual = 1;
                                if (resp.estado == "OK") {
                                    alert("¡Material eliminado!");
                                }
                            } else {
                                throw e = status;
                            }
                        } catch (error) {
                            alert("Error: " + error)
                        }
                    });
                }
            }
            break;
        }


        default: {
            console.error("Error")
        }
    }

}
function GetBuscarMateriales() {
    paginaActual = 1;
    const datos = {};
    let buscar = document.querySelector('#searchInput');
    let estatus = document.getElementById('ValCheEsta').checked;
    let unidad = document.getElementById('selectUnidad');

    datos.buscar = buscar.value;
    datos.unidad = unidad.value;
    if (estatus) {
        datos.estatus = 1;
    } else {
        datos.estatus = 0;
    }
    let json = JSON.stringify(datos);

    let url = "../ws/Materiales/wsBuscarMaterial.php";
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

        }
    });
}

function paginaAnterior() {
    if (paginaActual > 1) {
        paginaActual--;

        GetMateriales();
    }
}
function NoPag(pagi) {
    paginaActual = pagi;
    GetMateriales();

}
function obtenerTotalPaginas(totalDatos, tamanoPagina) {
    return Math.ceil(totalDatos / tamanoPagina);
}
function paginaSiguiente() {
    // Suponiendo que tienes el total de páginas disponible en alguna variable
    // Debes implementar esta función

    if (paginaActual < totalPag) {
        paginaActual++;
        GetMateriales();
    }
}

function GetMateriales() {

    const datos = {};
    let buscar = document.querySelector('#searchInput');
    datos.buscar = buscar.value;
    let estatus = document.getElementById('ValCheEsta').checked;
    let unidad = document.getElementById('selectUnidad');
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

function GetFiltrarUnidad() {
    paginaActual = 1;
    const datos = {};
    let buscar = document.querySelector('#searchInput');

    let unidad = document.querySelector('#selectUnidad');
    let estatus = document.getElementById('ValCheEsta').checked;
    datos.buscar = buscar.value;
    datos.unidad = unidad.value;
    if (estatus) {
        datos.estatus = 1;
    } else {
        datos.estatus = 0;
    }
    let json = JSON.stringify(datos);

    let url = "../ws/Materiales/wsFiltrarAllMateriales.php";
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

        }
    });
}

function mostrarDatosEnTabla(datos, paginaActual, tamanoPagina) {
    let totalPaginas = obtenerTotalPaginas(datos.length, tamanoPagina);

    totalPag = totalPaginas;
    // Obtener el cuerpo de la tabla
    let tbody = document.getElementById("tabla-materiales").getElementsByTagName("tbody")[0];


    tbody.innerHTML = "";
    if (datos == "N") {
        let fila = document.createElement("tr");
        fila.innerHTML = `
        <td colspan="8">Sin resultados</td>
        `;
        tbody.appendChild(fila);
        return; // Detener la ejecución de la función si no hay datos
    }

    // Calcular el índice de inicio y final de los datos a mostrar en esta página
    let startIndex = (paginaActual - 1) * tamanoPagina;
    let endIndex = Math.min(startIndex + tamanoPagina, datos.length);
    // Iterar sobre los datos y agregar filas a la tabla
    for (let i = startIndex; i < endIndex; i++) {
        let material = datos[i];
        let fila = document.createElement("tr");
        fila.classList.add("fila")
        fila.addEventListener("mouseover", () => mostrarValores(fila));
        fila.addEventListener("mouseout", () => ocultarValores(fila));
        // Agregar las celdas a la fila
        fila.innerHTML = `
            <td class="Code">${material.codigo}</td>
            <td>${(!material.norma == "") ? material.norma : "---"}</td>
            <td>${(!material.descripcion == "") ? material.descripcion : "---"}</td>
            <td>$ ${(!material.precio == "") ? material.precio : "---"}</td>
            <td>${(!material.fechaprecio == "") ? material.fechaprecio : "---"}</td>
            <td>${(!material.unidad == "") ? material.unidad : "---"}</td>
            <td class="estatus">
            <div style="display: flex; justify-content: space-around; align-items: center;">
            <div class="miDiv imaCuadro">
                <img class="imagenPreview" src="../Materiales/118" style="border: black solid .2rem; background-color: black; " height="100%" width="92%">
            </div>
        </div>
        <div class="valores" style="display: none; justify-content: space-around; align-items: center;">
            <img class=" miImagen" style="cursor: pointer;" src="../img/imageviewgreen_24px.png" alt="Mostrar Imagen" onmouseover="mostrarDiv(this)" onmouseout="ocultarDiv(this)">

            
                <img style="cursor: pointer;" src="../img/edit_rowgreen_24px.png" alt="Modificar" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificar(${material.codigo},'${material.norma}','${material.descripcion}',${material.precio},'${material.fechaprecio}','${material.unidad}')">
                <img style="cursor: pointer;" onclick="CambioEstatus(${material.codigo},${material.estatus})" src="${material.estatus == 1 ? '../img/checkedgreen_24px.png' : '../img/uncheckedgreen_24px.png'}" alt="Checked">
                </div>
                </div>
            </td>


            
        `;

        // Agregar la fila a la tabla
        tbody.appendChild(fila);

    }
    actualizarPaginacion(datos.length, paginaActual, tamanoPagina);
}

function actualizarPaginacion(totalDatos, paginaActual, tamanoPagina) {
    let paginationList = document.getElementById("pagination-list");
    paginationList.innerHTML = ""; // Limpiar el contenido existente

    // Calcular el número total de páginas
    let totalPaginas = Math.ceil(totalDatos / tamanoPagina);

    // Definir el rango de páginas que deseas mostrar antes y después de la página actual
    let rangoMostrar = 2; // Puedes ajustar este valor según tu preferencia

    // Crear botón "Previous"
    let liPrev = document.createElement("li");
    liPrev.classList.add("page-item");
    liPrev.innerHTML = `<button class="page-link" onclick="paginaAnterior()"><i class="fa-solid fa-angles-left"></i></button>`;
    paginationList.appendChild(liPrev);

    // Generar enlaces de página
    for (let i = Math.max(1, paginaActual - rangoMostrar); i <= Math.min(totalPaginas, paginaActual + rangoMostrar); i++) {
        let li = document.createElement("li");
        li.classList.add("page-item");
        if (i === paginaActual) {
            li.classList.add("active");
        }
        li.innerHTML = `<button class="page-link" onclick="NoPag(${i})">${i}</button>`;
        paginationList.appendChild(li);
    }

    // Crear botón "Next"
    let liNext = document.createElement("li");
    liNext.classList.add("page-item");
    liNext.innerHTML = `<button class="page-link" onclick="paginaSiguiente()"><i class="fa-solid fa-angles-right"></i></button>`;
    paginationList.appendChild(liNext);
}

function mostrarDiv(imagen) {

    // Obtener el div asociado a la imagen
    var div = imagen.parentElement.parentElement.querySelector(".miDiv");
    var id = imagen.parentElement.parentElement.parentElement.querySelector(".Code").innerHTML;
    // Mostrar el div
    rutaCarpeta = "../Materiales/" + id;
    cargarImagenCuadro(div)

    div.style.display = "block";

}

function ocultarDiv(imagen) {
    // Obtener el div asociado a la imagen
    var div = imagen.parentElement.parentElement.querySelector(".miDiv");
    // Ocultar el div
    div.style.display = "none";
}

function mostrarValores(fila) {
    fila.getElementsByClassName('valores')[0].style.display = 'flex';
}

function ocultarValores(fila) {
    fila.getElementsByClassName('valores')[0].style.display = 'none';
}

function FormateoFecha(fecha) {

    // Dividir la cadena de fecha en día, mes y año
    let partesFecha = fecha.split("/");
    let dia = partesFecha[0];
    let mes = partesFecha[1];
    let año = partesFecha[2];

    // Crear un nuevo objeto Date
    let fechaFormateada = new Date(`${año}/${mes}/${dia}`);

    // Extraer el año, mes y día de la fecha formateada
    let añoFormateado = fechaFormateada.getFullYear();
    let mesFormateado = (fechaFormateada.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
    let diaFormateado = fechaFormateada.getDate().toString().padStart(2, '0');

    // Crear la fecha formateada en el formato deseado
    return fechaFinal = `${añoFormateado}-${mesFormateado}-${diaFormateado}`;
}

function AddlimpiarModal() {
    let id = document.querySelector('#AddidInput').value = "";
    let norma = document.querySelector('#AddnormaInput').value = "";
    let descripcion = document.querySelector('#AdddescripcionInput').value = "";
    let precio = document.querySelector('#AddprecioInput').value = "";
    let unidad = document.querySelector('#AddunidadInput').value = "";
    let imagen = document.querySelector('#AddimagenInput').value = "";
    let img = document.querySelector('#AddimagenPreview');
    img.src = "img/sinimagen.png";
    img.alt = "hola";

    // Obtener la fecha actual
    let fechaActual = new Date();

    // Obtener el año, mes y día de la fecha actual
    let año = fechaActual.getFullYear();
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
    let dia = fechaActual.getDate().toString().padStart(2, '0');

    // Formatear la fecha como "YYYY-MM-DD"
    let fechaFormateada = `${año}-${mes}-${dia}`;

    // Establecer el valor del campo de entrada con la fecha formateada
    document.querySelector('#AddfechaPrecioInput').value = fechaFormateada;
}

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
            alert('El archivo seleccionado no es una imagen en formato PNG o JPG.');
        }
    } else {
        alert('El tamaño del archivo excede el límite de 200 KB.');
    }

}
function UpdAgregarImagen() {
    let id = document.querySelector('#UpdidInput').value;
    var inputFile = document.getElementById('UpdimagenInput');

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
            alert('El archivo seleccionado no es una imagen en formato PNG o JPG.');
        }
    } else {
        alert('El tamaño del archivo excede el límite de 200 KB.');
    }

}

function validaExisteMaterial() {

    let datos = {};
    let id = document.querySelector('#AddidInput');
    var existe = false;
    if (id.value == "") {
        alert("Agrega el Codigo del Material")

    } else {
        datos.id = id.value;
        let json = JSON.stringify(datos);
        let url = "../ws/Materiales/wsCheckMaterial.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {

                    let resp = JSON.parse(responseText);

                    if (resp.estado == "OK") {
                        // Llamar a la función para mostrar los datos en la tabla

                        console.log(resp.datos);
                        existe = true;


                    } else {
                        // Mostrar mensaje de error si el estado no es "OK"


                    }
                } else {
                    throw e = status;
                }
            } catch (error) {

            }
        })
        return existe
    }

}

function AddmostrarImagen(input) {
    const imagenPreview = document.getElementById('AddimagenPreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagenPreview.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function UpdmostrarImagen(input) {
    const imagenPreview = document.getElementById('UpdimagenPreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagenPreview.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function valStatus() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggleon_26px.png"
    } else {
        imgcheck.src = "../img/toggleoff_26px.png"
    }
}
function llenarModalModificar(id, norma, descripcion, precio, fechaPrecio, unidad, imagen) { //Llenado de datos en el modal


    let idM = document.querySelector('#UpdidInput');
    let idA = document.querySelector('#idAnterior');
    let normaM = document.querySelector('#UpdnormaInput');
    let descripcionM = document.querySelector('#UpddescripcionInput');
    let precioM = document.querySelector('#UpdprecioInput');
    let unidadM = document.querySelector('#UpdunidadInput');
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


    //Fecha
    if (fechaPrecio) {
        document.querySelector('#UpdfechaPrecioInput').value = FormateoFecha(fechaPrecio);
    } else {
        // Obtener la fecha actual
        let fechaActual = new Date();

        // Obtener el año, mes y día de la fecha actual
        let año = fechaActual.getFullYear();
        let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
        let dia = fechaActual.getDate().toString().padStart(2, '0');

        // Formatear la fecha como "YYYY-MM-DD"
        let fechaFormateada = `${año}-${mes}-${dia}`;

        // Establecer el valor del campo de entrada con la fecha formateada
        document.querySelector('#UpdfechaPrecioInput').value = fechaFormateada;
    }
}
var rutaCarpeta = '../Materiales/1';
function cargarImagen() {
    // Obtener la lista de archivos en la carpeta
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
async function obtenerArchivosEnCarpeta(rutaCarpeta) {
    // Realizar una solicitud al servidor para obtener la lista de archivos en la carpeta

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

function UpdMaterialValidar() {

    const datos = {};
    let idA = document.querySelector('#idAnterior');
    let id = document.querySelector('#UpdidInput');
    if (id.value == "") {
        alert('Ingrese un id')
        id.focus();
        return;
    }
    datos.idA = idA.value;
    datos.id = id.value;
    let norma = document.querySelector('#UpdnormaInput');
    if (norma.value == 0) {
        alert('Ingrese una norma')
        norma.focus();
        return;
    }
    datos.norma = norma.value;
    let descripcion = document.querySelector('#UpddescripcionInput');
    if (descripcion.value == "") {
        alert('Ingrese una descripción')
        descripcion.focus();
        return;
    }
    datos.descripcion = descripcion.value;
    let precio = document.querySelector('#UpdprecioInput');
    if (precio.value == "") {
        alert('Ingrese un precio')
        precio.focus();
        return;
    }
    datos.precio = precio.value;
    let fecha = document.querySelector('#UpdfechaPrecioInput');
    if (fecha.value == "") {
        alert('Ingrese una fecha')
        fecha.focus();
        return;
    }

    datos.precioFecha = FormateoFecha(fecha.value);

    let unidad = document.querySelector('#UpdunidadInput');
    if (unidad.value == "") {
        alert('Ingrese una unidad')
        unidad.focus();
        return;
    }
    datos.unidad = unidad.value;

    let json = JSON.stringify(datos);
    console.log(json)
    var inputFile = document.getElementById('UpdimagenInput');
    if (inputFile.value) {
        UpdAgregarImagen();
    }
    let url = "../ws/Materiales/wsUpdMaterial.php";
    $.post(url, json, (responseText, status) => {
        try {

            if (status == "success") {
                console.log(responseText);
                let resp = JSON.parse(responseText);

                if (resp.estado == "OK") {
                    alert("Material modificado");

                    UpdateCerrarModal();

                    opcion('materiales');
                    setTimeout(() => {
                        GetMateriales();
                    }, 800);
                } else {
                    alert("¡Este código ya existe!")
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
function AddCerrarModal() {

    $('#AgregarModal').modal('hide');
}

function UpdateCerrarModal() {

    $('#EditarModal').modal('hide');
}
