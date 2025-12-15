let todosLosConceptos;
let idRemplazarTarjeta;


function RemplazarDatosNuevo() {
    if (conceptoTipoSeleccionado) {
        MostrartablaMaterialesTarjetaCopiar(idRemplazarTarjeta);
        MostrartablaManoObraTarjetaCopiar(idRemplazarTarjeta);
        MostrartablaMaquinariaTarjetaCopiar(idRemplazarTarjeta);
        MostrartablaBasicosTarjetaCopiar(idRemplazarTarjeta);
    } else {
        MostrartablaMaterialesTarjetaCopiar(idRemplazarTarjeta);
        MostrartablaManoObraTarjetaCopiar(idRemplazarTarjeta);
        MostrartablaMaquinariaTarjetaCopiar(idRemplazarTarjeta);
    }
    $('#staticBackdrop').modal('hide');
}

function confirmacionReutil(idBuscar) {
    idRemplazarTarjeta = idBuscar;
    $('#confirmacionReutilizar').modal('show');
}

function AbrirModalReutilizar() {
    llenarUnidadTabla(conceptoTipoSeleccionado);
    filterDataConceptoReutilizar();
    llenarTablaConceptoReutilizar();
}


function displayTableConceptoReutilizar(page) {
    const tableBody = document.getElementById("table-bodyReutilizacionModal");
    tableBody.innerHTML = "";
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);

    if (conceptoTipoSeleccionado) {
        document.getElementById('columFamilia').style.display = 'table-cell';
        if (paginatedData.length > 0) {
            paginatedData.forEach(record => {
                const row = document.createElement('tr');
                row.classList.add('fila');
                // Establecer el contenido HTML de la fila
                row.innerHTML = `
                    <td class="Code">${record.idconcepto}</td>
                    <td>${record.nombre ? record.nombre.replace(/\n/g, "<br>") : "---"}</td>
                    <td>${record.unidad ? record.unidad : "---"}</td>
                    <td>${record.nombreespe ? record.nombreespe : "---"}</td>
                    <td class="estatus">
                        <div style="display: flex; justify-content: space-around; align-items: center;">
                        <button type="button" class="btn btn-primary btn-generar-datos" data-bs-dismiss="modal" aria-label="Close" onclick="confirmacionReutil('${record.idconcepto}')"
                        style="background-color: #008E5A; border: 3px solid #008E5A;">Reutilizar</button>
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
            const row = `
                <tr class="fila">
                    <td colspan="6" class="Code">Sin resultados</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }
    } else {
        document.getElementById('columFamilia').style.display = 'none';
        if (paginatedData.length > 0) {
            paginatedData.forEach(record => {
                const row = document.createElement('tr');
                row.classList.add('fila');
                // Establecer el contenido HTML de la fila
                row.innerHTML = `
                 <td style="text-align: right;">${record.idconteo}</td>
                    <td class="Code">${record.idconbasi}</td>
                    <td>${record.nombre ? record.nombre.replace(/\n/g, "<br>") : "---"}</td>
                    <td>${record.unidad ? record.unidad : "---"}</td>
                    <td class="estatus">
                       <div style="display: flex; justify-content: space-around; align-items: center;">
                        <button type="button" class="btn btn-primary btn-generar-datos" data-bs-dismiss="modal" aria-label="Close" onclick="confirmacionReutil('${record.idconbasi}')"
                        style="background-color: #008E5A; border: 3px solid #008E5A;">Reutilizar</button>
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
            const row = `
                <tr class="fila">
                    <td colspan="6" class="Code">Sin resultados</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }

    }
}


function setupPaginationConceptoReutilizar() {
    const paginationDiv = document.getElementById("paginationModalReutilizar");
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
        prevButton.disabled = currentPage == 1;
        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayTableConceptoReutilizar(currentPage);
                setupPaginationConceptoReutilizar();
            }
        });
        paginationDiv.appendChild(prevButton);
        // Botones de página
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.innerText = i;

            if (currentPage == i) {
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
                displayTableConceptoReutilizar(currentPage);
                setupPaginationConceptoReutilizar();
            });
            paginationDiv.appendChild(button);
        }

        // Botón de "Adelante"
        const nextButton = document.createElement("button");
        nextButton.innerHTML = `<i class="fa-solid fa-angles-right"></i>`;
        nextButton.style.backgroundColor = "#008e5a";
        nextButton.style.color = "#ffffff";
        nextButton.style.border = "3px solid #008e5a";
        nextButton.disabled = currentPage == totalPages;
        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTableConceptoReutilizar(currentPage);
                setupPaginationConceptoReutilizar();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

function filterDataConceptoReutilizar() {
    const searchText = document.getElementById("search-inputConcepto").value.toLowerCase();
    const unidadFilter = document.getElementById("unidad-filterConcepto").value;

    const statusFilter = 1;
    filteredData = todosLosConceptos.filter(record => {
        const matchesSearch = Object.values(record).some(value =>
            value != null && value.toString().toLowerCase().includes(searchText)
        );
        const matchesUnidad = unidadFilter ? record.unidad == unidadFilter : true;
        const matchesStatus = record.estatus == statusFilter;
        return matchesSearch && matchesUnidad && matchesStatus;
    });

    currentPage = 1; // Reiniciar a la primera página después de filtrar
    displayTableConceptoReutilizar(currentPage);
    setupPaginationConceptoReutilizar();
}

function llenarTablaConceptoReutilizar() {
    displayTableConceptoReutilizar(currentPage);
    setupPaginationConceptoReutilizar();
    const searchInput = document.getElementById("search-inputConcepto");
    searchInput.addEventListener("input", filterDataConceptoReutilizar);

    const unidadFilter = document.getElementById("unidad-filterConcepto");
    unidadFilter.addEventListener("change", filterDataConceptoReutilizar);

    const rowsPerPageSelect = document.getElementById("rows-per-pageReutilizar");
    rowsPerPageSelect.addEventListener("change", function () {
        rowsPerPage = parseInt(this.value);
        currentPage = 1;
        displayTableConceptoReutilizar(currentPage);
        setupPaginationConceptoReutilizar();
    });
}
//***
// 
// 
// Materiales copiados
// 
//  */
function MostrartablaMaterialesTarjetaCopiar(idBuscar) {
    materialesCopiar = [];
    const datos = {}
    datos.idConcepto = idBuscar;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaMateriales/wsGetMaterialesTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        materialesCopiar.push({
                            codigo: datos.codigo,
                            norma: datos.norma,
                            descripcion: datos.descripcion,
                            precio: datos.precio,
                            fechaprecio: datos.fechaprecio,
                            unidad: datos.unidad,
                            cantidad: datos.cantmaterial,
                            suministrado: datos.suministrado == 1 ? true : false,
                            estatus: datos.estatus
                        });
                    })
                    EliminartablaMaterialesTarjetaCopiar(materialesCopiar);
                } else {
                    EliminartablaMaterialesTarjetaCopiar(materialesCopiar);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });

}
function EliminartablaMaterialesTarjetaCopiar(materiales) {
    const datos = {}
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaMateriales/wsDelMaterialesTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                AgregartablaMaterialesTarjetaCopiar(materiales);
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}
function AgregartablaMaterialesTarjetaCopiar(materiales) {
    if (materiales.length > 0) {
        materiales.forEach(material => {
            material.idConcepto = datosCatalogo.id
            if (material.fechaprecio == null) {
                material.fechaprecio = "2024-10-30"
            }
            if (material.suministrado == true) {
                material.suministrado = 1;
            } else {
                material.suministrado = 0;
            }
            let json = JSON.stringify(material);
            let url = "../ws/TarjetaMateriales/wsAddMaterialesTarjeta.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        let resp = JSON.parse(responseText);
                        if (resp.estado == "OK") {
                            objTabla2ModalMaterialesPrincipal = materiales;
                            llenarTablaMaterialesSeleccionadosP();
                        }
                    } else {
                        throw e = status;
                    }
                } catch (error) {
                    alert("Error: " + error)
                }
            });
        })
    } else {
        objTabla2ModalMaterialesPrincipal = materiales;
        llenarTablaMaterialesSeleccionadosP();

    }
}


//***
// 
// 
// Mano obra copiadas
// 
//  */


function MostrartablaManoObraTarjetaCopiar(idBuscar) {
    manoObraCopiar = []
    const datos = {}
    datos.idConcepto = idBuscar;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaManoObra/wsGetManoObraTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        manoObraCopiar.push({
                            idmanoobra: datos.idmanoobra,
                            salario: datos.salario,
                            fechasalario: datos.fechasalario,
                            unidad: datos.unidad,
                            categoria: datos.categoria,
                            cantidad: datos.cantidad,
                            rendimiento: datos.rendimiento,
                            estatus: datos.estatus,
                        });
                    })
                    EliminartablaManoObraTarjetaCopiar(manoObraCopiar);
                } else {
                    EliminartablaManoObraTarjetaCopiar(manoObraCopiar);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function EliminartablaManoObraTarjetaCopiar(manoObra) {
    const datos = {}
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaManoObra/wsDelManoObraTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                AgregartablaManoObraTarjetaCopiar(manoObra);
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function AgregartablaManoObraTarjetaCopiar(manoObraC) {
    if (manoObraC.length > 0) {
        manoObraC.forEach(manoObra => {
            manoObra.idConcepto = datosCatalogo.id
            if (manoObra.fechasalario == null) {
                manoObra.fechasalario = "2024-10-30"
            } else if (manoObra.fechasalario == "0000-00-00") {
                manoObra.fechasalario = "2024-10-30"
            }
            let json = JSON.stringify(manoObra);

            let url = "../ws/TarjetaManoObra/wsAddManoObraTarjeta.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        let resp = JSON.parse(responseText);
                        if (resp.estado == "OK") {
                            objTabla2ModalManoObraiaPrincipal = manoObraC;
                            llenarTablaManoObraSeleccionadosP();
                        }
                    } else {
                        throw e = status;
                    }
                } catch (error) {
                    alert("Error: " + error)
                }
            });
        })
    } else {
        objTabla2ModalManoObraiaPrincipal = manoObraC;
        llenarTablaManoObraSeleccionadosP();
    }
}
//***
// 
// 
// Maquinaria copiadas
// 
//  */
function MostrartablaMaquinariaTarjetaCopiar(idBuscar) {
    maquinariaCopiar = []
    const datos = {};
    datos.idConcepto = idBuscar;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaMaquinaria/wsGetMaquinariaTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        maquinariaCopiar.push({
                            idmaquinaria: datos.idmaquinaria,
                            descripcion: datos.descripcion,
                            phm: datos.phm,
                            rhm: datos.rhm,
                            fechaprecio: datos.fechaprecio,
                            unidad: datos.unidad,
                            estatus: datos.estatus,
                        });
                    })
                    EliminartablaMaquinariaTarjetaFCopiar(maquinariaCopiar);
                } else {
                    EliminartablaMaquinariaTarjetaFCopiar(maquinariaCopiar);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}
function EliminartablaMaquinariaTarjetaFCopiar(maquinaria) {
    const datos = {}
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaMaquinaria/wsDelMaquinariaTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                AgregartablaMaquinariaTarjetaCopiar(maquinaria);
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function AgregartablaMaquinariaTarjetaCopiar(maquinariaC) {
    if (maquinariaC.length > 0) {
        maquinariaC.forEach(maquinaria => {
            maquinaria.idConcepto = datosCatalogo.id
            if (maquinaria.fechaprecio == null) {
                maquinaria.fechaprecio = "2024-10-30"
            } else if (maquinaria.fechaprecio == "0000-00-00") {
                maquinaria.fechaprecio = "2024-10-30"
            }
            let json = JSON.stringify(maquinaria);
            let url = "../ws/TarjetaMaquinaria/wsAddMaquinariaTarjeta.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        objTabla2ModalMaquinariaPrincipal = maquinariaC;
                        llenarTablaMaquinariaSeleccionadosP();
                    } else {
                        throw e = status;
                    }
                } catch (error) {
                    alert("Error: " + error)
                }
            });
        })
    } else {
        objTabla2ModalMaquinariaPrincipal = maquinariaC;
        llenarTablaMaquinariaSeleccionadosP();
    }

}



//***
// 
// 
// Basicos copiados
// 
//  */

function MostrartablaBasicosTarjetaCopiar(idBuscar) {
    basicosCopiar = []
    const datos = {};
    datos.idConcepto = idBuscar;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaBasicos/wsGetBasicosTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                let datosBd = resp.datos;
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        basicosCopiar.push({

                            idconbasi: datos.idconbasi,
                            nombre: datos.nombre,
                            cantconbasi: datos.cantconbasi,
                            total: datos.total,
                            unidad: datos.unidad,
                            estatus: datos.estatus
                        });
                    })
                    EliminartablaBasicosTarjetaCopiar(basicosCopiar);
                } else {
                    EliminartablaBasicosTarjetaCopiar(basicosCopiar);
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function EliminartablaBasicosTarjetaCopiar(basicos) {
    const datos = {}
    datos.idConcepto = datosCatalogo.id;
    let json = JSON.stringify(datos);
    let url = "../ws/TarjetaBasicos/wsDelBasicosTarjeta.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                AgregartablaBasicosTarjetaCopiar(basicos);
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function AgregartablaBasicosTarjetaCopiar(basicosC) {
    if (basicosC.length > 0) {
        basicosC.forEach(basicos => {
            basicos.idConcepto = datosCatalogo.id
            let json = JSON.stringify(basicos);
            let url = "../ws/TarjetaBasicos/wsAddBasicosTarjeta.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == "success") {
                        let resp = JSON.parse(responseText);
                        objTabla2ModalBasicosPrincipal = basicosC;
                        llenarTablaBasicosSeleccionadosP();
                    } else {
                        throw e = status;
                    }

                } catch (error) {
                    alert("Error: " + error)
                }
            });
        })
    } else {
        objTabla2ModalBasicosPrincipal = basicosC;
        llenarTablaBasicosSeleccionadosP();
    }
}
