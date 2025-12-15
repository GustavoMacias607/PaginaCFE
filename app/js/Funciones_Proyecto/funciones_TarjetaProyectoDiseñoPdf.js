async function GeneradorTablaConceptoPDF() {
    const container = document.getElementById('contenedor-cfe');
    const divCarga = document.getElementById("divCargaExport");
    const textoCarga = document.getElementById("porcentajeExportacion");

    if (!container) {
        console.error('Contenedor "contenedor-cfe" no encontrado');
        return;
    }
    // Mostrar mensaje de carga
    divCarga.style.display = "flex";
    textoCarga.textContent = "Cargando para exportar... 0%";

    container.innerHTML = '';
    let conceptos = Object.values(editedRows);

    const total = conceptos.length;
    let procesadas = 0;

    for (const concepto of conceptos) {
        if (pantallaFuncion != "addProyTermFrm") return;
        // Construir HTML de la tarjeta del concepto
        let conceptoHTML = `
            <div id="concepto-${concepto.idconcepto}" class="tarjeta-concepto">
                <div class="contTabla-materialesmodal_catalogo">
                    <div>
                        <table style="width: 100rem">
                            <thead>
                                <tr class="todosBordes">
                                    <td class="textIzq" style="text-align: justify; height: fit-content;">Para: ${datosProyecto.nombre}</td>
                                </tr>
                            </thead>
                        </table>
                        <table style="width: 100rem">
                            <thead>
                                <tr class="todosBordes">
                                    <th class="textIzq" style="width: 9rem;">No. Concepto</th>
                                    <td class="textDer" style="width:4rem; border: 1px solid #000;">${String(procesadas + 1).padStart(3, '0')}</td>
                                    <th class="textIzq" style="width: 9rem;">Fecha</th>
                                    <td class="textDer" style="width:10rem; border: 1px solid #000;">${ObtenerFechaActualDMY()}</td>
                                    <td class="textCen" style="border: 1px solid #000;">Análisis de los precios unitarios de los conceptos de trabajo</td>
                                </tr>
                            </thead>
                        </table>
                        <table style="width: 100rem">
                            <thead>
                                <tr class="todosBordes">
                                    <th class="textCen" style="width: 9rem;">ID</th>
                                    <th class="textCen">Concepto</th>
                                    <th class="textCen" style="width: 10rem;">Unidad</th>
                                    <th class="textCen" style="width: 8rem;">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="todosBordes">
                                    <td class="textIzq">${concepto.idconcepto}</td>
                                    <td class="textJus" style="text-align: justify;">${concepto.nombre}</td>
                                    <td class="textIzq">${concepto.unidad}</td>
                                    <td class="textDer">${concepto.cantidad}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Secciones -->
                <div class="titulo-conceptoPDF"><div class="pSeccion-catalogo"><div>Materiales</div></div></div>
                <div id="materialesPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>

                <div class="titulo-conceptoPDF"><div class="pSeccion-catalogo"><div>Mano de obra</div></div></div>
                <div id="manoObraPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>

                <div class="titulo-conceptoPDF"><div class="pSeccion-catalogo"><div>Herramienta y equipo de seguridad</div></div></div>
                <div id="herramientaEquipoPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>

                <div class="titulo-conceptoPDF"><div class="pSeccion-catalogo"><div>Maquinaria</div></div></div>
                <div id="maquinariaPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>

                <div class="titulo-conceptoPDF"><div class="pSeccion-catalogo"><div>Basico</div></div></div>
                <div id="basicoPDF-${concepto.idconcepto}" class="contTabla-materialesmodal_catalogo"></div>

                <!-- Tabla de costos -->
                <div class="contTabla-materialesmodal_catalogo">
                    <div>
                     <table class="todosBordesCuadro">
                                 <tr> 
                                    <td></td>
                                    <td></td>
                                    <td class="terceraColumna"></td>
                                    <td></td>
                                </tr>
                                <tr> 
                                    <td class="primeraColumna negritas">(CD) COSTO DIRECTO</td>
                                    <td style="width: 18rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="CostoDirectoPDF-${concepto.idconcepto}"  class="textDer ultimaColumna negritas" style="width: 10rem;">3454</td>
                                </tr>
                                <tr> 
                                    <td  class="primeraColumna">(CI) COSTO INDIRECTOS</td>
                                    <td style="width: 15rem;">${costosAdicionales.CIndirecto}.00%</td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="costoIndirectoPDF-${concepto.idconcepto}" class="textDer style="width: 10rem;">45454</td>
                                </tr>
                                  <tr> 
                                    <td class="primeraColumna">SUBTOTALE1</td>
                                    <td style="width: 15rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="subTotal1PDF-${concepto.idconcepto}"  class="textDer ultimaColumna" style="width: 10rem;">4545</td>
                                </tr>
                                  <tr> 
                                    <td   class="primeraColumna">(CF) FINANCIAMIENTO</td>
                                    <td style="width: 15rem;">${costosAdicionales.Financiamiento}.00%</td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="financiamientoPDF-${concepto.idconcepto}" class="textDer" style="width: 10rem;">4545</td>
                                </tr>
                                  <tr> 
                                    <td class="primeraColumna">SUBTOTAL2</td>
                                    <td style="width: 15rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="subTotal2PDF-${concepto.idconcepto}"  class="textDer ultimaColumna" style="width: 10rem;">34534</td>
                                </tr>
                                  <tr> 
                                    <td class="primeraColumna">(CU) UTILIDAD</td>
                                    <td style="width: 15rem;">${costosAdicionales.utilidad}.00%</td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="utilidadPDF-${concepto.idconcepto}" class="textDer" style="width: 10rem;">3453</td>
                                </tr>
                                  <tr> 
                                    <td  class="primeraColumna">SUBTOTAL3</td>
                                    <td style="width: 15rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="subTotal3PDF-${concepto.idconcepto}" class="textDer ultimaColumna" style="width: 10rem;">345345</td>
                                </tr>
                                  <tr> 
                                    <td class="primeraColumna">CARGOS ADICIONALES</td>
                                    <td style="width: 15rem;">${costosAdicionales.CAdicionales}0%</td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                     <td id="cargosAdicionalesPDF-${concepto.idconcepto}"  class="textDer" style="width: 10rem;">3453</td>
                                </tr>
                                  <tr> 
                                    <td class="primeraColumna negritas">PRECIO UNITARIO (CD+CIO+CIC+CF+CU+CA)</td>
                                    <td style="width: 15rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td id="precioUnitarioPDF-${concepto.idconcepto}" class="textDer ultimaColumna negritas" style="width: 10rem;"></td>
                                </tr>
                                  <tr> 
                                    <td id="LecturaPrecioUnitarioPDF-${concepto.idconcepto}" class="primeraColumna negritas"></td>
                                    <td style="width: 15rem;"></td>
                                    <td style="width: 5rem;" class="terceraColumna"></td>
                                    <td class="textDer" style="width: 10rem;"></td>
                                </tr>
                                  <tr> 
                                    <td></td>
                                    <td></td>
                                    <td class="terceraColumna"></td>
                                    <td></td>
                                </tr>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Agregar al contenedor
        container.innerHTML += conceptoHTML;

        // Cargar datos específicos
        await TraerMaterialesConceptoPDF(concepto.idconcepto, false);
        await TraerManoObrasConceptoPDF(concepto.idconcepto, false);
        await TraerMaquinariaConceptoPDF(concepto.idconcepto, false);
        await TraerBasicoConceptoPDF(concepto.idconcepto, false);

        // Actualizar progreso
        procesadas++;
        const porcentaje = Math.round((procesadas / total) * 100);
        textoCarga.textContent = `Cargando para exportar... ${porcentaje}%`;
    }

    // Todo cargado
    textoCarga.textContent = "Listo para exportar - 100% ";
    await new Promise(resolve => setTimeout(resolve, 400));

    let btn = document.getElementById("btnExportarPDF");
    btn.removeAttribute("disabled");
    btn.classList.remove("btnClickeadoExportar");

    let btnExcel = document.getElementById("btnExportar");
    btnExcel.removeAttribute("disabled");
    btnExcel.classList.remove("btnClickeadoExportar");
    document.getElementById("divCargaExport").style.display = "none";

    divCarga.style.display = "none";
}

function TraerMaterialesConceptoPDF(idConceptoProyecto, excel) {
    const excelFlag = excel;
    return new Promise((resolve, reject) => {
        let MaterialesConcepto = [];
        const datos = { idConcepto: idConceptoProyecto };
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
                                suministrado: datos.suministrado == 1,
                                estatus: datos.estatus
                            });
                        });
                    }

                    if (!excelFlag) {
                        GeneradorTablaMaterialesPDF(MaterialesConcepto, idConceptoProyecto);
                    }
                    resolve(MaterialesConcepto);
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
    if (!container) return;
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
                        <th class="textCen" style="width: 8rem;">ID</th>
                        <th class="textCen">Descripción</th>
                        <th class="textCen" style="width: 8rem;">Unidad</th>
                        <th class="textCen" style="width: 8rem;">Precio U</th>
                        <th class="textCen" style="width: 8rem;">Cantidad</th>
                        <th class="textCen" style="width: 14rem;">Suministrado por CFE</th>
                        <th class="textCen" style="width: 15rem;">M = Precio * Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    ${MaterialesConcepto.length > 0 ? MaterialesConcepto.map(material => `
                        <tr class="todosBordes">
                            <td class="textDer">${material.codigo}</td>
                            <td class="textIzq" style="height: fit-content;">${material.descripcion}</td>
                            <td >${material.unidad}</td>
                            <td class="textDer">${formatoMXN.format(material.precio)}</td>
                            <td class="textDer">${material.cantidad}</td>
                            <td class="textIzq">${material.suministrado ? 'Sí' : 'No'}</td>
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

function TraerManoObrasConceptoPDF(idConceptoProyecto, excel) {
    const excelFlag = excel; // <-- capturamos el valor
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
                            const salario = parseFloat(datos.salario) || 0;
                            const rendimiento = parseFloat(datos.rendimiento) || 0;
                            const cantidad = parseFloat(datos.cantidad) || 0;

                            const sr = parseFloat((salario * cantidad).toFixed(2));
                            const importe = rendimiento === 0 ? 0 : parseFloat((sr / rendimiento).toFixed(2));

                            ManoObraConcepto.push({
                                idmanoobra: datos.idmanoobra,
                                categoria: datos.categoria,
                                unidad: datos.unidad,
                                salario: salario,
                                rendimiento: rendimiento,
                                cantidad: cantidad,
                                sr: sr,
                                importe: importe,
                                estatus: datos.estatus,
                            });
                        });

                    }
                    if (!excelFlag) {
                        GeneradorTablaManoObraPDF(ManoObraConcepto, idConceptoProyecto);
                    }
                    resolve(ManoObraConcepto);
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
    if (!container) return;
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
                        <th class="textCen" style="width: 8rem;">ID</th>
                        <th class="textCen">Categoría</th>
                        <th class="textCen" style="width: 10rem;">Unidad</th>
                        <th class="textCen" style="width: 8rem;">Salario</th>
                        <th class="textCen" style="width: 8rem;">R</th>
                        <th class="textCen" style="width: 11rem;">Cantidad</th>
                        <th class="textCen" style="width: 11rem;">Sr</th>
                        <th class="textCen" style="width: 15rem;">Mo = Sr/R</th>
                    </tr>
                </thead>
                <tbody>
                    ${ManoObraConcepto.length > 0 ? ManoObraConcepto.map(manoObra => `
                        <tr class="todosBordes">
                            <td>${manoObra.idmanoobra}</td>
                            <td class="textIzq">${manoObra.categoria}</td>
                            <td class="textIzq">${manoObra.unidad}</td>
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
    GeneradorTablaHerramientaEquipoExcel(idConceptoProyecto, totalImporteManoObra);
}

function GeneradorTablaHerramientaEquipoPDF(idConceptoProyecto, totalImporteManoObra) {
    const container = document.getElementById(`herramientaEquipoPDF-${idConceptoProyecto}`);
    if (!container) return;
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
                        <th class="textCen">Descripción</th>
                        <th class="textCen" style="width: 11rem;">Kh o Ks</th>
                        <th class="textCen" style="width: 11rem;">Mo</th>
                        <th class="textCen" style="width: 15rem;">HE = Kh * Mo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="todosBordes">
                        <td class="Code">Herramientas de mano</td>
                        <td class="textDer">${khHerramientas}</td>
                        <td class="textDer">${formatoMXN.format(totalImporteManoObra)}</td>
                        <td class="textDer">${formatoMXN.format(importeHerramientas)}</td>
                    </tr>
                    <tr class="todosBordes">
                        <td class="Code">Equipo y seguridad</td>
                        <td class="textDer">${khEquipo}</td>
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

function TraerMaquinariaConceptoPDF(idConceptoProyecto, excel) {
    const excelFlag = excel;
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
                    if (!excelFlag) {
                        GeneradorTablaMaquinariaPDF(MaquinariaConcepto, idConceptoProyecto);
                    }

                    resolve(MaquinariaConcepto);
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
    if (!container) return;
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteMaquinaria = MaquinariaConcepto.reduce((total, maquinaria) => total + (maquinaria.phm / maquinaria.rhm), 0);

    let maquinariaHTML = `
        <div>
            <table>
                <thead>
                    <tr class="todosBordes">
                        <th  class="textCen" style="width: 8rem;">ID</th>
                        <th class="textCen">Descripción</th>
                        <th  class="textCen" style="width: 10rem;">Unidad</th>
                        <th  class="textCen" style="width: 11rem;">PhM</th>
                        <th  class="textCen" style="width: 11rem;">RhM</th>
                        <th  class="textCen" style="width: 15rem;">Ma = PhM / RhM</th>
                    </tr>
                </thead>
                <tbody>
                    ${MaquinariaConcepto.length > 0 ? MaquinariaConcepto.map(maquinaria => `
                        <tr class="todosBordes">
                            <td>${maquinaria.idmaquinaria}</td>
                            <td>${maquinaria.descripcion}</td>
                            <td class="textIzq">${maquinaria.unidad}</td>
                            <td class="textDer">${formatoMXN.format(maquinaria.phm)}</td>
                            <td class="textDer">${maquinaria.rhm}</td>
                            <td class="textDer">${formatoMXN.format(maquinaria.phm / maquinaria.rhm)}</td>
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

function TraerBasicoConceptoPDF(idConceptoProyecto, excel) {
    const excelFlag = excel;
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
                    if (!excelFlag) {
                        GeneradorTablaBasicoPDF(BasicoConcepto, idConceptoProyecto);
                    }
                    resolve(BasicoConcepto);
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
    if (!container) return;
    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let totalImporteBasico = BasicoConcepto.reduce((total, basico) => total + (basico.total * basico.cantconbasi), 0);

    let basicoHTML = `
        <div>
            <table style="width: 100rem">
                <thead>
                    <tr class="todosBordes">
                        <th  class="textCen" style="width: 8rem;">ID</th>
                        <th class="textCen" >Descripción</th>
                        <th  class="textCen" style="width: 10rem;">Unidad</th>
                        <th  class="textCen" style="width: 11rem;">Precio U</th>
                        <th  class="textCen" style="width: 11rem;">Cantidad</th>
                        <th  class="textCen" style="width: 15rem;">B = Precio * Cantidad</th>
                    </tr>
                </thead>
                <tbody >
                    ${BasicoConcepto.length > 0 ? BasicoConcepto.map(basico => `
                        <tr class="todosBordes">
                            <td>${basico.idconbasi}</td>
                            <td style="text-align: justify; height: fit-content;">${basico.nombre}</td>
                            <td class="textIzq">${basico.unidad}</td>
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

async function actualizarCostoTotalPDF(idConceptoProyecto) {
    try {
        // Helper para obtener el valor numérico seguro de un elemento
        const obtenerValorElemento = async (id) => {
            const elemento = document.getElementById(id);
            if (!elemento) {
                console.warn(`Elemento no encontrado: ${id}`);
                return 0;
            }
            const texto = elemento.innerText || elemento.textContent || "";
            const numero = parseFloat(texto.replace(/[^0-9.-]+/g, "")) || 0;
            return numero;
        };


        // Obtener todos los totales (esperando a que existan)
        const totalMateriales = await obtenerValorElemento(`SumaImporteMaterialesPDF-${idConceptoProyecto}`);
        const totalManoObra = await obtenerValorElemento(`SumaImporteManoObraPDF-${idConceptoProyecto}`);
        const totalHerramientaEquipo = await obtenerValorElemento(`SumaImporteHerramientaEquipoPDF-${idConceptoProyecto}`);
        const totalMaquinaria = await obtenerValorElemento(`SumaImporteMaquinariaPDF-${idConceptoProyecto}`);
        const totalBasico = await obtenerValorElemento(`SumaImporteBasicoPDF-${idConceptoProyecto}`);
        // Validar que costosAdicionales exista y tenga valores numéricos
        if (typeof costosAdicionales !== "object" || costosAdicionales === null) {
            throw new Error("El objeto 'costosAdicionales' no está definido o es inválido.");
        }

        const {
            CIndirecto = 0,
            Financiamiento = 0,
            utilidad = 0,
            CAdicionales = 0
        } = costosAdicionales;

        // Calcular totales
        const costoDirecto = totalMateriales + totalManoObra + totalHerramientaEquipo + totalMaquinaria + totalBasico;
        const costoIndirecto = costoDirecto * (CIndirecto / 100);
        const subTotal1 = costoDirecto + costoIndirecto;
        const financiamiento = subTotal1 * (Financiamiento / 100);
        const subTotal2 = subTotal1 + financiamiento;
        const utilidadCalc = subTotal2 * (utilidad / 100);
        const subTotal3 = subTotal2 + utilidadCalc;
        const cargosAdicionales = subTotal3 * (CAdicionales / 100);
        const precioUnitario = subTotal3 + cargosAdicionales;

        // Convertir a letras
        const letras = numeroALetras(precioUnitario.toFixed(2).toString());

        // Formato de moneda
        const formatoMXN = new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN"
        });

        // Helper para actualizar texto de forma segura
        const actualizarTexto = (id, valor) => {
            const elemento = document.getElementById(id);
            if (!elemento) {
                console.warn(`No se encontró el elemento con ID: ${id}`);
                return;
            }
            elemento.innerText = valor;
        };

        // Actualizar campos en pantalla
        actualizarTexto(`CostoDirectoPDF-${idConceptoProyecto}`, formatoMXN.format(costoDirecto));
        actualizarTexto(`costoIndirectoPDF-${idConceptoProyecto}`, formatoMXN.format(costoIndirecto));
        actualizarTexto(`subTotal1PDF-${idConceptoProyecto}`, formatoMXN.format(subTotal1));
        actualizarTexto(`financiamientoPDF-${idConceptoProyecto}`, formatoMXN.format(financiamiento));
        actualizarTexto(`subTotal2PDF-${idConceptoProyecto}`, formatoMXN.format(subTotal2));
        actualizarTexto(`utilidadPDF-${idConceptoProyecto}`, formatoMXN.format(utilidadCalc));
        actualizarTexto(`subTotal3PDF-${idConceptoProyecto}`, formatoMXN.format(subTotal3));
        actualizarTexto(`cargosAdicionalesPDF-${idConceptoProyecto}`, formatoMXN.format(cargosAdicionales));
        actualizarTexto(`precioUnitarioPDF-${idConceptoProyecto}`, formatoMXN.format(precioUnitario));
        actualizarTexto(`LecturaPrecioUnitarioPDF-${idConceptoProyecto}`, `("${letras}")`);

    } catch (error) {
        console.error("Error en actualizarCostoTotalPDF:", error);
    }
}

function numeroALetras(precioUnitario) {
    const unidades = [
        "", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"
    ];
    const decenas = [
        "", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA",
        "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"
    ];
    const especiales = [
        "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE",
        "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"
    ];
    const centenas = [
        "", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS",
        "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"
    ];

    const convertirGrupo = (num) => {
        let resultado = "";

        if (num.length === 3) {
            if (num === "100") return "CIEN";
            resultado += centenas[parseInt(num[0])] + " ";
            num = num.slice(1);
        }

        if (num.length === 2) {
            if (num[0] === "1") {
                return resultado + especiales[parseInt(num[1])] || "";
            } else if (num[0] === "2" && num[1] !== "0") {
                return resultado + "VEINTI" + unidades[parseInt(num[1])];
            } else {
                resultado += decenas[parseInt(num[0])] + " ";
                num = num.slice(1);
            }
        }

        if (num.length === 1) {
            resultado += unidades[parseInt(num)];
        }

        return resultado.trim();
    };

    const separarMiles = (num) => {
        const partes = [];
        while (num.length > 0) {
            partes.unshift(num.slice(-3));
            num = num.slice(0, -3);
        }
        return partes;
    };

    const precioNumerico = parseFloat(precioUnitario.replace(/,/g, ""));
    const enteros = Math.floor(precioNumerico);
    const centavos = Math.round((precioNumerico - enteros) * 100);

    const grupos = separarMiles(enteros.toString());
    const sufijos = ["", "MIL", "MILLONES", "MIL MILLONES"]; // Para manejar grandes cantidades

    const gruposEnPalabras = grupos.map((grupo, i) => {
        const palabras = convertirGrupo(grupo);
        const sufijo = sufijos[grupos.length - 1 - i]; // Asegura el orden correcto
        return palabras ? `${palabras} ${sufijo}`.trim() : "";
    });

    // Filtrar grupos vacíos (como "MIL" cuando el grupo es 0)
    const resultadoEnteros = gruposEnPalabras
        .filter((palabra) => palabra && !palabra.includes("undefined"))
        .join(" ")
        .trim();

    const resultadoCentavos = centavos ? `${centavos}/100 M.N` : "00/100 M.N";

    return `${resultadoEnteros} PESOS ${resultadoCentavos}`;
}


