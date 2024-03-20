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


    var fechaHoy = new Date();
    var dia = fechaHoy.getDate();
    var mes = fechaHoy.getMonth()
    var anio = fechaHoy.getFullYear();
    var fechaFormateada = anio + "-" + mes + "-" + dia;
    datos.precioFecha = fechaFormateada;

    let unidad = document.querySelector('#AddunidadInput');
    if (unidad.value == "") {
        alert('Ingrese un unidad')
        unidad.focus();
        return;
    }
    datos.unidad = unidad.value;

    let json = JSON.stringify(datos);
    console.log(json);
    agregarImagen();
    let url = "../ws/Materiales/wsAddMaterial.php";
    $.post(url, json, (responseText, status) => {
        try {

            if (status == "success") {
                console.log(responseText);
                let resp = JSON.parse(responseText);
                console.log(resp)
                if (resp.estado == "OK") {
                    alert("Material Agregado con Exito :)");
                    opcion('material');
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            alert("Error: " + error)
        }
    });
}

function AddlimpiarModal() {
    let id = document.querySelector('#AddidInput').value = "";
    let norma = document.querySelector('#AddnormaInput').value = "";
    let descripcion = document.querySelector('#AdddescripcionInput').value = "";
    let precio = document.querySelector('#AddprecioInput').value = "";
    let precioFecha = document.querySelector('#AddfechaPrecioInput').value = "";
    let unidad = document.querySelector('#AddunidadInput').value = "";
    let imagen = document.querySelector('#AddimagenInput').value = "";
}

function agregarImagen() {
    let id = document.querySelector('#AddidInput').value;
    var inputFile = document.getElementById('AddimagenInput');
    var file = inputFile.files[0];

    // Verificar si se seleccionó un archivo
    if (file) {
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
    } else {
        alert('Por favor, selecciona una imagen.');
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

