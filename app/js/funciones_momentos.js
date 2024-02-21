function validaFrmMomento() {
    const datos = {};
    let momento = document.querySelector('#momento');
    if (momento.value == "") {
        alert('Ingrese un Momento')
        momento.focus();
        return;
    }
    datos.momento = momento.value;
    let responsable = document.querySelector('#responsable');
    if (responsable.value == 0) {
        alert('Ingrese un Responsable')
        responsable.focus();
        return;
    }
    datos.responsable = responsable.value;
    let orden = document.querySelector('#orden');
    if (orden.value == "") {
        alert('Ingrese un Orden')
        orden.focus();
        return;
    }
    datos.orden = orden.value;
    let vali = document.querySelector('#vali');
    if (vali.value == "A") {
        let json = JSON.stringify(datos);
        let url = "../ws/momento/wsAddMomento.php";
        $.post(url, json, (responseText, status) => {
            try {

                if (status == "success") {
                    console.log(responseText);
                    let resp = JSON.parse(responseText);
                    console.log(resp)
                    if (resp.estado == "OK") {
                        alert("Momento Agregado con Exito :)");
                        opcion('momentos');
                    }
                } else {
                    throw e = status;
                }
            } catch (error) {
                alert("Error: " + error)
            }
        });
    } else {
        alert("Advertencia: El Momento ya esta en uso");
    }
}
function validaOrden() {
    let obj = document.querySelector("#orden");
    if (obj.value !== "") {
        let datos = {};
        datos.orden = obj.value;
        let json = JSON.stringify(datos);
        let url = "../ws/momento/wsCheckOrden.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == 'success') {
                    let resp = JSON.parse(responseText);
                    if (resp.existe == 1) {
                        //Aqui desabilitamos el boton
                        throw e = "Advertencia: El Orden ya esta en uso";
                    }
                } else {
                    throw e = "Error: No se alcanzo el recurso";
                }
            } catch (error) {
                alert(error);
            }
        })
    }
}

function validaMomento() {
    let obj = document.querySelector("#momento");
    if (obj.value !== "") {
        let datos = {};
        datos.momento = obj.value;
        let json = JSON.stringify(datos);
        let vali = document.querySelector('#vali');
        let url = "../ws/momento/wsCheckMomento.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == 'success') {
                    let resp = JSON.parse(responseText);
                    if (resp.existe == 1) {
                        //Aqui desabilitamos el boton

                        vali.value = "I";
                        throw e = "Advertencia: El Momento ya esta en uso";
                    } else {
                        vali.value = "A";
                    }
                } else {
                    throw e = "Error: No se alcanzo el recurso";
                }
            } catch (error) {
                alert(error);
            }
        })
    }
}

function validaFrmMomentoModal() {

    const datos = {};

    let id = document.querySelector('#IdModal');

    datos.id = id.value;

    let momento = document.querySelector('#momentoModal');
    if (momento.value == "") {
        alert('Ingrese un Momento')
        momento.focus();
        return;
    }
    datos.momento = momento.value;
    let responsable = document.querySelector('#responsableModal');
    if (responsable.value == 0) {
        alert('Ingrese un Responsable')
        responsable.focus();
        return;
    }
    datos.responsable = responsable.value;
    let orden = document.querySelector('#ordenModal');
    if (orden.value == "") {
        alert('Ingrese un Orden')
        orden.focus();
        return;
    }
    datos.orden = orden.value;
    let estado = document.querySelector('#estadoModal');
    if (estado.value == 0) {
        alert('Ingrese un estado')
        estado.focus();
        return;
    }
    datos.estado = estado.value;
    let vali = document.querySelector('#vali');

    if (vali.value == "A") {
        let OrModal = document.querySelector('#OrModal');
        datos.ordenFin = OrModal.value;
        if (orden.value != OrModal.value) {
            if (orden.value < OrModal.value) {
                let json = JSON.stringify(datos);
                let url = "../ws/momento/wsCambiarOrden.php";
                $.post(url, json, (responseText, status) => {
                    try {

                        if (status == "success") {
                            console.log(responseText);
                            let resp = JSON.parse(responseText);
                            console.log(resp)
                            if (resp.estado == "OK") {
                                alert("Orden modificado con Exito :)");
                            }
                        } else {
                            throw e = status;
                        }
                    } catch (error) {
                        alert("Error: " + error)
                    }
                });
            } else {
                let json = JSON.stringify(datos);
                let url = "../ws/momento/wsCambiarOrdenMas.php";
                $.post(url, json, (responseText, status) => {
                    try {

                        if (status == "success") {
                            console.log(responseText);
                            let resp = JSON.parse(responseText);
                            console.log(resp)
                            if (resp.estado == "OK") {
                                alert("Orden modificado con Exito :)");
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


        let json = JSON.stringify(datos);
        let url = "../ws/momento/wsUpdateMomento.php";
        $.post(url, json, (responseText, status) => {
            try {

                if (status == "success") {
                    console.log(responseText);
                    let resp = JSON.parse(responseText);
                    console.log(resp)
                    if (resp.estado == "OK") {
                        alert("Momento Modificado con Exito :)");
                        CerrarModal()
                        opcion('momentos');
                    }
                } else {
                    throw e = status;
                }
            } catch (error) {
                alert("Error: " + error)
            }
        });

    } else {
        alert("Advertencia: El Momento ya esta en uso");
    }


}

function validaMomentoModal() {
    let MomeModal = document.querySelector('#MomModal');
    let obj = document.querySelector('#momentoModal');
    let vali = document.querySelector('#vali');
    if (MomeModal.value != obj.value) {
        if (obj.value !== "") {
            let datos = {};
            datos.momento = obj.value;
            let json = JSON.stringify(datos);

            let url = "../ws/momento/wsCheckMomento.php";
            $.post(url, json, (responseText, status) => {
                try {
                    if (status == 'success') {
                        let resp = JSON.parse(responseText);
                        if (resp.existe == 1) {
                            //Aqui desabilitamos el boton

                            vali.value = "I";
                            throw e = "Advertencia: El Momento ya esta en uso";
                        } else {
                            vali.value = "A";
                        }
                    } else {
                        throw e = "Error: No se alcanzo el recurso";
                    }
                } catch (error) {
                    alert(error);
                }
            })
        }
    } else {
        vali.value = "A";
    }
}


function EliminarMomento(id, momento) {
    let valor = confirm("¿Estas seguro que quieres eliminar el momento " + momento + " ?");

    if (valor) {
        const datos = {};
        datos.id = id;
        let json = JSON.stringify(datos);
        let url = "../ws/momento/wsEliminarMomento.php";
        $.post(url, json, (responseText, status) => {
            try {
                if (status == "success") {
                    console.log(responseText);
                    let resp = JSON.parse(responseText);
                    console.log(resp)
                    if (resp.estado == "OK") {
                        alert("Momento Eliminado con Exito :)");
                        opcion('momentos');
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

function llenarModalModificar(id, momento, estado, orden, responsable) { //Llenado de datos en el modal


    let idMod = document.querySelector('#IdModal');
    let MomeModal = document.querySelector('#MomModal');
    let momentoMod = document.querySelector('#momentoModal');
    let responsableMod = document.querySelector('#responsableModal');
    let OrModal = document.querySelector('#OrModal');
    let ordenMod = document.querySelector('#ordenModal');
    let estadoMod = document.querySelector('#estadoModal');
    momentoMod.value = momento;
    ordenMod.value = orden;
    OrModal.value = orden;
    idMod.value = id;
    MomeModal.value = momento;

    //llenar el select de responsables
    for (var i = 0; i < responsableMod.options.length; i++) {
        if (responsableMod.options[i].value === responsable) {
            responsableMod.options[i].selected = true;
            break;
        }
    }

    //llenar select de estado
    for (var i = 0; i < estadoMod.options.length; i++) {
        if (estadoMod.options[i].value === estado) {
            estadoMod.options[i].selected = true;
            break;
        }
    }
}


function CerrarModal() {

    $('#staticBackdrop').modal('hide');
}
