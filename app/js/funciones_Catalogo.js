function AgregarDatosTablaConceptoCatalogo() {
    console.log(datosCatalogo)

    let tbody = document.getElementById("tabla-conceptosCatalogo").getElementsByTagName("tbody")[0];

    let fila = document.createElement("tr");
    fila.innerHTML = `
        <td>${datosCatalogo.id}</td> 
        <td>${datosCatalogo.nombre}</td>
        <td>${datosCatalogo.tipo}</td>
        <td>${datosCatalogo.plazo}</td>
        <td>${datosCatalogo.unidad}</td>`;

    tbody.appendChild(fila);

}