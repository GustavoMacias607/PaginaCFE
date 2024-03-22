function AddMaterialValidar() {
    const datos = {};
    let id = document.querySelector('#AddidInput');
    if (id.value == "") {
        alert('Ingrese un id')
        id.focus();
        return;
    }
    datos.id = id.value;
    let norma = document.querySelector('#AddnormaInput');
    if (norma.value == 0) {
        alert('Ingrese un norma')
        norma.focus();
        return;
    }
    datos.norma = norma.value;
    let descripcion = document.querySelector('#AdddescripcionInput');
    if (descripcion.value == "") {
        alert('Ingrese un descripcion')
        descripcion.focus();
        return;
    }
    datos.descripcion = descripcion.value;
    let precio = document.querySelector('#AddprecioInput');
    if (precio.value == "") {
        alert('Ingrese un precio')
        precio.focus();
        return;
    }
    datos.precio = precio.value;
    let fecha = document.querySelector('#AddfechaPrecioInput');
    if (fecha.value == "") {
        alert('Ingrese un fecha')
        fecha.focus();
        return;
    }

    datos.precioFecha = FormateoFecha(fecha.value);

    let unidad = document.querySelector('#AddunidadInput');
    if (unidad.value == "") {
        alert('Ingrese un unidad')
        unidad.focus();
        return;
    }
    datos.unidad = unidad.value;

    let json = JSON.stringify(datos);
    console.log(json);
    var inputFile = document.getElementById('AddimagenInput');
    if (inputFile.value) {
        agregarImagen();
    }

    let url = "../ws/Materiales/wsAddMaterial.php";
    $.post(url, json, (responseText, status) => {
        try {

            if (status == "success") {
                console.log(responseText);
                let resp = JSON.parse(responseText);
                console.log(resp)
                if (resp.estado == "OK") {
                    alert("Material Agregado con Exito :)");
                    AddCerrarModal();
                    opcion('materiales');
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}
function FormateoFecha(fecha) {

    // Dividir la cadena de fecha en día, mes y año
    let partesFecha = fecha.split("/");
    let dia = partesFecha[0];
    let mes = partesFecha[1];
    let año = partesFecha[2];

    // Crear un nuevo objeto Date
    let fechaFormateada = new Date(`${año}/${mes}/${dia}`);

    // Extraer el año, mes y día de la fecha formateada
    let añoFormateado = fechaFormateada.getFullYear();
    let mesFormateado = (fechaFormateada.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
    let diaFormateado = fechaFormateada.getDate().toString().padStart(2, '0');

    // Crear la fecha formateada en el formato deseado
    return fechaFinal = `${añoFormateado}-${mesFormateado}-${diaFormateado}`;
}

function AddlimpiarModal() {
    let id = document.querySelector('#AddidInput').value = "";
    let norma = document.querySelector('#AddnormaInput').value = "";
    let descripcion = document.querySelector('#AdddescripcionInput').value = "";
    let precio = document.querySelector('#AddprecioInput').value = "";
    let unidad = document.querySelector('#AddunidadInput').value = "";
    let imagen = document.querySelector('#AddimagenInput').value = "";
    let img = document.querySelector('#AddimagenPreview');
    img.src = "";
    img.alt = "";

    // Obtener la fecha actual
    let fechaActual = new Date();

    // Obtener el año, mes y día de la fecha actual
    let año = fechaActual.getFullYear();
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
    let dia = fechaActual.getDate().toString().padStart(2, '0');

    // Formatear la fecha como "YYYY-MM-DD"
    let fechaFormateada = `${año}-${mes}-${dia}`;

    // Establecer el valor del campo de entrada con la fecha formateada
    document.querySelector('#AddfechaPrecioInput').value = fechaFormateada;
}

function agregarImagen() {
    let id = document.querySelector('#AddidInput').value;
    var inputFile = document.getElementById('AddimagenInput');
    var file = inputFile.files[0];


    // Verificar el tamaño del archivo (en bytes)
    var maxSizeBytes = 200 * 1024;
    if (file.size <= maxSizeBytes) {
        // Verificar si el archivo es una imagen con formato PNG o JPG
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            var formData = new FormData();
            formData.append('imagen', file);
            formData.append('id', id);

            // Enviar la imagen al servidor
            $.ajax({
                url: './js/guardar_imagen.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log('Imagen guardada con éxito:', response);
                },
                error: function (error) {
                    console.error('Error al guardar la imagen:', error);
                }
            });
        } else {
            alert('El archivo seleccionado no es una imagen en formato PNG o JPG.');
        }
    } else {
        alert('El tamaño del archivo excede el límite de 200 KB.');
    }

}

function validaExisteMaterial() {
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

function AddmostrarImagen(input) {
    const imagenPreview = document.getElementById('AddimagenPreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagenPreview.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function UpdmostrarImagen(input) {
    const imagenPreview = document.getElementById('UpdimagenPreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagenPreview.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}
function llenarModalModificar(id, norma, descripcion, precio, fechaPrecio, unidad, imagen) { //Llenado de datos en el modal


    let idM = document.querySelector('#UpdidInput');
    let normaM = document.querySelector('#UpdnormaInput');
    let descripcionM = document.querySelector('#UpddescripcionInput');
    let precioM = document.querySelector('#UpdprecioInput');
    let unidadM = document.querySelector('#UpdunidadInput');
    let imagenM = document.querySelector('#UpdimagenInput');
    idM.value = id;
    normaM.value = norma;
    descripcionM.value = descripcion;
    precioM.value = precio;

    unidadM.value = unidad;
    //imagenM. = momento;

    //llenar el select de responsables
    for (var i = 0; i < unidadM.options.length; i++) {
        if (unidadM.options[i].value === unidad) {
            unidadM.options[i].selected = true;
            break;
        }
    }


    //Fecha
    if (fechaPrecio) {
        document.querySelector('#UpdfechaPrecioInput').value = FormateoFecha(fechaPrecio);
    } else {
        // Obtener la fecha actual
        let fechaActual = new Date();

        // Obtener el año, mes y día de la fecha actual
        let año = fechaActual.getFullYear();
        let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JavaScript van de 0 a 11
        let dia = fechaActual.getDate().toString().padStart(2, '0');

        // Formatear la fecha como "YYYY-MM-DD"
        let fechaFormateada = `${año}-${mes}-${dia}`;

        // Establecer el valor del campo de entrada con la fecha formateada
        document.querySelector('#UpdfechaPrecioInput').value = fechaFormateada;
    }



    // //llenar select de estado
    // for (var i = 0; i < estadoMod.options.length; i++) {
    //     if (estadoMod.options[i].value === estado) {
    //         estadoMod.options[i].selected = true;
    //         break;
    //     }
    // }
}

function AddCerrarModal() {

    $('#AgregarModal').modal('hide');
}

function UpdateCerrarModal() {

    $('#EditarModal').modal('hide');
}