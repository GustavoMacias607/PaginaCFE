function opcion(op) {

    let url = "";
    let json = "";
    switch (op) {
        case "materiales":
            url = "Materiales/addmaterialesFrm.php";
            break;
        case "usuarios":
            url = "Usuarios/addUsuariosFrm.php";
            break;
        case "conceptos":
            url = "Conceptos/addconceptosFrm.php";
            break;
        case "principal":
            url = "Principal/addPrincipalFrm.php";
            break;
        default: alert("Opción incorrecta"); return;
    }

    $.post(url, json, (responseText, status) => {
        try {
            console.log(responseText);

            if (status == "success") {
                document.getElementById("mainContent").innerHTML = responseText;
            } else {
                throw e = status;
            }
        } catch (error) {
            console.log("Error: " + error);
        }
    });

}

