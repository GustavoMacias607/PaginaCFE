// Variables globales para la paginación de tarjetas
let currentPageTarjetas = 1;
let tarjetasPerPage = 5;
let allConceptos = [];
let conceptosCache = new Map(); // Cache para almacenar conceptos ya cargados
async function GeneradorTablaConcepto() {
    const container = document.getElementById('tablaTarjetasProyecto');
    const controlesPaginacion = document.getElementById("controlesPaginacion");
    const mostrarBtnPdf = document.getElementById("mostrarBtnPdf");
    const mostrarBtnPaginacion = document.getElementById("mostrarBtnPaginacion");
    const cargaTarjetas = document.getElementById("cargaTarjetas"); // Nuevo

    if (!container) {
        console.error('Contenedor "tablaTarjetasProyecto" no encontrado');
        return;
    }
    container.innerHTML = '';
    cargaTarjetas.style.display = "none"; // Asegurar que esté oculto al inicio

    allConceptos = Object.values(editedRows);
    if (allConceptos.length === 0) {
        console.warn("No hay conceptos para mostrar");
        controlesPaginacion.style.display = "none";
        container.style.display = "none";
        return;
    }

    // Mostrar controles y contenedor principal
    mostrarBtnPdf.style.display = "flex";
    mostrarBtnPaginacion.style.display = "flex";
    controlesPaginacion.style.display = "flex";
    container.style.display = "block";

    // Mostrar la primera página
    await displayTarjetasConcepto(currentPageTarjetas);
    setupPaginationTarjetas();

    // Configurar evento para cambiar cantidad de tarjetas por página
    const tarjetasPerPageSelect = document.getElementById("tarjetas-per-page");
    if (tarjetasPerPageSelect) {
        tarjetasPerPageSelect.addEventListener("change", function () {
            tarjetasPerPage = parseInt(this.value);
            currentPageTarjetas = 1;
            displayTarjetasConcepto(currentPageTarjetas);
            setupPaginationTarjetas();
        });
    }

}

async function displayTarjetasConcepto(page) {
    const container = document.getElementById('tablaTarjetasProyecto');
    const cargaTarjetas = document.getElementById('cargaTarjetas');
    const infoCarga = document.getElementById('infoCarga');
    const barraProgreso = document.getElementById('barraProgreso');

    if (!container) {
        console.error('Contenedor no encontrado');
        return;
    }

    const start = (page - 1) * tarjetasPerPage;
    const end = start + tarjetasPerPage;
    const paginatedConceptos = allConceptos.slice(start, end);

    // Verificar cuántos conceptos necesitan ser cargados
    const conceptosPorCargar = paginatedConceptos.filter(concepto =>
        !conceptosCache.has(concepto.idconcepto)
    );

    if (paginatedConceptos.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem;">No hay conceptos para mostrar</div>';
        cargaTarjetas.style.display = "none";
        container.style.display = "block";
        return;
    }

    // Mostrar mensaje de carga solo si hay conceptos por cargar
    if (conceptosPorCargar.length > 0) {
        container.style.display = "none";
        cargaTarjetas.style.display = "block";
        infoCarga.textContent = `Cargando ${conceptosPorCargar.length} de ${paginatedConceptos.length} conceptos...`;
        barraProgreso.style.width = "0%";
    } else {
        // Si todos están en cache, ocultar carga y mostrar contenido inmediatamente
        cargaTarjetas.style.display = "none";
        container.style.display = "block";
    }

    container.innerHTML = '';

    // Cargar solo los conceptos que no están en cache
    for (let i = 0; i < conceptosPorCargar.length; i++) {
        const concepto = conceptosPorCargar[i];

        if (pantallaFuncion !== "addProyTermFrm") {
            return;
        }

        try {
            // Actualizar barra de progreso
            const progreso = ((i + 1) / conceptosPorCargar.length) * 100;
            barraProgreso.style.width = `${progreso}%`;
            infoCarga.textContent = `Cargando ${i + 1} de ${conceptosPorCargar.length} conceptos...`;

            const conceptoData = {
                concepto: concepto,
                materiales: await TraerMaterialesConcepto(concepto.idconcepto),
                manoObra: await TraerManoObrasConcepto(concepto.idconcepto),
                maquinaria: await TraerMaquinariaConcepto(concepto.idconcepto),
                basico: await TraerBasicoConcepto(concepto.idconcepto)
            };

            // Almacenar en cache
            conceptosCache.set(concepto.idconcepto, conceptoData);

        } catch (error) {
            console.error(`Error al cargar datos del concepto ${concepto.idconcepto}:`, error);
            // Almacenar concepto vacío en cache para evitar reintentos
            conceptosCache.set(concepto.idconcepto, {
                concepto: concepto,
                materiales: [],
                manoObra: [],
                maquinaria: [],
                basico: []
            });
        }
    }

    // Ocultar carga y mostrar contenido
    cargaTarjetas.style.display = "none";
    container.style.display = "block";

    // Mostrar todas las tarjetas de la página (usando cache cuando esté disponible)

    paginatedConceptos.forEach((concepto, index) => {
        const conceptoData = conceptosCache.get(concepto.idconcepto);

        // CALCULAR EL NÚMERO SECUENCIAL CORRECTO
        const numeroTarjeta = start + index + 1;

        if (conceptoData) {
            // Usar datos del cache - pasar el número correcto
            const conceptoHTML = crearTarjetaConceptoHTML(conceptoData, numeroTarjeta);
            container.innerHTML += conceptoHTML;
        } else {
            // Mostrar tarjeta vacía
            const conceptoHTML = crearTarjetaEsqueletoHTML(concepto, numeroTarjeta);
            container.innerHTML += conceptoHTML;
        }
    });
}

function crearTarjetaEsqueletoHTML(concepto, numeroTarjeta) {
    // Tarjeta básica sin datos detallados (para mostrar mientras carga)
    return `
        <div id="concepto-${concepto.idconcepto}" class="tarjeta-concepto" style="margin-bottom: 2rem; border: 1px solid #ddd; padding: 1rem; border-radius: 8px; opacity: 0.7;">
            <div class="titulo-concepto">
                <div class="pSeccion-catalogo">
                    <div style="font-weight: bold; font-size: 1.2rem;">Concepto (Cargando...)</div>
                </div>
            </div>
            <div class="contTabla-materialesmodal_catalogo">
                <div class="tabla-container-tablaTarjeta">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                <th style="width: 8rem; padding: 0.5rem; text-align: left;">No.</th>
                                <th style="width: 8rem; padding: 0.5rem; text-align: left;">ID</th>
                                <th style="padding: 0.5rem; text-align: left;">Nombre</th>
                                <th style="width: 10rem; padding: 0.5rem; text-align: left;">Unidad</th>
                                <th style="width: 8rem; padding: 0.5rem; text-align: left;">Familia</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="text-align: right; padding: 0.5rem;">${numeroTarjeta || 'N/A'}</td>
                                <td style="padding: 0.5rem;">${concepto.idconcepto || 'N/A'}</td>
                                <td style="padding: 0.5rem;">${concepto.nombre || 'N/A'}</td>
                                <td style="padding: 0.5rem;">${concepto.unidad || 'N/A'}</td>
                                <td style="padding: 0.5rem;">${concepto.nombreespe || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div style="text-align: center; padding: 2rem; color: #666;">
                Cargando datos detallados...
            </div>
        </div>
    `;
}

function crearTarjetaConceptoHTML(conceptoData, numeroTarjeta) {
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    const { concepto, materiales, manoObra, maquinaria, basico } = conceptoData;

    // Calcular totales
    const totalImporteMateriales = materiales.reduce((total, material) => total + (material.suministrado ? 0 : (material.precio * material.cantidad)), 0);
    const totalImporteManoObra = manoObra.reduce((total, manoObra) => total + manoObra.importe, 0);
    const totalImporteMaquinaria = maquinaria.reduce((total, maquinaria) => total + (maquinaria.phm / maquinaria.rhm), 0);
    const totalImporteBasico = basico.reduce((total, basico) => total + (basico.total * basico.cantconbasi), 0);

    // Calcular herramientas y equipo
    const khHerramientas = 0.03;
    const khEquipo = 0.02;
    const importeHerramientas = khHerramientas * totalImporteManoObra;
    const importeEquipo = khEquipo * totalImporteManoObra;
    const totalImporteHerramientaEquipo = importeHerramientas + importeEquipo;

    // Calcular costo total
    const costoTotal = totalImporteMateriales + totalImporteManoObra + totalImporteHerramientaEquipo + totalImporteMaquinaria + totalImporteBasico;

    return `
        <div id="concepto-${concepto.idconcepto}" class="tarjeta-concepto">
            <!-- Concepto principal -->
            <div class="titulo-concepto">
                <div class="pSeccion-catalogo">
                    <div>Concepto</div>
                </div>
            </div>
            <div class="contTabla-materialesmodal_catalogo">
                <div class="tabla-container-tablaTarjeta">
                    <table id="tabla-conceptosCatalogo">
                        <thead class="encabezadoTablasTarjeta">
                            <tr>
                                <th style="width: 8rem;">No.</th>
                                <th style="width: 8rem;">ID</th>
                                <th>Nombre</th>
                                <th style="width: 10rem;">Unidad</th>
                                <th style="width: 8rem;">Familia</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="text-align: right;">${numeroTarjeta || 'N/A'}</td>
                                <td>${concepto.idconcepto || 'N/A'}</td>
                                <td>${concepto.nombre || 'N/A'}</td>
                                <td>${concepto.unidad || 'N/A'}</td>
                                <td>${concepto.nombreespe || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Materiales -->
            <div class="titulo-concepto">
                <div class="pSeccion-catalogo">
                    <div>Materiales</div>
                </div>
            </div>
            <div class="contTabla-materialesmodal_catalogo">
                ${crearTablaMaterialesHTML(materiales, concepto.idconcepto)}
            </div>

            <!-- Mano de obra -->
            <div class="titulo-concepto">
                <div class="pSeccion-catalogo">
                    <div>Mano de obra</div>
                </div>
            </div>
            <div class="contTabla-materialesmodal_catalogo">
                ${crearTablaManoObraHTML(manoObra, concepto.idconcepto)}
            </div>

            <!-- Herramienta y equipo -->
            <div class="titulo-concepto">
                <div class="pSeccion-catalogo">
                    <div>Herramienta y equipo de seguridad</div>
                </div>
            </div>
            <div class="contTabla-materialesmodal_catalogo">
                ${crearTablaHerramientaEquipoHTML(totalImporteManoObra, concepto.idconcepto)}
            </div>

            <!-- Maquinaria -->
            <div class="titulo-concepto">
                <div class="pSeccion-catalogo">
                    <div>Maquinaria</div>
                </div>
            </div>
            <div class="contTabla-materialesmodal_catalogo">
                ${crearTablaMaquinariaHTML(maquinaria, concepto.idconcepto)}
            </div>

            <!-- Básico -->
            <div class="titulo-concepto">
                <div class="pSeccion-catalogo">
                    <div>Basico</div>
                </div>
            </div>
            <div class="contTabla-materialesmodal_catalogo">
                ${crearTablaBasicoHTML(basico, concepto.idconcepto)}
            </div>

            <!-- Costo total -->
            <div class="totalesTablas claseTotales">
                <label class="subtotales_textos">Costo directo:</label>
                <div>
                    <label class="subtotales_numeros_top">${formatoMXN.format(costoTotal)}</label>
                </div>
            </div>
            <hr class="separador-tarjetas">
        </div>
    `;
}

// Función para limpiar el cache (si es necesario)
function limpiarCacheConceptos() {
    conceptosCache.clear();
}

// setupPaginationTarjetas se mantiene igual
function setupPaginationTarjetas() {
    const paginationDiv = document.getElementById("pagination-tarjetas");
    if (!paginationDiv) return;

    paginationDiv.innerHTML = "";

    const totalPages = Math.ceil(allConceptos.length / tarjetasPerPage);
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const middle = Math.floor(maxPagesToShow / 2);

        if (currentPageTarjetas <= middle) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPageTarjetas + middle >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPageTarjetas - middle;
            endPage = currentPageTarjetas + middle;
        }
    }

    if (totalPages > 0) {
        // Botón de "Atrás"
        const prevButton = document.createElement("button");
        prevButton.innerHTML = `<i class="fa-solid fa-angles-left"></i>`;
        prevButton.style.backgroundColor = "#008e5a";
        prevButton.style.color = "#ffffff";
        prevButton.style.border = "3px solid #008e5a";
        prevButton.disabled = currentPageTarjetas === 1;
        prevButton.addEventListener("click", async () => {
            if (currentPageTarjetas > 1) {
                currentPageTarjetas--;
                await displayTarjetasConcepto(currentPageTarjetas);
                setupPaginationTarjetas();
            }
        });
        paginationDiv.appendChild(prevButton);

        // Botones de página
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.innerText = i;

            if (currentPageTarjetas === i) {
                button.className = 'active';
                button.style.color = "#ffffff";
                button.style.border = "3px solid #008e5a";
                button.style.backgroundColor = "#008e5a";
            } else {
                button.style.color = "#008e5a";
                button.style.border = "3px solid #008e5a";
                button.style.backgroundColor = "#ffffff";
            }

            button.addEventListener("click", async () => {
                currentPageTarjetas = i;
                await displayTarjetasConcepto(currentPageTarjetas);
                setupPaginationTarjetas();
            });

            paginationDiv.appendChild(button);
        }

        // Botón de "Adelante"
        const nextButton = document.createElement("button");
        nextButton.innerHTML = `<i class="fa-solid fa-angles-right"></i>`;
        nextButton.style.backgroundColor = "#008e5a";
        nextButton.style.color = "#ffffff";
        nextButton.style.border = "3px solid #008e5a";
        nextButton.disabled = currentPageTarjetas === totalPages;
        nextButton.addEventListener("click", async () => {
            if (currentPageTarjetas < totalPages) {
                currentPageTarjetas++;
                await displayTarjetasConcepto(currentPageTarjetas);
                setupPaginationTarjetas();
            }
        });
        paginationDiv.appendChild(nextButton);
    }
}

// Versiones modificadas que RETORNAN datos en lugar de generar HTML
function TraerMaterialesConcepto(idConceptoProyecto) {
    return new Promise((resolve, reject) => {
        let MaterialesConcepto = [];
        const datos = {};
        datos.idConcepto = idConceptoProyecto;
        let json = JSON.stringify(datos);
        let url = "../ws/TarjetaMateriales/wsGetMaterialesTarjeta.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    let datosBd = resp.datos;
                    if (datosBd) {
                        datosBd.forEach((datos) => {
                            MaterialesConcepto.push({
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
                        });
                    }
                    resolve(MaterialesConcepto); // RETORNA los datos
                } else {
                    throw new Error(status);
                }
            } catch (error) {
                console.error("Error en TraerMaterialesConcepto:", error);
                resolve([]); // Resuelve con array vacío en caso de error
            }
        });
    });
}

function TraerManoObrasConcepto(idConceptoProyecto) {
    return new Promise((resolve, reject) => {
        let ManoObraConcepto = [];
        const datos = {};
        datos.idConcepto = idConceptoProyecto;
        let json = JSON.stringify(datos);
        let url = "../ws/TarjetaManoObra/wsGetManoObraTarjeta.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    let datosBd = resp.datos;
                    if (datosBd) {
                        datosBd.forEach((datos) => {
                            const cantidad = 1 / datos.rendimiento;
                            const sr = datos.salario * cantidad;
                            const importe = datos.rendimiento === 0 ? 0 : sr / datos.rendimiento;
                            ManoObraConcepto.push({
                                idmanoobra: datos.idmanoobra,
                                categoria: datos.categoria,
                                unidad: datos.unidad,
                                salario: datos.salario,
                                rendimiento: datos.rendimiento,
                                cantidad: cantidad,
                                sr: sr,
                                importe: importe,
                                estatus: datos.estatus,
                            });
                        });
                    }
                    resolve(ManoObraConcepto); // RETORNA los datos
                } else {
                    throw new Error(status);
                }
            } catch (error) {
                console.error("Error en TraerManoObrasConcepto:", error);
                resolve([]);
            }
        });
    });
}

function TraerMaquinariaConcepto(idConceptoProyecto) {
    return new Promise((resolve, reject) => {
        let MaquinariaConcepto = [];
        const datos = {};
        datos.idConcepto = idConceptoProyecto;
        let json = JSON.stringify(datos);
        let url = "../ws/TarjetaMaquinaria/wsGetMaquinariaTarjeta.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    let datosBd = resp.datos;
                    if (datosBd) {
                        datosBd.forEach((datos) => {
                            MaquinariaConcepto.push({
                                idmaquinaria: datos.idmaquinaria,
                                descripcion: datos.descripcion,
                                phm: datos.phm,
                                rhm: datos.rhm,
                                fechaprecio: datos.fechaprecio,
                                unidad: datos.unidad,
                                estatus: datos.estatus,
                            });
                        });
                    }
                    resolve(MaquinariaConcepto); // RETORNA los datos
                } else {
                    throw new Error(status);
                }
            } catch (error) {
                console.error("Error en TraerMaquinariaConcepto:", error);
                resolve([]);
            }
        });
    });
}

function TraerBasicoConcepto(idConceptoProyecto) {
    return new Promise((resolve, reject) => {
        let BasicoConcepto = [];
        const datos = {};
        datos.idConcepto = idConceptoProyecto;
        let json = JSON.stringify(datos);
        let url = "../ws/TarjetaBasicos/wsGetBasicosTarjeta.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    let resp = JSON.parse(responseText);
                    let datosBd = resp.datos;
                    if (datosBd) {
                        datosBd.forEach((datos) => {
                            BasicoConcepto.push({
                                idconbasi: datos.idconbasi,
                                nombre: datos.nombre,
                                cantconbasi: datos.cantconbasi,
                                total: datos.total,
                                unidad: datos.unidad,
                                estatus: datos.estatus
                            });
                        });
                    }
                    resolve(BasicoConcepto); // RETORNA los datos
                } else {
                    throw new Error(status);
                }
            } catch (error) {
                console.error("Error en TraerBasicoConcepto:", error);
                resolve([]);
            }
        });
    });
}

// Funciones auxiliares para crear HTML (reemplazan a las funciones GeneradorTabla...)
function crearTablaMaterialesHTML(materiales, idConcepto) {
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteMateriales = materiales.reduce((total, material) => total + (material.suministrado ? 0 : (material.precio * material.cantidad)), 0);

    return `
        <div class="tabla-container-tablaTarjeta">
            <table id="tabla-MaterialesCatalogo">
                <thead class="encabezadoTablasTarjeta">
                    <tr>
                        <th style="width: 8rem;">ID</th>
                        <th>Descripción</th>
                        <th style="width: 8rem;">Unidad</th>
                        <th style="width: 8rem;">Precio U</th>
                        <th style="width: 8rem;">Cantidad</th>
                        <th style="width: 11rem;">Suministrado por CFE</th>
                        <th style="width: 9rem;">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    ${materiales.length > 0 ? materiales.map(material => `
                        <tr>
                            <td style="text-align: right;">${material.codigo}</td>
                            <td>${material.descripcion}</td>
                            <td>${material.unidad}</td>
                            <td style="text-align: right;">${formatoMXN.format(material.precio)}</td>
                            <td style="text-align: right;">${material.cantidad}</td>
                            <td>${material.suministrado ? 'Sí' : 'No'}</td>
                            <td style="text-align: right;">${formatoMXN.format(material.suministrado ? 0 : (material.precio * material.cantidad))}</td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="7">Sin resultados</td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
        <div class="totalesTablas">
            <label class="subtotales_textos">Suma 1:</label>
            <div>
                <label class="subtotales_numeros_top">${formatoMXN.format(totalImporteMateriales)}</label>
            </div>
        </div>
    `;
}

function crearTablaManoObraHTML(manoObra, idConcepto) {
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteManoObra = manoObra.reduce((total, manoObra) => total + manoObra.importe, 0);

    return `
        <div class="tabla-container-tablaTarjeta">
            <table id="tabla-MaterialesCatalogo">
                <thead class="encabezadoTablasTarjeta">
                    <tr>
                        <th style="width: 8rem;">ID</th>
                        <th>Categoría</th>
                        <th style="width: 10rem;">Unidad</th>
                        <th style="width: 8rem;">Salario</th>
                        <th style="width: 8rem;">Rendimiento</th>
                        <th style="width: 8rem;">Cantidad</th>
                        <th style="width: 8rem;">Sr</th>
                        <th style="width: 9rem;">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    ${manoObra.length > 0 ? manoObra.map(item => `
                        <tr class="fila">
                            <td>${item.idmanoobra}</td>
                            <td>${item.categoria}</td>
                            <td>${item.unidad}</td>
                            <td style="text-align: right;">${formatoMXN.format(item.salario)}</td>
                            <td style="text-align: right;">${item.rendimiento}</td>
                            <td style="text-align: right;">${item.cantidad.toFixed(2)}</td>
                            <td style="text-align: right;">${formatoMXN.format(item.sr)}</td>
                            <td style="text-align: right;">${formatoMXN.format(item.importe)}</td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="8">Sin resultados</td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
        <div class="totalesTablas">
            <label class="subtotales_textos">Suma 2:</label>
            <div>
                <label class="subtotales_numeros_top">${formatoMXN.format(totalImporteManoObra)}</label>
            </div>
        </div>
    `;
}

function crearTablaHerramientaEquipoHTML(totalImporteManoObra, idConcepto) {
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    const khHerramientas = 0.03;
    const khEquipo = 0.02;

    const importeHerramientas = khHerramientas * totalImporteManoObra;
    const importeEquipo = khEquipo * totalImporteManoObra;
    const totalImporteHerramientaEquipo = importeHerramientas + importeEquipo;

    return `
        <div class="tabla-container-tablaTarjeta">
            <table id="tabla-MaterialesCatalogo">
                <thead class="encabezadoTablasTarjeta">
                    <tr>
                        <th>Descripción</th>
                        <th style="width: 8rem;">Kh o Ks</th>
                        <th style="width: 8rem;">Mo</th>
                        <th style="width: 9rem;">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="fila">
                        <td class="Code">Herramientas de mano</td>
                        <td style="text-align: right;">${khHerramientas}</td>
                        <td style="text-align: right;">${formatoMXN.format(totalImporteManoObra)}</td>
                        <td style="text-align: right;">${formatoMXN.format(importeHerramientas)}</td>
                    </tr>
                    <tr class="fila">
                        <td class="Code">Equipo y seguridad</td>
                        <td style="text-align: right;">${khEquipo}</td>
                        <td style="text-align: right;">${formatoMXN.format(totalImporteManoObra)}</td>
                        <td style="text-align: right;">${formatoMXN.format(importeEquipo)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="totalesTablas">
            <label class="subtotales_textos">Suma 3:</label>
            <div>
                <label class="subtotales_numeros_top">${formatoMXN.format(totalImporteHerramientaEquipo)}</label>
            </div>
        </div>
    `;
}

function crearTablaMaquinariaHTML(maquinaria, idConcepto) {
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteMaquinaria = maquinaria.reduce((total, item) => total + (item.phm / item.rhm), 0);

    return `
        <div class="tabla-container-tablaTarjeta">
            <table id="tabla-MaterialesCatalogo">
                <thead class="encabezadoTablasTarjeta">
                    <tr>
                        <th style="width: 8rem;">ID</th>
                        <th>Descripción</th>
                        <th style="width: 10rem;">Unidad</th>
                        <th style="width: 8rem;">PhM</th>
                        <th style="width: 8rem;">RhM</th>
                        <th style="width: 9rem;">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    ${maquinaria.length > 0 ? maquinaria.map(item => `
                        <tr class="fila">
                            <td>${item.idmaquinaria}</td>
                            <td>${item.descripcion}</td>
                            <td>${item.unidad}</td>
                            <td style="text-align: right;">${formatoMXN.format(item.phm)}</td>
                            <td style="text-align: right;">${item.rhm}</td>
                            <td style="text-align: right;">${formatoMXN.format(item.phm / item.rhm)}</td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="6">Sin resultados</td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
        <div class="totalesTablas">
            <label class="subtotales_textos">Suma 4:</label>
            <div>
                <label class="subtotales_numeros_top">${formatoMXN.format(totalImporteMaquinaria)}</label>
            </div>
        </div>
    `;
}

function crearTablaBasicoHTML(basico, idConcepto) {
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteBasico = basico.reduce((total, item) => total + (item.total * item.cantconbasi), 0);

    return `
        <div class="tabla-container-tablaTarjeta">
            <table id="tabla-MaterialesCatalogo">
                <thead class="encabezadoTablasTarjeta">
                    <tr>
                        <th style="width: 8rem;">ID</th>
                        <th>Descripción</th>
                        <th style="width: 10rem;">Unidad</th>
                        <th style="width: 8rem;">Precio U</th>
                        <th style="width: 8rem;">Cantidad</th>
                        <th style="width: 9rem;">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    ${basico.length > 0 ? basico.map(item => `
                        <tr class="fila">
                            <td>${item.idconbasi}</td>
                            <td>${item.nombre}</td>
                            <td>${item.unidad}</td>
                            <td style="text-align: right;">${formatoMXN.format(item.total)}</td>
                            <td style="text-align: right;">${item.cantconbasi}</td>
                            <td style="text-align: right;">${formatoMXN.format(item.total * item.cantconbasi)}</td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="6">Sin resultados</td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
        <div class="totalesTablas">
            <label class="subtotales_textos">Suma 5:</label>
            <div>
                <label class="subtotales_numeros_top">${formatoMXN.format(totalImporteBasico)}</label>
            </div>
        </div>
    `;
}




// function TraerMaterialesConcepto(idConceptoProyecto) {
//     return new Promise((resolve, reject) => {
//         let MaterialesConcepto = [];
//         const datos = {};
//         datos.idConcepto = idConceptoProyecto;
//         let json = JSON.stringify(datos);
//         let url = "../ws/TarjetaMateriales/wsGetMaterialesTarjeta.php";
//         $.post(url, json, (responseText, status) => {
//             try {
//                 if (status == "success") {
//                     let resp = JSON.parse(responseText);
//                     let datosBd = resp.datos;
//                     if (datosBd) {
//                         datosBd.forEach((datos) => {
//                             MaterialesConcepto.push({
//                                 codigo: datos.codigo,
//                                 norma: datos.norma,
//                                 descripcion: datos.descripcion,
//                                 precio: datos.precio,
//                                 fechaprecio: datos.fechaprecio,
//                                 unidad: datos.unidad,
//                                 cantidad: datos.cantmaterial,
//                                 suministrado: datos.suministrado == 1 ? true : false,
//                                 estatus: datos.estatus
//                             });
//                         });
//                     }
//                     GeneradorTablaMateriales(MaterialesConcepto, idConceptoProyecto);
//                     resolve();
//                 } else {
//                     throw new Error(status);
//                 }
//             } catch (error) {
//                 alert("Error: " + error);
//                 reject(error);
//             }
//         });
//     });
// }

// function GeneradorTablaMateriales(MaterialesConcepto, idConceptoProyecto) {
//     const container = document.getElementById(`materiales-${idConceptoProyecto}`);
//     if (!container) return;
//     const formatoMXN = new Intl.NumberFormat('es-MX', {
//         style: 'currency',
//         currency: 'MXN'
//     });

//     let totalImporteMateriales = MaterialesConcepto.reduce((total, material) => total + (material.suministrado ? 0 : (material.precio * material.cantidad)), 0);

//     let materialesHTML = `
//         <div class="tabla-container-tablaTarjeta">
//             <table id="tabla-MaterialesCatalogo">
//                 <thead class="encabezadoTablasTarjeta">
//                     <tr>
//                         <th style="width: 8rem;">ID</th>
//                         <th>Descripción</th>
//                         <th style="width: 8rem;">Unidad</th>
//                         <th style="width: 8rem;">Precio U</th>
//                         <th style="width: 8rem;">Cantidad</th>
//                         <th style="width: 11rem;">Suministrado por CFE</th>
//                         <th style="width: 9rem;">Importe</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${MaterialesConcepto.length > 0 ? MaterialesConcepto.map(material => `
//                         <tr>
//                             <td style="text-align: right;">${material.codigo}</td>
//                             <td>${material.descripcion}</td>
//                             <td>${material.unidad}</td>
//                             <td style="text-align: right;">${formatoMXN.format(material.precio)}</td>
//                             <td style="text-align: right;">${material.cantidad}</td>
//                             <td>${material.suministrado ? 'Sí' : 'No'}</td>
//                             <td style="text-align: right;">${formatoMXN.format(material.suministrado ? 0 : (material.precio * material.cantidad))}</td>
//                         </tr>
//                     `).join('') : `
//                         <tr>
//                             <td colspan="7">Sin resultados</td>
//                         </tr>
//                     `}
//                 </tbody>
//             </table>
//         </div>
//         <div class="totalesTablas">
//             <label class="subtotales_textos">Suma 1:</label>
//             <div>
//                 <label id="SumaImporteMateriales-${idConceptoProyecto}" class="subtotales_numeros_top">${formatoMXN.format(totalImporteMateriales)}</label>
//             </div>
//         </div>
//     `;
//     container.innerHTML += materialesHTML;
// }

// function TraerManoObrasConcepto(idConceptoProyecto) {
//     return new Promise((resolve, reject) => {
//         let ManoObraConcepto = [];
//         const datos = {};
//         datos.idConcepto = idConceptoProyecto;
//         let json = JSON.stringify(datos);
//         let url = "../ws/TarjetaManoObra/wsGetManoObraTarjeta.php";
//         $.post(url, json, (responseText, status) => {
//             try {
//                 if (status == "success") {
//                     let resp = JSON.parse(responseText);
//                     let datosBd = resp.datos;
//                     if (datosBd) {
//                         datosBd.forEach((datos) => {
//                             const cantidad = 1 / datos.rendimiento;
//                             const sr = datos.salario * cantidad;
//                             const importe = datos.rendimiento === 0 ? 0 : sr / datos.rendimiento;
//                             ManoObraConcepto.push({
//                                 idmanoobra: datos.idmanoobra,
//                                 categoria: datos.categoria,
//                                 unidad: datos.unidad,
//                                 salario: datos.salario,
//                                 rendimiento: datos.rendimiento,
//                                 cantidad: cantidad,
//                                 sr: sr,
//                                 importe: importe,
//                                 estatus: datos.estatus,
//                             });
//                         });
//                     }
//                     GeneradorTablaManoObra(ManoObraConcepto, idConceptoProyecto);
//                     resolve();
//                 } else {
//                     throw new Error(status);
//                 }
//             } catch (error) {
//                 alert("Error: " + error);
//                 reject(error);
//             }
//         });
//     });
// }

// function GeneradorTablaManoObra(ManoObraConcepto, idConceptoProyecto) {
//     const container = document.getElementById(`manoObra-${idConceptoProyecto}`);
//     if (!container) return;
//     const formatoMXN = new Intl.NumberFormat('es-MX', {
//         style: 'currency',
//         currency: 'MXN'
//     });

//     let totalImporteManoObra = ManoObraConcepto.reduce((total, manoObra) => total + manoObra.importe, 0);

//     let manoObraHTML = `
//         <div class="tabla-container-tablaTarjeta">
//             <table id="tabla-MaterialesCatalogo">
//                 <thead class="encabezadoTablasTarjeta">
//                     <tr>
//                         <th style="width: 8rem;">ID</th>
//                         <th>Categoría</th>
//                         <th style="width: 10rem;">Unidad</th>
//                         <th style="width: 8rem;">Salario</th>
//                         <th style="width: 8rem;">Rendimiento</th>
//                         <th style="width: 8rem;">Cantidad</th>
//                         <th style="width: 8rem;">Sr</th>
//                         <th style="width: 9rem;">Importe</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${ManoObraConcepto.length > 0 ? ManoObraConcepto.map(manoObra => `
//                         <tr>
//                             <td>${manoObra.idmanoobra}</td>
//                             <td>${manoObra.categoria}</td>
//                             <td>${manoObra.unidad}</td>
//                             <td style="text-align: right;">${formatoMXN.format(manoObra.salario)}</td>
//                             <td style="text-align: right;">${manoObra.rendimiento}</td>
//                             <td style="text-align: right;">${manoObra.cantidad.toFixed(2)}</td>
//                             <td style="text-align: right;">${formatoMXN.format(manoObra.sr)}</td>
//                             <td style="text-align: right;">${formatoMXN.format(manoObra.importe)}</td>
//                         </tr>
//                     `).join('') : `
//                         <tr>
//                             <td colspan="8">Sin resultados</td>
//                         </tr>
//                     `}
//                 </tbody>
//             </table>
//         </div>
//         <div class="totalesTablas">
//             <label class="subtotales_textos">Suma 2:</label>
//             <div>
//                 <label id="SumaImporteManoObra-${idConceptoProyecto}" class="subtotales_numeros_top">${formatoMXN.format(totalImporteManoObra)}</label>
//             </div>
//         </div>
//     `;
//     container.innerHTML += manoObraHTML;

//     GeneradorTablaHerramientaEquipo(idConceptoProyecto, totalImporteManoObra);
// }

// function GeneradorTablaHerramientaEquipo(idConceptoProyecto, totalImporteManoObra) {
//     const container = document.getElementById(`herramientaEquipo-${idConceptoProyecto}`);
//     if (!container) return;
//     const formatoMXN = new Intl.NumberFormat('es-MX', {
//         style: 'currency',
//         currency: 'MXN'
//     });

//     const khHerramientas = 0.03;
//     const khEquipo = 0.02;

//     const importeHerramientas = khHerramientas * totalImporteManoObra;
//     const importeEquipo = khEquipo * totalImporteManoObra;

//     const totalImporteHerramientaEquipo = importeHerramientas + importeEquipo;

//     let herramientaEquipoHTML = `
//         <div class="tabla-container-tablaTarjeta">
//             <table id="tabla-MaterialesCatalogo">
//                 <thead class="encabezadoTablasTarjeta">
//                     <tr>
//                         <th>Descripción</th>
//                         <th style="width: 8rem;">Kh o Ks</th>
//                         <th style="width: 8rem;">Mo</th>
//                         <th style="width: 9rem;">Importe</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr class="fila">
//                         <td class="Code">Herramientas de mano</td>
//                         <td style="text-align: right;">${khHerramientas}</td>
//                         <td style="text-align: right;">${formatoMXN.format(totalImporteManoObra)}</td>
//                         <td style="text-align: right;">${formatoMXN.format(importeHerramientas)}</td>
//                     </tr>
//                     <tr class="fila">
//                         <td class="Code">Equipo y seguridad</td>
//                         <td style="text-align: right;">${khEquipo}</td>
//                         <td style="text-align: right;" >${formatoMXN.format(totalImporteManoObra)}</td>
//                         <td style="text-align: right;">${formatoMXN.format(importeEquipo)}</td>
//                     </tr>
//                 </tbody>
//             </table>
//         </div>
//         <div class="totalesTablas">
//             <label class="subtotales_textos">Suma 3:</label>
//             <div>
//                 <label id="SumaImporteHerramientaEquipo-${idConceptoProyecto}" class="subtotales_numeros_top">${formatoMXN.format(totalImporteHerramientaEquipo)}</label>
//             </div>
//         </div>
//     `;
//     container.innerHTML += herramientaEquipoHTML;
// }

// function TraerMaquinariaConcepto(idConceptoProyecto) {
//     return new Promise((resolve, reject) => {
//         let MaquinariaConcepto = [];
//         const datos = {};
//         datos.idConcepto = idConceptoProyecto;
//         let json = JSON.stringify(datos);
//         let url = "../ws/TarjetaMaquinaria/wsGetMaquinariaTarjeta.php";
//         $.post(url, json, (responseText, status) => {
//             try {
//                 if (status == "success") {
//                     let resp = JSON.parse(responseText);
//                     let datosBd = resp.datos;
//                     if (datosBd) {
//                         datosBd.forEach((datos) => {
//                             MaquinariaConcepto.push({
//                                 idmaquinaria: datos.idmaquinaria,
//                                 descripcion: datos.descripcion,
//                                 phm: datos.phm,
//                                 rhm: datos.rhm,
//                                 fechaprecio: datos.fechaprecio,
//                                 unidad: datos.unidad,
//                                 estatus: datos.estatus,
//                             });
//                         });
//                     }
//                     GeneradorTablaMaquinaria(MaquinariaConcepto, idConceptoProyecto);
//                     resolve();
//                 } else {
//                     throw new Error(status);
//                 }
//             } catch (error) {
//                 alert("Error: " + error);
//                 reject(error);
//             }
//         });
//     });
// }

// function GeneradorTablaMaquinaria(MaquinariaConcepto, idConceptoProyecto) {
//     const container = document.getElementById(`maquinaria-${idConceptoProyecto}`);
//     if (!container) return;
//     const formatoMXN = new Intl.NumberFormat('es-MX', {
//         style: 'currency',
//         currency: 'MXN'
//     });

//     let totalImporteMaquinaria = MaquinariaConcepto.reduce((total, maquinaria) => total + (maquinaria.phm / maquinaria.rhm), 0);
//     let maquinariaHTML = `
//         <div class="tabla-container-tablaTarjeta">
//             <table id="tabla-MaterialesCatalogo">
//                 <thead class="encabezadoTablasTarjeta">
//                     <tr>
//                         <th style="width: 8rem;">ID</th>
//                         <th>Descripción</th>
//                         <th style="width: 10rem;">Unidad</th>
//                         <th style="width: 8rem;">PhM</th>
//                         <th style="width: 8rem;">RhM</th>
//                         <th style="width: 9rem;">Importe</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${MaquinariaConcepto.length > 0 ? MaquinariaConcepto.map(maquinaria => `
//                         <tr>
//                             <td>${maquinaria.idmaquinaria}</td>
//                             <td>${maquinaria.descripcion}</td>
//                             <td>${maquinaria.unidad}</td>
//                             <td style="text-align: right;">${formatoMXN.format(maquinaria.phm)}</td>
//                             <td style="text-align: right;">${maquinaria.rhm}</td>
//                             <td style="text-align: right;">${formatoMXN.format(maquinaria.phm / maquinaria.rhm)}</td>
//                         </tr>
//                     `).join('') : `
//                         <tr>
//                             <td colspan="6">Sin resultados</td>
//                         </tr>
//                     `}
//                 </tbody>
//             </table>
//         </div>
//         <div class="totalesTablas">
//             <label class="subtotales_textos">Suma 4:</label>
//             <div>
//                 <label id="SumaImporteMaquinaria-${idConceptoProyecto}" class="subtotales_numeros_top">${formatoMXN.format(totalImporteMaquinaria)}</label>
//             </div>
//         </div>
//     `;
//     container.innerHTML += maquinariaHTML;
// }

// function TraerBasicoConcepto(idConceptoProyecto) {
//     return new Promise((resolve, reject) => {
//         let BasicoConcepto = [];
//         const datos = {};
//         datos.idConcepto = idConceptoProyecto;
//         let json = JSON.stringify(datos);
//         let url = "../ws/TarjetaBasicos/wsGetBasicosTarjeta.php";
//         $.post(url, json, (responseText, status) => {
//             try {
//                 if (status == "success") {
//                     let resp = JSON.parse(responseText);
//                     let datosBd = resp.datos;
//                     if (datosBd) {
//                         datosBd.forEach((datos) => {
//                             BasicoConcepto.push({
//                                 idconbasi: datos.idconbasi,
//                                 nombre: datos.nombre,
//                                 cantconbasi: datos.cantconbasi,
//                                 total: datos.total,
//                                 unidad: datos.unidad,
//                                 estatus: datos.estatus
//                             });
//                         });
//                     }
//                     GeneradorTablaBasico(BasicoConcepto, idConceptoProyecto);
//                     resolve();
//                 } else {
//                     throw new Error(status);
//                 }
//             } catch (error) {
//                 alert("Error: " + error);
//                 reject(error);
//             }
//         });
//     });
// }

// function GeneradorTablaBasico(BasicoConcepto, idConceptoProyecto) {
//     const container = document.getElementById(`basico-${idConceptoProyecto}`);
//     if (!container) return;
//     const formatoMXN = new Intl.NumberFormat('es-MX', {
//         style: 'currency',
//         currency: 'MXN'
//     });

//     let totalImporteBasico = BasicoConcepto.reduce((total, basico) => total + (basico.total * basico.cantconbasi), 0);

//     let basicoHTML = `
//         <div class="tabla-container-tablaTarjeta">
//             <table id="tabla-MaterialesCatalogo">
//                 <thead class="encabezadoTablasTarjeta">
//                     <tr>
//                         <th style="width: 8rem;">ID</th>
//                         <th>Descripción</th>
//                         <th style="width: 10rem;">Unidad</th>
//                         <th style="width: 8rem;">Precio U</th>
//                         <th style="width: 8rem;">Cantidad</th>
//                         <th style="width: 9rem;">Importe</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${BasicoConcepto.length > 0 ? BasicoConcepto.map(basico => `
//                         <tr>
//                             <td>${basico.idconbasi}</td>
//                             <td>${basico.nombre}</td>
//                             <td>${basico.unidad}</td>
//                             <td style="text-align: right;">${formatoMXN.format(basico.total)}</td>
//                             <td style="text-align: right;">${basico.cantconbasi}</td>
//                             <td style="text-align: right;">${formatoMXN.format(basico.total * basico.cantconbasi)}</td>
//                         </tr>
//                     `).join('') : `
//                         <tr>
//                             <td colspan="6">Sin resultados</td>
//                         </tr>
//                     `}
//                 </tbody>
//             </table>
//         </div>
//         <div class="totalesTablas">
//             <label class="subtotales_textos">Suma 5:</label>
//             <div>
//                 <label id="SumaImporteBasico-${idConceptoProyecto}" class="subtotales_numeros_top">${formatoMXN.format(totalImporteBasico)}</label>
//             </div>
//         </div>
//     `;
//     container.innerHTML += basicoHTML;

//     // Actualizar el costo total
//     actualizarCostoTotal(idConceptoProyecto);
// }

// function actualizarCostoTotal(idConceptoProyecto) {
//     const totalMateriales = parseFloat(document.getElementById(`SumaImporteMateriales-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
//     const totalManoObra = parseFloat(document.getElementById(`SumaImporteManoObra-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
//     const totalHerramientaEquipo = parseFloat(document.getElementById(`SumaImporteHerramientaEquipo-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
//     const totalMaquinaria = parseFloat(document.getElementById(`SumaImporteMaquinaria-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
//     const totalBasico = parseFloat(document.getElementById(`SumaImporteBasico-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;

//     const costoTotal = totalMateriales + totalManoObra + totalHerramientaEquipo + totalMaquinaria + totalBasico;

//     const formatoMXN = new Intl.NumberFormat('es-MX', {
//         style: 'currency',
//         currency: 'MXN'
//     });

//     document.getElementById(`CostoTotal-${idConceptoProyecto}`).innerText = formatoMXN.format(costoTotal);
// }



