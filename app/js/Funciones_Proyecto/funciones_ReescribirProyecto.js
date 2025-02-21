function AddReescribirProyecto() {
    let vacio = false;
    let PrimerValorVacio;
    const datos = {};
    let idProyecto = document.querySelector('#inputIdProyecto');
    datos.idProyecto = idProyecto.value;
    let idUsuario = document.querySelector('#idUsuario');
    datos.idUsuario = idUsuario.value;
    let nombre = document.querySelector('#inputNombreObra');
    if (nombre.value == "") {
        nombre.classList.add("inputVacio");
        nombre.placeholder = "Requerido el nombre de la obra";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombre;
        }
    }
    datos.nombre = nombre.value;
    datos.fecha = ObtenerFechaActual();


    let periodo = document.querySelector('#inputPeriodo');
    if (periodo.value == "") {
        periodo.classList.add("inputVacio");
        periodo.placeholder = "Requerido el periodo";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = periodo;
        }
    }
    datos.periodo = periodo.value;

    let fechaInicio = document.querySelector('#AddfechaInicioInput');
    if (fechaInicio.value == "") {
        fechaInicio.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = fechaInicio;
        }
    }
    datos.fechaInicio = FormateoFecha(fechaInicio.value);
    let fechaTermino = document.querySelector('#AddfechaTerminoInput');
    datos.fechaTermino = FormateoFecha(fechaTermino.value);

    let nombreZona = document.querySelector('#inputZona');
    // Verificar si la zona es válida
    const zonaValida = objZonas.some(z => z.zona.toLowerCase() == nombreZona.value.toLowerCase());
    if (nombreZona.value == "" || !zonaValida) {
        nombreZona.classList.add("inputVacio");
        nombreZona.placeholder = nombreZona.value == "" ? "Requerida la zona" : "Zona no válida";
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = nombreZona;
        }
    }
    datos.zona = nombreZona.value;
    let obra = document.querySelector('#AddTipoObra');
    if (obra.value == "") {
        obra.classList.add("inputVacio");
        vacio = true;
        if (!PrimerValorVacio) {
            PrimerValorVacio = obra;
        }
    }
    datos.obra = obra.value;
    if (vacio) {
        PrimerValorVacio.focus();
        return;
    }

    if (existe) {
        id.focus();
        return;
    }
    datos.idZona = obtenerIdZona();
    datos.total = 0;
    datosProyecto = datos;
    let json = JSON.stringify(datos);
    console.log(json)
    let url = "../ws/Proyecto/wsAddProyecto.php";
    $.post(url, json, (responseText, status) => {
        try {
            if (status == "success") {
                let resp = JSON.parse(responseText);
                console.log(resp);
                if (resp.estado == "OK") {
                    AgregarConceptosProyectoReescribido(idProyecto.value)
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}


function AgregarConceptosProyectoReescribido(idProyecto) {
    Object.values(editedRows).forEach(concepto => {
        concepto.idProyecto = idProyecto;
        let json = JSON.stringify(concepto);
        let url = "../ws/ConceptosProyecto/wsAddConcepto.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status === "success") {
                    let resp = JSON.parse(responseText);
                    if (resp.estado === "OK") {
                        //mensajePantalla(mgsCatalogoAgregado, true);
                        AddCerrarModal();
                        opcion("addPresupuestoFrm");
                    } else {
                        alert("Error en la respuesta del servidor: " + resp.mensaje);
                    }
                } else {
                    throw new Error("Error en la solicitud AJAX: " + status);
                }
            } catch (error) {
                alert("Error: " + error.message);
            }
        }).fail((jqXHR, textStatus, errorThrown) => {
            alert("Error en la solicitud AJAX: " + textStatus + " - " + errorThrown);
        });
    });
}
