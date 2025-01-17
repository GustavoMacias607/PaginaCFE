//Mensajes
let msgEliminar = "Materal deshabilitado";
let msgActivar = "Material habilitado";
let msgAgregar = "Material agregado";
let msgModificar = "Material modificado";

let msgPesoMaximo = "Maximo 200kb";
let msgNoEsImagen = "No es una imagen";

var estatusMateriales = 1;
let datosObjetoMateriales = [];

let ExportarExcel = [];

let unidadMateriales;
//Metodo que valida el formulario para agregar materiales y al mismo tiempo agrega el material
function AddMaterialValidar() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let id = document.querySelector('#AddidInput');
    if (id.value == "") {
        id.classList.add("inputVacio");
        id.placeholder = "Requerido el ID"
        vacio = true;
        PrimerValorVacio = id;
    }
    datos.id = id.value;

    let norma = document.querySelector('#AddnormaInput');
    if (norma.value == "") {
        norma.classList.add("inputVacio");
        norma.placeholder = "Requerida la Norma"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = norma;
        }

    }
    datos.norma = norma.value;
    let descripcion = document.querySelector('#AdddescripcionInput');
    if (descripcion.value == "") {
        descripcion.classList.add("inputVacio");
        descripcion.placeholder = "Requerida la Descripción"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = descripcion;
        }

    }
    datos.descripcion = descripcion.value;
    let precio = document.querySelector('#AddprecioInput');
    if (precio.value == "") {
        precio.classList.add("inputVacio");
        precio.placeholder = "Requerido el Precio"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = precio;
        }
    }
    datos.precio = precio.value;
    let fecha = document.querySelector('#AddfechaPrecioInput');
    if (fecha.value == "") {
        fecha.classList.add("inputVacio");
        fecha.placeholder = "Requerida la Fecha"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = fecha;
        }

    }
    datos.precioFecha = FormateoFecha(fecha.value);

    let familia = document.querySelector('#AddfamiliaInput');
    if (familia.value == "") {
        familia.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = familia;
        }

    }
    datos.familia = familia.value;
    let unidad = document.querySelector('#AddunidadInput');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        unidad.placeholder = "Requerida la unidad"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = unidad;
        }

    }
    datos.unidad = unidad.value;

    console.log(datos)
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
        id.placeholder = "Requerido el ID"
        vacio = true;
        PrimerValorVacio = id;
    }
    datos.idA = idA.value;
    datos.id = id.value;
    datos.idCambiado = idCambiado;
    let norma = document.querySelector('#UpdnormaInput');
    if (norma.value == "") {
        norma.classList.add("inputVacio");
        norma.placeholder = "Requerida la Norma"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = norma;
        }
    }
    datos.norma = norma.value;
    let descripcion = document.querySelector('#UpddescripcionInput');
    if (descripcion.value == "") {
        descripcion.classList.add("inputVacio");
        descripcion.placeholder = "Requerida la Descripción"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = descripcion;
        }
    }
    datos.descripcion = descripcion.value;
    let precio = document.querySelector('#UpdprecioInput');
    if (precio.value == "") {
        precio.classList.add("inputVacio");
        precio.placeholder = "Requerido el Precio"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = precio;
        }
    }
    datos.precio = precio.value;
    let fecha = document.querySelector('#UpdfechaPrecioInput');
    if (fecha.value == "") {
        fecha.classList.add("inputVacio");
        fecha.placeholder = "Requerida la Fecha"
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = fecha;
        }
    }
    datos.precioFecha = FormateoFecha(fecha.value);

    let familia = document.querySelector('#UpdfamiliaInput');
    if (familia.value == "") {
        familia.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = familia;
        }

    }
    datos.familia = familia.value;
    let unidad = document.querySelector('#UpdunidadInput');
    if (unidad.value == "") {
        unidad.classList.add("inputVacio");
        unidad.placeholder = "Requerida la unidad"
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
                console.log(resp.estado)
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


//Metodo para hacer la consulta de los materiales tomando en cuanta los filtros
function GetMateriales() {

    let json = "";
    let url = "../ws/Materiales/wsGetMateriales.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    // Llamar a la función para mostrar los datos en la tabla
                    ExportarExcel = resp.datos.map(obj => {
                        return {
                            codigo: obj.codigo,
                            norma: obj.norma,
                            descripcion: obj.descripcion,
                            precio: obj.precio,
                            fechaprecio: obj.fechaprecio,
                            familia: obj.familia,
                            unidad: obj[5],
                            estatus: obj.estatus
                        };
                    });
                    datosObjetoMateriales = resp.datos;
                    llenarTablaMateriales();
                    filterDataMateriales();
                    llenarUnidadTablaMateriales();
                    document.getElementById('upload').addEventListener('change', handleFile, false);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}


function displayTableMateriales(page) {
    const tableBody = document.getElementById("table-bodyMateriales");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);
    if (paginatedData.length > 0) {
        paginatedData.forEach(record => {
            const formatoMXN = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });

            // Asegurarse de que el precio se formatee correctamente
            const precioFormateado = (record.precio !== undefined && record.precio !== "")
                ? formatoMXN.format(record.precio)
                : "---";

            // Crear un elemento de fila (tr)
            const row = document.createElement('tr');
            row.classList.add('fila');

            // Establecer el contenido HTML de la fila
            row.innerHTML = `
                <td class="Code">${record.codigo}</td>
                <td>${(!record.norma == "") ? record.norma : "Sin norma"}</td>
                <td>${(!record.descripcion == "") ? record.descripcion : "---"}</td>
                <td>${precioFormateado}</td>
                <td>${(!record.fechaprecio == "") ? record.fechaprecio : "---"}</td>
                <td>${(!record.familia == "") ? record.familia : "---"}</td>
                <td>${(!record.unidad == "") ? record.unidad : "---"}</td>
                <td class="estatus">
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <div class="miDiv imaCuadro">
                            <img class="imagenPreview" src="../Materiales/118">
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-around; align-items: center;">
                        <i class="miImagen coloresIcono fa-regular fa-images" style="cursor: pointer;" alt="Mostrar Imagen" onmouseover="mostrarDiv(this)" onmouseout="ocultarDiv(this)"></i>
                        ${record.estatus == 1 ? `<i class="coloresIcono fa-solid fa-pen-to-square" style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#EditarModal" onclick="llenarModalModificar(${record.codigo},'${record.norma}','${record.descripcion}',${record.precio},'${record.fechaprecio}','${record.familia}','${record.unidad}')"></i>` : ``}
                        ${record.estatus == 1 ?
                    `<i class="coloresIcono fa-solid fa-square-check" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.codigo},${record.estatus})"></i>` :
                    `<i class="coloresIcono fa-solid fa-square" style="cursor: pointer;" onclick="AbrirModalConfirm1(); AsignarValores(${record.codigo},${record.estatus})"></i>`
                }
                    </div>
                </td>
            `;

            // Añadir eventos mouseover y mouseout
            row.addEventListener("mouseover", () => mostrarValores(row));
            row.addEventListener("mouseout", () => ocultarValores(row));

            // Añadir la fila al tbody
            tableBody.appendChild(row);
        });
    } else {
        const row = `<tr>
                        <td colspan="8" class="Code">Sin resultados</td>
                     </tr>`;
        tableBody.innerHTML += row;
    }

}

function setupPaginationMateriales() {
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const maxPagesToShow = 5; // Número máximo de páginas a mostrar
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
        // Mostrar todas las páginas si son menos o iguales a 5
        startPage = 1;
        endPage = totalPages;
    } else {
        const middle = Math.floor(maxPagesToShow / 2);

        if (currentPage <= middle) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + middle >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - middle;
            endPage = currentPage + middle;
        }
    }
    if (totalPages > 0) {
        // Botón de "Atrás"
        const prevButton = document.createElement("button");
        prevButton.innerHTML = `<i class="fa-solid fa-angles-left"></i>`;
        prevButton.style.backgroundColor = "#008e5a";
        prevButton.style.color = "#ffffff";
        prevButton.style.border = "3px solid #008e5a";
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayTableMateriales(currentPage);
                setupPaginationMateriales();
            }
        });
        paginationDiv.appendChild(prevButton);
        // Botones de página
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.innerText = i;

            if (currentPage === i) {
                button.className = 'active';
                button.style.color = "#ffffff";
                button.style.border = "3px solid #008e5a";
                button.style.backgroundColor = "#008e5a";
            } else {
                button.style.color = "#008e5a";
                button.style.border = "3px solid #008e5a";
                button.style.backgroundColor = "#ffffff";
            }
            button.addEventListener("click", () => {
                currentPage = i;
                displayTableMateriales(currentPage);
                setupPaginationMateriales();
            });
            paginationDiv.appendChild(button);
        }

        // Botón de "Adelante"
        const nextButton = document.createElement("button");
        nextButton.innerHTML = `<i class="fa-solid fa-angles-right"></i>`;
        nextButton.style.backgroundColor = "#008e5a";
        nextButton.style.color = "#ffffff";
        nextButton.style.border = "3px solid #008e5a";
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTableMateriales(currentPage);
                setupPaginationMateriales();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataMateriales() {
    const searchText = document.getElementById("search-inputMateriales").value.toLowerCase();
    const unidadFilter = document.getElementById("selectUnidadMateriales").value;
    const familiaFilter = document.getElementById("selectFamiliaMateriales").value;
    const statusFilter = estatusMateriales;
    filteredData = datosObjetoMateriales.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesFamilia = familiaFilter ? record.familia == familiaFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus && matchesFamilia;
    });
    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableMateriales(currentPage);
    setupPaginationMateriales();
}

function llenarTablaMateriales() {
    displayTableMateriales(currentPage);
    setupPaginationMateriales();
    const searchInput = document.getElementById("search-inputMateriales");
    searchInput.addEventListener("input", filterDataMateriales);

    const unidadFilter = document.getElementById("selectUnidadMateriales");
    unidadFilter.addEventListener("change", filterDataMateriales);

    const familiaFilter = document.getElementById("selectFamiliaMateriales");
    familiaFilter.addEventListener("change", filterDataMateriales);

    const rowsPerPageSelect = document.getElementById("rows-per-page");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableMateriales(currentPage);
        setupPaginationMateriales();
    });
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



//Metodo para limpiar el modal de agregar material
function AddlimpiarModal() {
    let id = document.querySelector('#AddidInput');
    let norma = document.querySelector('#AddnormaInput');
    let descripcion = document.querySelector('#AdddescripcionInput');
    let precio = document.querySelector('#AddprecioInput');
    let unidad = document.querySelector('#AddunidadInput');
    let familia = document.querySelector('#AddfamiliaInput');
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
    familia.value = "";

    id.placeholder = "";
    norma.placeholder = "";
    descripcion.placeholder = "";
    precio.placeholder = "";

    id.classList.remove("inputVacio");
    norma.classList.remove("inputVacio");
    descripcion.classList.remove("inputVacio");
    precio.classList.remove("inputVacio");
    unidad.classList.remove("inputVacio");
    familia.classList.remove("inputVacio");
}

//Metodo para que se cree la carpeta y se le introduzca la imagen seleccionada a la hora de guardar el material
function AddAgregarImagen() {
    let id = document.querySelector('#AddidInput').value;
    var inputFile = document.getElementById('AddimagenInput');
    let idAnterior = id;
    var file = inputFile.files[0];
    // Verificar el tamaño del archivo (en bytes)
    var maxSizeBytes = 200 * 1024;
    if (file.size <= maxSizeBytes) {
        // Verificar si el archivo es una imagen con formato PNG o JPG
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            var formData = new FormData();
            formData.append('imagen', file);
            formData.append('id', id);
            formData.append('idAnterior', idAnterior);
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

function UpdmostrarImagen(input) {
    const imagenPreview = document.getElementById('UpdimagenPreview');
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
        // Si pasa las validaciones, lee y muestra la imagen
        const reader = new FileReader(); // Crea un lector de archivos
        reader.onload = function (e) {
            imagenPreview.src = e.target.result;
            imagenPreview.src = e.target.result; // Muestra la imagen en el preview
        }
        reader.readAsDataURL(input.files[0]);
        reader.readAsDataURL(archivo); // Lee el archivo seleccionado
    }
}

//Metodo para cambiar la imagen del toggle a la hora de darle clic para cambiar entre materiales activos e inactivos
function valStatus() {
    var checkbox = document.getElementById('ValCheEsta');
    var imgcheck = document.getElementById('ValEstatus');
    // Deseleccionar el checkbox
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        imgcheck.src = "../img/toggle_on_35px.png";
        estatusMateriales = 1;
    } else {
        imgcheck.src = "../img/toggle_off_35px.png";
        estatusMateriales = 0;
    }
    filterDataMateriales();
}

//Metodo para que se llene el modal de modificar con los datos seleccionados de la fila
//Recibe los datos del material
function llenarModalModificar(id, norma, descripcion, precio, fechaPrecio, familia, unidad) { //Llenado de datos en el modal


    let idM = document.querySelector('#UpdidInput');
    let idA = document.querySelector('#UpdidAnteriorMaterial');
    let normaM = document.querySelector('#UpdnormaInput');
    let descripcionM = document.querySelector('#UpddescripcionInput');
    let precioM = document.querySelector('#UpdprecioInput');
    let unidadM = document.querySelector('#UpdunidadInput');
    let familiaM = document.querySelector('#UpdfamiliaInput');
    let inputImg = document.querySelector('#UpdimagenInput');

    inputImg.value = "";
    idM.value = id;
    idA.value = id;
    normaM.value = norma;
    descripcionM.value = descripcion;
    precioM.value = precio;
    unidadM.value = unidad;
    familiaM.value = familia;
    rutaCarpeta = "../Materiales/" + id;
    cargarImagen()

    for (var i = 0; i < familiaM.options.length; i++) {
        if (familiaM.options[i].value === familia) {
            familiaM.options[i].selected = true;
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
    unidadM.placeholder = "";
    precioM.placeholder = "";

    idM.classList.remove("inputVacio");
    normaM.classList.remove("inputVacio");
    descripcionM.classList.remove("inputVacio");
    precioM.classList.remove("inputVacio");
    unidadM.classList.remove("inputVacio");
    familiaM.classList.remove("inputVacio");
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
    $('#AgregarModalBasi').modal('hide');
}
//Metodo para cerrar el modal de modificar material
function UpdateCerrarModal() {

    $('#EditarModal').modal('hide');
    $('#EditarModalBasi').modal('hide');
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
    console.log("hola");
    let estatus = document.getElementById('ValCheEsta').checked;
    console.log(estatus);

    if (estatus) {
        $('#confirmDeleteModal').modal('show');
    } else {
        $('#confirmActivationModal').modal('show');
    }

}


// Exportar a Excel a partir de un objeto
function ExportarMateriales() {
    const fechaActual = new Date();

    // Obtener el día, mes y año
    const dia = fechaActual.getDate();        // Día del mes (1-31)
    const mes = fechaActual.getMonth() + 1;
    const ano = fechaActual.getFullYear();    // Mes (0-11, por lo que le sumamos 1)
    const ws = XLSX.utils.json_to_sheet(ExportarExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hoja1");
    XLSX.writeFile(wb, `Reporte Materiales ${dia}-${mes}-${ano}.xlsx`);
};

// Función para importar y convertir a objeto, y luego mostrar en la tabla
function handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function async(event) {
        const datos = new Uint8Array(event.target.result);
        const workbook = XLSX.read(datos, {
            type: 'array'
        });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir la hoja de Excel a un objeto JSON
        const jsonObject = XLSX.utils.sheet_to_json(sheet);

        // Aquí tienes el objeto JSON sin manipular la tabla HTML

        // Puedes retornar el objeto JSON o usarlo como desees

        await = MetodoEspera(jsonObject);
        return jsonObject;
    };
    reader.readAsArrayBuffer(file);

}

function MetodoEspera(jsonObject) {
    datosObjetoMateriales = actualizarFechaMateriales(jsonObject, ExportarExcel);
    llenarTablaMateriales();
    filterDataMateriales();
}

function actualizarFechaMateriales(datosExcel, datosBD) {
    // Obtener la fecha actual
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; // Sumar 1 porque los meses empiezan en 0
    const año = fechaActual.getFullYear();
    const fechaHoy = `${año}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`; // Formato YYYY-MM-DD

    // Recorrer los datos de Excel
    datosExcel.forEach((materialExcel) => {
        // Buscar si hay un material en la base de datos con el mismo codigo
        const materialBD = datosBD.find(material => material.codigo === materialExcel.codigo);

        if (materialBD) {
            // Si el código coincide pero el precio es distinto
            if (materialExcel.precio !== materialBD.precio) {
                // Actualizar solo la fecha de precio en el material de Excel
                materialExcel.fechaprecio = fechaHoy;
            }
        }
    });
    // Retornar el objeto de datosExcel con las fechas actualizadas y precios intactos
    return datosExcel;
}







function llenarUnidadTablaMateriales() {
    const unidadFilter = document.getElementById("selectUnidadMateriales"); // El select donde agregarás las opciones
    let json = "";
    let url = "";
    url = "../ws/Materiales/wsGetUnidades.php";

    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                    //Limpiar las opciones existentes del select(por si hay alguna previamente)
                    unidadFilter.innerHTML = "";
                    unidadMateriales = resp.datos;

                    //Crear una opción predeterminada o vacía
                    const optionDefault = document.createElement("option");
                    optionDefault.value = "";
                    optionDefault.textContent = "Todo";
                    unidadFilter.appendChild(optionDefault);

                    //Ordenar las unidadMateriales alfabéticamente, asegurando que se eliminen los espacios innecesarios
                    unidadMateriales.sort((a, b) =>
                        a.unidad.trim().localeCompare(b.unidad.trim(), 'es', { sensitivity: 'base' })
                    );

                    //Iterar sobre las unidadMateriales obtenidas y añadirlas al select
                    unidadMateriales.forEach(unidad => {
                        //Crear un nuevo elemento < option >
                        const option = document.createElement("option");

                        //Usar el valor de la unidad para el atributo 'value' y el texto visible de la opción
                        option.value = unidad.unidad;
                        option.textContent = unidad.unidad;

                        //Añadir la opción al select
                        unidadFilter.appendChild(option);
                    });
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function mostrarSugerenciasMateriales(input, inputUnidad) {
    let sugerenciasDiv;
    if (inputUnidad == "AddUnidad") {
        sugerenciasDiv = document.getElementById('Addsugerencias');
    } else if (inputUnidad == "UpdUnidad") {
        sugerenciasDiv = document.getElementById('Updsugerencias');
    }

    sugerenciasDiv.innerHTML = ''; // Limpiar sugerencias previas

    const filtro = input.value.toLowerCase(); // Texto que está escribiendo el usuario
    const sugerenciasFiltradas = filtro === '' ? unidadMateriales : unidadMateriales.filter(unidad =>
        unidad.unidad.toLowerCase().includes(filtro)
    );

    // Ocultar el cuadro de sugerencias si no hay coincidencias o si la única coincidencia es exactamente igual al texto ingresado
    if (sugerenciasFiltradas.length === 0 || (sugerenciasFiltradas.length === 1 && sugerenciasFiltradas[0].unidad.toLowerCase() === filtro)) {
        sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro de sugerencias
        return; // Salir de la función si no hay sugerencias o la única sugerencia coincide exactamente
    } else {
        sugerenciasDiv.classList.add('activado'); // Mostrar el cuadro de sugerencias si hay coincidencias
    }

    // Crear los elementos de sugerencia y agregarlos al cuadro
    sugerenciasFiltradas.forEach(unidad => {
        const div = document.createElement('div');
        div.classList.add('sugerencia-item');
        div.textContent = unidad.unidad;
        div.onclick = () => seleccionarSugerenciaMateriales(unidad.unidad, inputUnidad, sugerenciasDiv);
        sugerenciasDiv.appendChild(div);
    });
}

// Función para ocultar el cuadro de sugerencias al perder el foco
function ocultarSugerenciasMateriales(inputUnidad) {
    setTimeout(() => {
        let sugerenciasDiv;
        if (inputUnidad == "AddUnidad") {
            sugerenciasDiv = document.getElementById('Addsugerencias');
        } else if (inputUnidad == "UpdUnidad") {
            sugerenciasDiv = document.getElementById('Updsugerencias');
        }
        sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro de sugerencias
    }, 200);
}

function seleccionarSugerenciaMateriales(unidad, inputUnidad, sugerenciasDiv) {
    console.log(unidad, inputUnidad, sugerenciasDiv);
    let input;
    if (inputUnidad == "AddUnidad") {
        input = document.getElementById('AddunidadInput');
    } else if (inputUnidad == "UpdUnidad") {
        input = document.getElementById('UpdunidadInput');
    }
    input.value = unidad; // Colocar la unidad seleccionada en el input
    sugerenciasDiv.innerHTML = ''; // Limpiar las sugerencias
    sugerenciasDiv.classList.remove('activado'); // Ocultar el cuadro
}




