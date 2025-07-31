let todosLosConceptos;


function ComprobarExisteConceptoCopiar() {
    let existe = false;
    let idBuscar = document.getElementById('AddIdConceptoCopy');
    if (idBuscar.value == "") {
        idBuscar.classList.add("inputVacio");
        idBuscar.placeholder = "Requerido el ID";
        focus(idBuscar);
        return;
    }
    todosLosConceptos.forEach(concepto => {
        if (conceptoTipoSeleccionado) {
            if (idBuscar.value == concepto.idconcepto) {
                existe = true;
                $('#confirmCopiarModal').modal('show');
                return;
            }
        } else {
            if (idBuscar.value == concepto.idconbasi) {
                existe = true;
                $('#confirmCopiarModal').modal('show');
                return;
            }
        }
    })
    if (!existe) {
        mensajePantalla("No existe el concepto", false)
    }
}


function RemplazarDatosNuevo() {
    let idBuscar = document.getElementById('AddIdConceptoCopy').value;
    if (conceptoTipoSeleccionado) {
        MostrartablaMaterialesTarjetaCopiar(idBuscar);
        MostrartablaManoObraTarjetaCopiar(idBuscar);
        MostrartablaMaquinariaTarjetaCopiar(idBuscar);
        MostrartablaBasicosTarjetaCopiar(idBuscar);
    } else {
        MostrartablaMaterialesTarjetaCopiar(idBuscar);
        MostrartablaManoObraTarjetaCopiar(idBuscar);
        MostrartablaMaquinariaTarjetaCopiar(idBuscar);
    }
    $('#staticBackdrop').modal('hide');
}



function limpiarModalCopiar() {
    let idBuscar = document.getElementById('AddIdConceptoCopy');
    idBuscar.value = "";
    idBuscar.classList.remove("inputVacio");
    idBuscar.placeholder = "";
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
    console.log(json);
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
                console.log(datosBd)
                if (datosBd) {
                    datosBd.forEach((datos) => {
                        manoObraCopiar.push({
                            idmanoobra: datos.idmanoobra,
                            salario: datos.salario,
                            fechasalario: datos.fechasalario,
                            unidad: datos.unidad,
                            categoria: datos.categoria,
                            cantidad: datos.cantmanoobra,
                            rendimiento: datos.rendimiento,
                            estatus: datos.estatus,
                        });
                    })
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
                    console.log(json);
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
                    let resp = JSON.parse(responseText);
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
}
