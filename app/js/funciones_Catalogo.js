var listaMateriales = [];
var datosCatalogo = {};
let MaterialInactivo = false;

//Mensajes de alertas
let msgGuardarMaterialInactivo = "Material inactivo";
let msgGuardarSinCantidad = "Material sin cantidad";
let msgMaterialYaHaSidoAgregado = "Material ya ha sido agregado";
let mgsCatalogoAgregado = "Catalogo guardado";


//Metodo para llenar la tabla con el catalogo
function AgregarDatosTablaConceptoCatalogo() {
    //Llena tabla concepto de la pagina catalogo
    let tbody = document.getElementById("tabla-conceptosCatalogo").getElementsByTagName("tbody")[0];
    let fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${datosCatalogo.id}</td> 
        <td>${datosCatalogo.nombre}</td>
        <td>${datosCatalogo.tipo}</td>
        <td>${datosCatalogo.plazo}</td>
        <td>${datosCatalogo.unidad}</td>`;
    tbody.appendChild(fila);


    //Llenar tabla materiales de la pagina catalogo
    const datos = {};
    datos.id = datosCatalogo.id;

    let json = JSON.stringify(datos);
    let url = "../ws/Catalogo/wsGetCatalogo.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {

                let resp = JSON.parse(responseText);

                if (resp.estado == "OK") {
                    materiales = resp.datos;
                    materiales.forEach(material => {
                        let valores = {
                            idconcepto: material.idconcepto,
                            cantidadm: material.cantidadm,
                            codigo: material.codigo,
                            norma: material.norma ? material.norma : "---",
                            descripcion: material.descripcion,
                            precio: material.precio,
                            fechaprecio: (material.fechaprecio ? material.fechaprecio : "---"),
                            unidad: material.unidad,
                            estatus: material.estatus
                        };
                        listaMateriales.push(valores);

                    })

                    llenarTablaPorModal();
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function AgregarCatalogoConcepto() {

    let tbody = document.getElementById("tabla-materiales").getElementsByTagName("tbody")[0];
    if (MaterialInactivo) {
        mensajePantalla(msgGuardarMaterialInactivo, false);
        return;
    }
    for (let i = 0; i < tbody.rows.length; i++) {
        let fila = tbody.rows[i];
        if (fila.cells[7].textContent == 0) {
            mensajePantalla(msgGuardarSinCantidad, false);
            return;
        }
    }
    EliminarMaterialesConcepto();
    for (let i = 0; i < tbody.rows.length; i++) {
        let fila = tbody.rows[i];
        let datos = {};

        // Obtener datos de cada celda y agregar al objeto filaObjeto
        datos.idConcepto = datosCatalogo.id;
        datos.idMaterial = fila.cells[0].textContent;
        datos.cantidad = fila.cells[7].textContent;
        let json = JSON.stringify(datos);
        let url = "../ws/Catalogo/wsAddCatalogo.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    if (resp.estado == "OK") {

                        mensajePantalla(mgsCatalogoAgregado, true);

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


function EliminarMaterialesConcepto() {
    datos = {}
    datos.id = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/Catalogo/wsDelCatalogo.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                if (resp.estado == "OK") {
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}
//Metodo para hacer la consulta de los materiales tomando en cuanta los filtros
function GetMaterialesCatalogo() {
    const datos = {};
    let buscar = document.querySelector('#searchInput');
    let unidad = document.getElementById('selectUnidad');
    datos.buscar = buscar.value;
    datos.estatus = true;
    datos.unidad = unidad.value;
    let json = JSON.stringify(datos);
    let url = "../ws/Materiales/wsGetMateriales.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {

                let resp = JSON.parse(responseText);

                if (resp.estado == "OK") {

                    //Llamar a la función para mostrar los datos en la tabla

                    mostrarDatosEnTablaMatCatalogo(resp.datos, paginaActual, tamanoPagina);
                } else {
                    // Mostrar mensaje de error si el estado no es "OK"
                    mostrarDatosEnTablaMatCatalogo(resp.mensaje, paginaActual, tamanoPagina);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.error(error);
        }
    });
}
function mostrarDatosEnTablaMatCatalogo(datos, paginaActual, tamanoPagina) {
    let totalPaginas = obtenerTotalPaginas(datos.length, tamanoPagina);
    totalPag = totalPaginas;
    let tbody = document.getElementById("tabla-MaterialesCatalogo").getElementsByTagName("tbody")[0];
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
        fila.style.cursor = "pointer";
        fila.addEventListener("mouseover", () => mostrarValores(fila));
        fila.addEventListener("mouseout", () => ocultarValores(fila));
        fila.addEventListener("dblclick", () => valoresFila(fila));
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
           <td>
            <div style="display: flex; justify-content: space-around; align-items: center; ">
                    <div class="miDiv imaCuadro">
                        <img class="imagenPreview" src="../Materiales/118" >
                    </div>
                </div>
                        <div class="" style="display: flex; justify-content: space-around; align-items: center; ">
                            <i class="miImagen coloresIcono fa-regular fa-images" style="cursor: pointer;" alt="Mostrar Imagen" onmouseover="mostrarDivCatalogo(this,${material.codigo})" onmouseout="ocultarDivCatalogo(this)"></i>
                             
                        </div>
                </div>
            </td >
             `;
        // Agregar la fila a la tabla
        tbody.appendChild(fila);

    }
    actualizarPaginacionCatalogoMateriales(datos.length, paginaActual, tamanoPagina);
}
//Metodo para regresar una pagina en la paginacion
function paginaAnteriorCatMat() {
    if (paginaActual > 1) {
        paginaActual--;
        GetMaterialesCatalogo();
    }
}

//Metodo para cambiar de pagona dando clic a la paginacion
//Recobe el numero de pagina al cual se cambiara
function NoPagCatMat(pagi) {
    paginaActual = pagi;
    GetMaterialesCatalogo();
}

//Metodo para cambiar a la pagina siguiente en la paginacion
function paginaSiguienteCatMat() {
    if (paginaActual < totalPag) {
        paginaActual++;
        GetMaterialesCatalogo();
    }
}

// Metodo para obtener cuantas paginas tendra la paginacion
// Recibe el total de datos y el numero de registros a mostrar en la tabla
function obtenerTotalPaginas(totalDatos, tamanoPagina) {
    return Math.ceil(totalDatos / tamanoPagina);
}
function actualizarPaginacionCatalogoMateriales(totalDatos, paginaActual, tamanoPagina) {
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
    liPrev.innerHTML = `<button button onclick = "paginaAnteriorCatMat()" style = "background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;" > <i class="fa-solid fa-angles-left"></i></button > `;
    paginationList.appendChild(liPrev);
    // Generar enlaces de página
    for (let i = Math.max(1, paginaActual - rangoMostrar); i <= Math.min(totalPaginas, paginaActual + rangoMostrar); i++) {
        let li = document.createElement("li");
        if (i === paginaActual) {
            li.classList.add("active");
        }
        li.innerHTML = `<button button style = "color: #008e5a; border: 3px solid #008e5a;" onclick = "NoPagCatMat(${i})" > ${i}</button > `;
        if (i === paginaActual) {
            li.innerHTML = `<button button class="active" style = "color: #ffffff; border: 3px solid #008e5a;" onclick = "NoPagCatMat(${i})" > ${i}</button > `;
        }
        paginationList.appendChild(li);
    }
    let liNext = document.createElement("li");
    liNext.innerHTML = `<button button onclick = "paginaSiguienteCatMat()" style = "background-color: #008e5a; color: #ffffff; border: 3px solid #008e5a;" > <i class="fa-solid fa-angles-right"></i></button > `;
    paginationList.appendChild(liNext);

}


function valoresFila(fila) {
    let materialExiste = false;
    tamanoPagina = 10;
    let celdas = fila.getElementsByTagName("td");

    listaMateriales.forEach(material => {
        console.log(celdas[0].textContent, material.codigo)
        if (celdas[0].textContent == material.codigo) {
            mensajePantalla(msgMaterialYaHaSidoAgregado, false)
            materialExiste = true;
        }
    })

    if (!materialExiste) {
        let valores = {
            idconcepto: datosCatalogo.id,
            cantidadm: 0,
            codigo: celdas[0].textContent,
            norma: celdas[1].textContent,
            descripcion: celdas[2].textContent,
            precio: celdas[3].textContent,
            fechaprecio: celdas[4].textContent,
            unidad: celdas[5].textContent,
            estatus: true
        };

        listaMateriales.push(valores);
        llenarTablaPorModal();
        CerrarModalMateriales();
    }

}

function llenarTablaPorModal() {
    MaterialInactivo = false;
    let lecturaMaterial = document.getElementById("LecturaMaterial");

    let tbody = document.getElementById("tabla-materiales").getElementsByTagName("tbody")[0];
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    listaMateriales.forEach(element => {
        let fila = document.createElement("tr");
        fila.classList.add("fila")
        if (element.estatus != 1) {
            fila.classList.add("filaMaterialInactivo")
            MaterialInactivo = true;
        }

        fila.addEventListener("mouseover", () => mostrarValores(fila));
        fila.addEventListener("mouseout", () => ocultarValores(fila));
        fila.innerHTML = `
            <td td > ${element.codigo}</td > 
            <td>${element.norma}</td> 
            <td>${element.descripcion}</td>
            <td>${element.precio}</td>
            <td>${element.fechaprecio}</td>
            <td>${element.unidad}</td>
            <td>
            <div style="display: flex; justify-content: space-around; align-items: center; ">
                    <div class="miDiv imaCuadro">
                        <img class="imagenPreview" src="../Materiales/118" >
                    </div>
                </div>
                        <div class="" style="display: flex; justify-content: space-around; align-items: center; ">
                            <i class="miImagen coloresIcono fa-regular fa-images" style="cursor: pointer;" alt="Mostrar Imagen" onmouseover="mostrarDivCatalogo(this,${element.codigo})" onmouseout="ocultarDivCatalogo(this)"></i>
                            <i class="fa-solid fa-x coloresIcono" onclick="javascript:eliminarValorTabla(${element.codigo});"></i>   
                        </div>
                </div>
            </td >
            <td contenteditable="true" oninput="javascript:CambioCantidad(${element.codigo}, this); validarNumeros(this)">${element.cantidadm}</td>`;
        tbody.appendChild(fila);
    });
    if (MaterialInactivo) {
        lecturaMaterial.style.display = "flex"
    } else {
        lecturaMaterial.style.display = "none"
    }
}
function validarNumeros(celda) {
    let valor = celda.textContent;
    let valorFiltrado = valor.replace(/[^0-9]/g, ''); // Elimina todo excepto dígitos
    if (valor !== valorFiltrado) {
        celda.textContent = valorFiltrado;
    }
}
function CambioCantidad(id, input) {
    let cantidad = input.innerHTML;

    listaMateriales.forEach((valor, index) => {
        if (id == valor.codigo) {
            valor.cantidadm = cantidad;
        }
    });
}
function eliminarValorTabla(id) {

    listaMateriales.forEach((valor, index) => {
        if (id == valor.codigo) {
            listaMateriales.splice(index, 1);
        }
    });
    llenarTablaPorModal();
    let tbody = document.getElementById("tabla-materiales").getElementsByTagName("tbody")[0];
    if (!tbody.firstChild) {
        let fila = document.createElement("tr");
        fila.innerHTML = `
                <td td colspan = "8" > Sin resultados</td >
                    `;
        tbody.appendChild(fila);
    }
}


function AbrirModalMateriales() {
    $('#AgregarModalMaterialesConcepto').modal('show');
    LlenarCatalogoTabla();
}

function CerrarModalMateriales() {
    $('#AgregarModalMaterialesConcepto').modal('hide');

    LlenarCatalogoTabla();

}
function LlenarCatalogoTabla() {
    const cantidad = document.getElementById("cantRegistros");
    tamanoPagina = parseInt(cantidad.value);
    paginaActual = 1;
    GetMaterialesCatalogo();
}


// Muestra el panel donde se muestra la imagen del material
//Recibe la ubicacion de la fila del cual se mostrara la imagen
function mostrarDivCatalogo(imagen, id) {
    var div = imagen.parentElement.parentElement.querySelector(".miDiv");
    console.log(id);
    rutaCarpeta = "../Materiales/" + id;
    cargarImagenCuadro(div)
    // Mostrar el div
    div.style.display = "block";
}

// Muestra el panel donde se muestra la imagen del material
//Recibe la ubicacion de la fila del cual se ocultara la imagen
function ocultarDivCatalogo(imagen) {
    var div = imagen.parentElement.parentElement.querySelector(".miDiv");
    // Ocultar el div
    div.style.display = "none";
}


