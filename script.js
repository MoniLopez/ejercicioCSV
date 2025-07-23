var _a, _b;
//Accede al archivo .csv
document.addEventListener("DOMContentLoaded", function () {
    var _a, _b;
    // Eliminar el foco antes de que el modal se oculte (para evitar advertencias de accesibilidad)
    (_a = document.getElementById('modalDetalles')) === null || _a === void 0 ? void 0 : _a.addEventListener('hide.bs.modal', function () {
        var _a;
        // Si algún elemento dentro del modal tiene el foco, lo quitamos
        var focused = document.activeElement;
        if (focused && ((_a = document.getElementById('modalDetalles')) === null || _a === void 0 ? void 0 : _a.contains(focused))) {
            focused.blur(); // Eliminar el foco
        }
    });
    fetch("datosPersonas.csv")
        .then(function (response) { return response.text(); })
        .then(function (data) {
        var rows = data.split("\n"); // Separar por líneas
        var tableBody = document.getElementById("csvBody");
        var fila = null;
        rows.forEach(function (row, index) {
            if (index === 0)
                return; // Omitir la cabecera
            var columns = row.split(","); // Separar columnas por ","
            var nombreCompleto = columns[0], edad = columns[1], sexo = columns[2], ocupacion = columns[3], estudios = columns[4]; // Obtener las 5 columnas
            if (nombreCompleto) {
                // Si es el primer elemento o la fila está vacía, crear una nueva fila
                if (!fila || fila.children.length === 2) {
                    fila = document.createElement("tr"); // Aseguramos que sea un HTMLTableRowElement
                    tableBody === null || tableBody === void 0 ? void 0 : tableBody.appendChild(fila);
                }
                var td = document.createElement("td");
                td.textContent = nombreCompleto;
                td.addEventListener("click", function () { return mostrarDetalles(nombreCompleto, edad, sexo, ocupacion, estudios); });
                fila.appendChild(td);
            }
        });
        // Si la última fila tiene solo una celda, agregar una vacía para completar la columna
        if (fila && fila.children.length === 1) {
            var td = document.createElement("td");
            td.textContent = "";
            fila.appendChild(td);
        }
    })
        .catch(function (error) { return console.error("Error al cargar el archivo CSV:", error); });
    //Búsqueda por nombre en la tabla
    (_b = document.getElementById("searchInput")) === null || _b === void 0 ? void 0 : _b.addEventListener("input", function () {
        var searchTerm = this.value.toLowerCase(); // Obtiene el texto y lo pasa a minúsculas
        var rows = document.querySelectorAll("#csvBody tr"); // Obtiene todas las filas dentro del tbody
        rows.forEach(function (row) {
            var cells = row.querySelectorAll("td");
            var filaCoincide = false;
            cells.forEach(function (cell) {
                var cellText = (cell.textContent || "").toLowerCase();
                if (quitarAcentos(cellText.toLowerCase()).indexOf(quitarAcentos(searchTerm.toLowerCase())) !== -1) {
                    cell.style.display = ""; // Mostrar celda
                    filaCoincide = true; // Al menos una celda coincide
                }
                else {
                    cell.style.display = "none"; // Ocultar celda
                }
            });
            // Mostrar fila solo si alguna celda coincide
            row.style.display = filaCoincide ? "" : "none";
        });
    });
});
// Guarda el botón o celda que abre el modal
var elementoQueAbrioModal = null;
// Función para mostrar detalles en el modal
function mostrarDetalles(nombre, edad, sexo, ocupacion, estudios) {
    var modalElement = document.getElementById('modalDetalles');
    if (modalElement) {
        elementoQueAbrioModal = document.activeElement; // Guardamos el elemento activo que abrió el modal
        var modal = new bootstrap.Modal(modalElement);
        modal.show();
        document.getElementById("detalleNombre").textContent = nombre;
        document.getElementById("detalleEdad").textContent = edad;
        document.getElementById("detalleSexo").textContent = sexo;
        document.getElementById("detalleOcupacion").textContent = ocupacion;
        document.getElementById("detalleEstudios").textContent = estudios;
    }
}
//Antes de ocultar el modal: quitar foco de cualquier hijo
(_a = document.getElementById('modalDetalles')) === null || _a === void 0 ? void 0 : _a.addEventListener('hide.bs.modal', function () {
    var _a;
    var focused = document.activeElement;
    if (focused && ((_a = document.getElementById('modalDetalles')) === null || _a === void 0 ? void 0 : _a.contains(focused))) {
        focused.blur();
    }
});
//Después de cerrar: devolver foco al origen
(_b = document.getElementById('modalDetalles')) === null || _b === void 0 ? void 0 : _b.addEventListener('hidden.bs.modal', function () {
    if (elementoQueAbrioModal) {
        elementoQueAbrioModal.focus();
    }
});
//Función para usar texto con acentos
function quitarAcentos(texto) {
    var acentos = {
        á: "a", é: "e", í: "i", ó: "o", ú: "u",
        Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U",
        ñ: "n", Ñ: "N"
    };
    return texto
        .split("")
        .map(function (letra) { return acentos[letra] || letra; })
        .join("");
}
