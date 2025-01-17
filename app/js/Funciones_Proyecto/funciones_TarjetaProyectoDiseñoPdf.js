async function GeneradorTablaConceptoPDF() {
    const container = document.getElementById('contenedor-cfe');
    if (!container) {
        console.error('Contenedor "contenedor-cfe" no encontrado');
        return;
    }
    container.innerHTML = '';
    let conceptos = Object.values(editedRows);
    console.log(conceptos);
    for (const concepto of conceptos) {
        let conceptoHTML = `
        
            <div id="concepto-${concepto.idconcepto}" class="tarjeta-concepto">
                <div class="contTabla-materialesmodal_catalogo">
                    <div>
                        <table>
                            <thead>
                                <tr class="todosBordes">
                                    <th class="textIzq" style="width: 8rem;  text-align: justify;">No.</th>
                                    <th class="textIzq">Concepto</th>
                                    <th class="textIzq" style="width: 10rem;">Unidad</th>
                                    <th class="textIzq" style="width: 8rem; display: table-cell;">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="todosBordes"> 
                                    <td class="textIzq">${concepto.idconcepto}</td>
                                    <td class="textJus">${concepto.nombre}</td>
                                    <td class="textCen">${concepto.unidad}</td>
                                    <td class="textDer">${concepto.cantidad}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="titulo-conceptoPDF">
                    <div class="pSeccion-catalogo">
                        <div>Materiales</div>
                    </div>
                </div>
                <div id="materialesPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-conceptoPDF">
                    <div class="pSeccion-catalogo">
                        <div>Mano de obra</div>
                    </div>
                </div>
                <div id="manoObraPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-conceptoPDF">
                    <div class="pSeccion-catalogo">
                        <div>Herramienta y equipo de seguridad</div>
                    </div>
                </div>
                <div id="herramientaEquipoPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-conceptoPDF">
                    <div class="pSeccion-catalogo">
                        <div>Maquinaria</div>
                    </div>
                </div>
                <div id="maquinariaPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>
                <div class="titulo-conceptoPDF">
                    <div class="pSeccion-catalogo">
                        <div>Basico</div>
                    </div>
                </div>
                <div id="basicoPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>

                <div class="totalesTablas claseTotales">
                    <label class="subtotales_textos">Costo Total:</label>
                    <div>
                        <label id="CostoTotalPDF-${concepto.idconcepto}" class="subtotales_numeros_top">0</label>
                    </div>
                </div>
                <hr class="separador-tarjetas">
            </div>
        `;
        container.innerHTML += conceptoHTML;
        await TraerMaterialesConceptoPDF(concepto.idconcepto);
        await TraerManoObrasConceptoPDF(concepto.idconcepto);
        await TraerMaquinariaConceptoPDF(concepto.idconcepto);
        await TraerBasicoConceptoPDF(concepto.idconcepto);
    }
}

function TraerMaterialesConceptoPDF(idConceptoProyecto) {
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
                    GeneradorTablaMaterialesPDF(MaterialesConcepto, idConceptoProyecto);
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

function GeneradorTablaMaterialesPDF(MaterialesConcepto, idConceptoProyecto) {
    const container = document.getElementById(`materialesPDF-${idConceptoProyecto}`);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteMateriales = MaterialesConcepto.reduce((total, material) => total + (material.suministrado ? 0 : (material.precio * material.cantidad)), 0);

    let materialesHTML = `
        <div>
            <table>
                <thead>
                    <tr class="todosBordes">
                        <th style="width: 8rem;">ID</th>
                        <th>Descripción</th>
                        <th style="width: 8rem;">Unidad</th>
                        <th style="width: 8rem;">Precio U</th>
                        <th style="width: 8rem;">Cantidad</th>
                        <th style="width: 14rem;">Suministrado por CFE</th>
                        <th class="textDer" style="width: 15rem;">M = Precio * Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    ${MaterialesConcepto.length > 0 ? MaterialesConcepto.map(material => `
                        <tr class="todosBordes">
                            <td class="textDer">${material.codigo}</td>
                            <td class="textIzq">${material.descripcion}</td>
                            <td>${material.unidad}</td>
                            <td class="textDer">${formatoMXN.format(material.precio)}</td>
                            <td class="textCen">${material.cantidad}</td>
                            <td class="textCen">${material.suministrado ? 'Sí' : 'No'}</td>
                            <td class="textDer">${formatoMXN.format(material.suministrado ? 0 : (material.precio * material.cantidad))}</td>
                        </tr>
                    `).join('') : `
                        <tr class="todosBordes">
                            <td colspan="7">Sin resultados</td>
                        </tr>
                    `}
                    <tr class="sinBorde">
                        <!-- Celdas vacías para las primeras 4 columnas -->
                        <td class="no-border"  colspan="4"></td>
                        <!-- Suma 1 en las últimas 2 columnas -->
                        <td colspan="2" class="textCen todosBordesSum"><strong>SUMA 1:</strong></td>
                        <td id="SumaImporteMaterialesPDF-${idConceptoProyecto}" class="textDer todosBordesSum">
                            <strong>${formatoMXN.format(totalImporteMateriales)}</strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML += materialesHTML;
}

function TraerManoObrasConceptoPDF(idConceptoProyecto) {
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
                    GeneradorTablaManoObraPDF(ManoObraConcepto, idConceptoProyecto);
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

function GeneradorTablaManoObraPDF(ManoObraConcepto, idConceptoProyecto) {
    const container = document.getElementById(`manoObraPDF-${idConceptoProyecto}`);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteManoObra = ManoObraConcepto.reduce((total, manoObra) => total + manoObra.importe, 0);

    let manoObraHTML = `
        <div>
            <table>
                <thead>
                    <tr class="todosBordes">
                        <th style="width: 8rem;">ID</th>
                        <th>Categoría</th>
                        <th style="width: 10rem;">Unidad</th>
                        <th style="width: 8rem;">Salario</th>
                        <th style="width: 8rem;">R</th>
                        <th style="width: 11rem;">Cantidad</th>
                        <th style="width: 11rem;">Sr</th>
                        <th style="width: 15rem;">Mo = Sr/R</th>
                    </tr>
                </thead>
                <tbody>
                    ${ManoObraConcepto.length > 0 ? ManoObraConcepto.map(manoObra => `
                        <tr class="todosBordes">
                            <td>${manoObra.idmanoobra}</td>
                            <td class="textIzq">${manoObra.categoria}</td>
                            <td class="textCen">${manoObra.unidad}</td>
                            <td class="textDer">${formatoMXN.format(manoObra.salario)}</td>
                            <td class="textDer">${manoObra.rendimiento}</td>
                            <td class="textDer">${manoObra.cantidad.toFixed(2)}</td>
                            <td class="textDer">${formatoMXN.format(manoObra.sr)}</td>
                            <td class="textDer">${formatoMXN.format(manoObra.importe)}</td>
                        </tr>
                    `).join('') : `
                        <tr class="todosBordes">
                            <td colspan="8">Sin resultados</td>
                        </tr>
                    `}
                    <tr class="sinBorde">
                        <!-- Celdas vacías para las primeras 4 columnas -->
                        <td class="no-border"  colspan="5"></td>
                        <!-- Suma 1 en las últimas 2 columnas -->
                        <td colspan="2" class="textCen todosBordesSum"><strong>SUMA 2:</strong></td>
                        <td id="SumaImporteManoObraPDF-${idConceptoProyecto}" class="textDer todosBordesSum">
                            <strong>${formatoMXN.format(totalImporteManoObra)}</strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML += manoObraHTML;

    GeneradorTablaHerramientaEquipoPDF(idConceptoProyecto, totalImporteManoObra);
}

function GeneradorTablaHerramientaEquipoPDF(idConceptoProyecto, totalImporteManoObra) {
    const container = document.getElementById(`herramientaEquipoPDF-${idConceptoProyecto}`);
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
        <div>
            <table >
                <thead>
                    <tr class="todosBordes">
                        <th>Descripción</th>
                        <th style="width: 11rem;">Kh o Ks</th>
                        <th style="width: 11rem;">Mo</th>
                        <th style="width: 15rem;">HE = Kh * Mo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="todosBordes">
                        <td class="Code">Herramientas de mano</td>
                        <td>${khHerramientas}</td>
                        <td class="textDer">${formatoMXN.format(totalImporteManoObra)}</td>
                        <td class="textDer">${formatoMXN.format(importeHerramientas)}</td>
                    </tr>
                    <tr class="todosBordes">
                        <td class="Code">Equipo y seguridad</td>
                        <td>${khEquipo}</td>
                        <td class="textDer">${formatoMXN.format(totalImporteManoObra)}</td>
                        <td class="textDer">${formatoMXN.format(importeEquipo)}</td>
                    </tr>
                    <tr class="sinBorde">
                        <!-- Celdas vacías para las primeras 4 columnas -->
                        <td class="no-border"  colspan="1"></td>
                        <!-- Suma 1 en las últimas 2 columnas -->
                        <td colspan="2" class="textCen todosBordesSum"><strong>SUMA 3:</strong></td>
                        <td id="SumaImporteHerramientaEquipoPDF-${idConceptoProyecto}" class="textDer todosBordesSum">
                            <strong>${formatoMXN.format(totalImporteHerramientaEquipo)}</strong>
                        </td>
                    </tr >
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML += herramientaEquipoHTML;
}

function TraerMaquinariaConceptoPDF(idConceptoProyecto) {
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
                    GeneradorTablaMaquinariaPDF(MaquinariaConcepto, idConceptoProyecto);
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

function GeneradorTablaMaquinariaPDF(MaquinariaConcepto, idConceptoProyecto) {
    const container = document.getElementById(`maquinariaPDF-${idConceptoProyecto}`);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteMaquinaria = MaquinariaConcepto.reduce((total, maquinaria) => total + (maquinaria.phm * maquinaria.rhm), 0);

    let maquinariaHTML = `
        <div>
            <table>
                <thead>
                    <tr class="todosBordes">
                        <th style="width: 8rem;">ID</th>
                        <th>Descripción</th>
                        <th style="width: 10rem;">Unidad</th>
                        <th style="width: 11rem;">PhM</th>
                        <th style="width: 11rem;">RhM</th>
                        <th style="width: 15rem;">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    ${MaquinariaConcepto.length > 0 ? MaquinariaConcepto.map(maquinaria => `
                        <tr class="todosBordes">
                            <td>${maquinaria.idmaquinaria}</td>
                            <td>${maquinaria.descripcion}</td>
                            <td class="textCen">${maquinaria.unidad}</td>
                            <td class="textDer">${formatoMXN.format(maquinaria.phm)}</td>
                            <td class="textDer">${maquinaria.rhm}</td>
                            <td class="textDer">${formatoMXN.format(maquinaria.phm * maquinaria.rhm)}</td>
                        </tr>
                    `).join('') : `
                        <tr class="todosBordes">
                            <td colspan="6">Sin resultados</td>
                        </tr>
                    `}
                     <tr class="sinBorde">
                        <!-- Celdas vacías para las primeras 4 columnas -->
                        <td class="no-border"  colspan="3"></td>
                        <!-- Suma 1 en las últimas 2 columnas -->
                        <td colspan="2" class="textCen todosBordesSum"><strong>SUMA 4:</strong></td>
                        <td id="SumaImporteMaquinariaPDF-${idConceptoProyecto}" class="textDer todosBordesSum">
                            <strong>${formatoMXN.format(totalImporteMaquinaria)}</strong>
                        </td>
                    </tr >
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML += maquinariaHTML;
}

function TraerBasicoConceptoPDF(idConceptoProyecto) {
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
                    GeneradorTablaBasicoPDF(BasicoConcepto, idConceptoProyecto);
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

function GeneradorTablaBasicoPDF(BasicoConcepto, idConceptoProyecto) {
    const container = document.getElementById(`basicoPDF-${idConceptoProyecto}`);
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteBasico = BasicoConcepto.reduce((total, basico) => total + (basico.total * basico.cantconbasi), 0);

    let basicoHTML = `
        <div>
            <table>
                <thead>
                    <tr class="todosBordes">
                        <th style="width: 8rem;">ID</th>
                        <th>Descripción</th>
                        <th style="width: 10rem;">Unidad</th>
                        <th style="width: 11rem;">Precio U</th>
                        <th style="width: 11rem;">Cantidad</th>
                        <th style="width: 15rem;">Importe</th>
                    </tr>
                </thead>
                <tbody >
                    ${BasicoConcepto.length > 0 ? BasicoConcepto.map(basico => `
                        <tr class="todosBordes">
                            <td>${basico.idconbasi}</td>
                            <td>${basico.nombre}</td>
                            <td class="textCen">${basico.unidad}</td>
                            <td class="textDer">${formatoMXN.format(basico.total)}</td>
                            <td class="textDer">${basico.cantconbasi}</td>
                            <td class="textDer">${formatoMXN.format(basico.total * basico.cantconbasi)}</td>
                        </tr>
                    `).join('') : `
                        <tr class="todosBordes">
                            <td colspan="6">Sin resultados</td>
                        </tr>
                    `}
                    <tr class="sinBorde">
                        <!-- Celdas vacías para las primeras 4 columnas -->
                        <td class="no-border"  colspan="3"></td>
                        <!-- Suma 1 en las últimas 2 columnas -->
                        <td colspan="2" class="textCen todosBordesSum"><strong>SUMA 5:</strong></td>
                        <td id="SumaImporteBasicoPDF-${idConceptoProyecto}" class="textDer todosBordesSum">
                            <strong>${formatoMXN.format(totalImporteBasico)}</strong>
                        </td>
                    </tr >
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML += basicoHTML;

    // Actualizar el costo total
    actualizarCostoTotalPDF(idConceptoProyecto);
}

function actualizarCostoTotalPDF(idConceptoProyecto) {
    const totalMateriales = parseFloat(document.getElementById(`SumaImporteMaterialesPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalManoObra = parseFloat(document.getElementById(`SumaImporteManoObraPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalHerramientaEquipo = parseFloat(document.getElementById(`SumaImporteHerramientaEquipoPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalMaquinaria = parseFloat(document.getElementById(`SumaImporteMaquinariaPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalBasico = parseFloat(document.getElementById(`SumaImporteBasicoPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;

    const costoTotal = totalMateriales + totalManoObra + totalHerramientaEquipo + totalMaquinaria + totalBasico;

    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    document.getElementById(`CostoTotalPDF-${idConceptoProyecto}`).innerText = formatoMXN.format(costoTotal);
}



