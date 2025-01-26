
async function GeneradorTablaConcepto() {
    const container = document.getElementById('tablaTarjetasProyecto');
    if (!container) {
        console.error('Contenedor "tablaTarjetasProyecto" no encontrado');
        return;
    }
    container.innerHTML = '';
    let conceptos = Object.values(editedRows);
    console.log(conceptos);
    for (const concepto of conceptos) {
        let conceptoHTML = `
       
            <div id="concepto-${concepto.idconcepto}" class="tarjeta-concepto">
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
                                    <th style="width: 8rem;">ID</th>
                                    <th>Nombre</th>
                                    <th style="width: 10rem;">Unidad</th>
                                    <th style="width: 8rem; display: table-cell;">Familia</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${concepto.idconcepto}</td>
                                    <td>${concepto.nombre}</td>
                                    <td>${concepto.unidad}</td>
                                    <td>${concepto.familia || '---'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="titulo-concepto">
                    <div class="pSeccion-catalogo">
                        <div>Materiales</div>
                    </div>
                </div>
                <div id="materiales-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-concepto">
                    <div class="pSeccion-catalogo">
                        <div>Mano de obra</div>
                    </div>
                </div>
                <div id="manoObra-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-concepto">
                    <div class="pSeccion-catalogo">
                        <div>Herramienta y equipo de seguridad</div>
                    </div>
                </div>
                <div id="herramientaEquipo-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-concepto">
                    <div class="pSeccion-catalogo">
                        <div>Maquinaria</div>
                    </div>
                </div>
                <div id="maquinaria-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-concepto">
                    <div class="pSeccion-catalogo">
                        <div>Basico</div>
                    </div>
                </div>
                <div id="basico-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>

                <div class="totalesTablas claseTotales">
                    <label class="subtotales_textos">Costo Total:</label>
                    <div>
                        <label id="CostoTotal-${concepto.idconcepto}" class="subtotales_numeros_top">0</label>
                    </div>
                </div>
                <hr class="separador-tarjetas">
            </div>
        `;
        container.innerHTML += conceptoHTML;
        await TraerMaterialesConcepto(concepto.idconcepto);
        await TraerManoObrasConcepto(concepto.idconcepto);
        await TraerMaquinariaConcepto(concepto.idconcepto);
        await TraerBasicoConcepto(concepto.idconcepto);
    }
}

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
                    GeneradorTablaMateriales(MaterialesConcepto, idConceptoProyecto);
                    resolve();
                } else {
                    throw new Error(status);
                }
            } catch (error) {
                alert("Error: " + error);
                reject(error);
            }
        });
    });
}

function GeneradorTablaMateriales(MaterialesConcepto, idConceptoProyecto) {
    const container = document.getElementById(`materiales-${idConceptoProyecto}`);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteMateriales = MaterialesConcepto.reduce((total, material) => total + (material.suministrado ? 0 : (material.precio * material.cantidad)), 0);

    let materialesHTML = `
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
                    ${MaterialesConcepto.length > 0 ? MaterialesConcepto.map(material => `
                        <tr>
                            <td>${material.codigo}</td>
                            <td>${material.descripcion}</td>
                            <td>${material.unidad}</td>
                            <td>${formatoMXN.format(material.precio)}</td>
                            <td>${material.cantidad}</td>
                            <td>${material.suministrado ? 'Sí' : 'No'}</td>
                            <td>${formatoMXN.format(material.suministrado ? 0 : (material.precio * material.cantidad))}</td>
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
                <label id="SumaImporteMateriales-${idConceptoProyecto}" class="subtotales_numeros_top">${formatoMXN.format(totalImporteMateriales)}</label>
            </div>
        </div>
    `;
    container.innerHTML += materialesHTML;
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
                    GeneradorTablaManoObra(ManoObraConcepto, idConceptoProyecto);
                    resolve();
                } else {
                    throw new Error(status);
                }
            } catch (error) {
                alert("Error: " + error);
                reject(error);
            }
        });
    });
}

function GeneradorTablaManoObra(ManoObraConcepto, idConceptoProyecto) {
    const container = document.getElementById(`manoObra-${idConceptoProyecto}`);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteManoObra = ManoObraConcepto.reduce((total, manoObra) => total + manoObra.importe, 0);

    let manoObraHTML = `
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
                    ${ManoObraConcepto.length > 0 ? ManoObraConcepto.map(manoObra => `
                        <tr>
                            <td>${manoObra.idmanoobra}</td>
                            <td>${manoObra.categoria}</td>
                            <td>${manoObra.unidad}</td>
                            <td>${formatoMXN.format(manoObra.salario)}</td>
                            <td>${manoObra.rendimiento}</td>
                            <td>${manoObra.cantidad.toFixed(2)}</td>
                            <td>${formatoMXN.format(manoObra.sr)}</td>
                            <td>${formatoMXN.format(manoObra.importe)}</td>
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
                <label id="SumaImporteManoObra-${idConceptoProyecto}" class="subtotales_numeros_top">${formatoMXN.format(totalImporteManoObra)}</label>
            </div>
        </div>
    `;
    container.innerHTML += manoObraHTML;

    GeneradorTablaHerramientaEquipo(idConceptoProyecto, totalImporteManoObra);
}

function GeneradorTablaHerramientaEquipo(idConceptoProyecto, totalImporteManoObra) {
    const container = document.getElementById(`herramientaEquipo-${idConceptoProyecto}`);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    const khHerramientas = 0.03;
    const khEquipo = 0.02;

    const importeHerramientas = khHerramientas * totalImporteManoObra;
    const importeEquipo = khEquipo * totalImporteManoObra;

    const totalImporteHerramientaEquipo = importeHerramientas + importeEquipo;

    let herramientaEquipoHTML = `
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
                        <td>${khHerramientas}</td>
                        <td>${formatoMXN.format(totalImporteManoObra)}</td>
                        <td>${formatoMXN.format(importeHerramientas)}</td>
                    </tr>
                    <tr class="fila">
                        <td class="Code">Equipo y seguridad</td>
                        <td>${khEquipo}</td>
                        <td>${formatoMXN.format(totalImporteManoObra)}</td>
                        <td>${formatoMXN.format(importeEquipo)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="totalesTablas">
            <label class="subtotales_textos">Suma 3:</label>
            <div>
                <label id="SumaImporteHerramientaEquipo-${idConceptoProyecto}" class="subtotales_numeros_top">${formatoMXN.format(totalImporteHerramientaEquipo)}</label>
            </div>
        </div>
    `;
    container.innerHTML += herramientaEquipoHTML;
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
                    GeneradorTablaMaquinaria(MaquinariaConcepto, idConceptoProyecto);
                    resolve();
                } else {
                    throw new Error(status);
                }
            } catch (error) {
                alert("Error: " + error);
                reject(error);
            }
        });
    });
}

function GeneradorTablaMaquinaria(MaquinariaConcepto, idConceptoProyecto) {
    const container = document.getElementById(`maquinaria-${idConceptoProyecto}`);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteMaquinaria = MaquinariaConcepto.reduce((total, maquinaria) => total + (maquinaria.phm / maquinaria.rhm), 0);

    let maquinariaHTML = `
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
                    ${MaquinariaConcepto.length > 0 ? MaquinariaConcepto.map(maquinaria => `
                        <tr>
                            <td>${maquinaria.idmaquinaria}</td>
                            <td>${maquinaria.descripcion}</td>
                            <td>${maquinaria.unidad}</td>
                            <td>${formatoMXN.format(maquinaria.phm)}</td>
                            <td>${maquinaria.rhm}</td>
                            <td>${formatoMXN.format(maquinaria.phm * maquinaria.rhm)}</td>
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
                <label id="SumaImporteMaquinaria-${idConceptoProyecto}" class="subtotales_numeros_top">${formatoMXN.format(totalImporteMaquinaria)}</label>
            </div>
        </div>
    `;
    container.innerHTML += maquinariaHTML;
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
                    GeneradorTablaBasico(BasicoConcepto, idConceptoProyecto);
                    resolve();
                } else {
                    throw new Error(status);
                }
            } catch (error) {
                alert("Error: " + error);
                reject(error);
            }
        });
    });
}

function GeneradorTablaBasico(BasicoConcepto, idConceptoProyecto) {
    const container = document.getElementById(`basico-${idConceptoProyecto}`);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteBasico = BasicoConcepto.reduce((total, basico) => total + (basico.total * basico.cantconbasi), 0);

    let basicoHTML = `
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
                    ${BasicoConcepto.length > 0 ? BasicoConcepto.map(basico => `
                        <tr>
                            <td>${basico.idconbasi}</td>
                            <td>${basico.nombre}</td>
                            <td>${basico.unidad}</td>
                            <td>${formatoMXN.format(basico.total)}</td>
                            <td>${basico.cantconbasi}</td>
                            <td>${formatoMXN.format(basico.total * basico.cantconbasi)}</td>
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
                <label id="SumaImporteBasico-${idConceptoProyecto}" class="subtotales_numeros_top">${formatoMXN.format(totalImporteBasico)}</label>
            </div>
        </div>
    `;
    container.innerHTML += basicoHTML;

    // Actualizar el costo total
    actualizarCostoTotal(idConceptoProyecto);
}

function actualizarCostoTotal(idConceptoProyecto) {
    const totalMateriales = parseFloat(document.getElementById(`SumaImporteMateriales-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalManoObra = parseFloat(document.getElementById(`SumaImporteManoObra-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalHerramientaEquipo = parseFloat(document.getElementById(`SumaImporteHerramientaEquipo-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalMaquinaria = parseFloat(document.getElementById(`SumaImporteMaquinaria-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalBasico = parseFloat(document.getElementById(`SumaImporteBasico-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;

    const costoTotal = totalMateriales + totalManoObra + totalHerramientaEquipo + totalMaquinaria + totalBasico;

    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    document.getElementById(`CostoTotal-${idConceptoProyecto}`).innerText = formatoMXN.format(costoTotal);
}



