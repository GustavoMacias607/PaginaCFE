function opcion(op) {
    let url = "";
    let json = "asd123sda2wx";
    switch (op) {
        case "admonUser":
            url = "usuarios/addUserFrm.php";
            break;
        case "momentos":
            url = "Momentos/addmomentosFrm.php";
            break;
        default: alert("Opción incorrecta"); return;
    }

    $.post(url, json, (responseText, status) => {
        try {
            console.log(responseText);
            if (status == "success") {
                document.getElementById("mainContent").innerHTML = responseText;
                switch (op) {
                    case "admonUser":
                        $("#tbl_user").DataTable({
                            language: {
                                url: "../../DataTables-1.11.3/language.json"
                            }
                        });
                        break;
                    case "momentos":
                        $("#tbl_momentos").DataTable({
                            language: {
                                url: "../../DataTables-1.11.3/language.json"
                            }
                        });
                        break;
                }
            } else {
                throw e = status;
            }
        } catch (error) {
            console.log("Error: " + error);
        }
    });

}

function hola() {
    hola
}