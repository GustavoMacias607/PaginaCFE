async function GeneradorTablaConceptoPDF() {
    const container = document.getElementById('contenedor-cfe');
    if (!container) {
        console.error('Contenedor "contenedor-cfe" no encontrado');
        return;
    }
    container.innerHTML = '';
    let conceptos = Object.values(editedRows);
    contador = 0;
    for (const concepto of conceptos) {
        contador++;
        let conceptoHTML = `
            <div id="concepto-${concepto.idconcepto}" class="tarjeta-concepto">
                <div class="contTabla-materialesmodal_catalogo">
                    <div>
                        <table style="width: 100rem">
                            <thead>
                                <tr class="todosBordes">
                                    <td class="textIzq" style="text-align: justify; height: fit-content; ">Para: ${datosProyecto.nombre}</td>
                                </tr>
                            </thead>
                        </table>
                        <table style="width: 100rem">
                            <thead>
                                <tr class="todosBordes">
                                    <th class="textIzq" style="width: 9rem;  text-align: justify;  ">No. Concepto</th>
                                    <td class="textDer" style="width:4rem; border: 1px solid #000;">${String(contador).padStart(3, '0')}</td>
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
                                    <th class="textCen" style="width: 8rem; display: table-cell;">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="todosBordes"> 
                                    <td class="textIzq">${concepto.idconcepto}</td>
                                    <td class="textJus" style="height: fit-content; text-align: justify;">${concepto.nombre}</td>
                                    <td class="textIzq">${concepto.unidad}</td>
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
        container.innerHTML += conceptoHTML;
        await TraerMaterialesConceptoPDF(concepto.idconcepto, false);
        await TraerManoObrasConceptoPDF(concepto.idconcepto, false);
        await TraerMaquinariaConceptoPDF(concepto.idconcepto, false);
        await TraerBasicoConceptoPDF(concepto.idconcepto, false);
    }
}

function TraerMaterialesConceptoPDF(idConceptoProyecto, excel) {
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
                    if (!excel) {
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
                    if (!excel) {
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
                    if (!excel) {
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
                    if (!excel) {
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

function actualizarCostoTotalPDF(idConceptoProyecto) {
    const totalMateriales = parseFloat(document.getElementById(`SumaImporteMaterialesPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalManoObra = parseFloat(document.getElementById(`SumaImporteManoObraPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalHerramientaEquipo = parseFloat(document.getElementById(`SumaImporteHerramientaEquipoPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalMaquinaria = parseFloat(document.getElementById(`SumaImporteMaquinariaPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;
    const totalBasico = parseFloat(document.getElementById(`SumaImporteBasicoPDF-${idConceptoProyecto}`).innerText.replace(/[^0-9.-]+/g, "")) || 0;

    const costoDirecto = totalMateriales + totalManoObra + totalHerramientaEquipo + totalMaquinaria + totalBasico;
    const costoIndirecto = costoDirecto * (costosAdicionales.CIndirecto / 100);
    const subTotal1 = costoDirecto + costoIndirecto;
    const financiamiento = subTotal1 * (costosAdicionales.Financiamiento / 100);;
    const subTotal2 = financiamiento + subTotal1;
    const utilidad = subTotal2 * (costosAdicionales.utilidad / 100);
    const subTotal3 = utilidad + subTotal2;
    const cargosAdicionales = subTotal3 * (costosAdicionales.CAdicionales / 100);
    const precioUnitario = subTotal3 + cargosAdicionales;

    let letras = numeroALetras(precioUnitario.toString());
    console.log(letras);

    const formatoMXN = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    document.getElementById(`CostoDirectoPDF-${idConceptoProyecto}`).innerText = formatoMXN.format(costoDirecto);
    document.getElementById(`costoIndirectoPDF-${idConceptoProyecto}`).innerText = formatoMXN.format(costoIndirecto);
    document.getElementById(`subTotal1PDF-${idConceptoProyecto}`).innerText = formatoMXN.format(subTotal1);
    document.getElementById(`financiamientoPDF-${idConceptoProyecto}`).innerText = formatoMXN.format(financiamiento);
    document.getElementById(`subTotal2PDF-${idConceptoProyecto}`).innerText = formatoMXN.format(subTotal2);
    document.getElementById(`utilidadPDF-${idConceptoProyecto}`).innerText = formatoMXN.format(utilidad);
    document.getElementById(`subTotal3PDF-${idConceptoProyecto}`).innerText = formatoMXN.format(subTotal3);
    document.getElementById(`cargosAdicionalesPDF-${idConceptoProyecto}`).innerText = formatoMXN.format(cargosAdicionales);
    document.getElementById(`precioUnitarioPDF-${idConceptoProyecto}`).innerText = formatoMXN.format(precioUnitario);
    document.getElementById(`LecturaPrecioUnitarioPDF-${idConceptoProyecto}`).innerText = `(" ${letras}")`;



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


