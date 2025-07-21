//Accede al archivo .csv
document.addEventListener("DOMContentLoaded", () => {
    fetch("datosPersonas.csv")
        .then(response => response.text())
        .then(data => {
            const rows = data.split("\n"); // Separar por líneas
            const tableBody = document.getElementById("csvBody");

            let fila: HTMLTableRowElement | null = null;

            rows.forEach((row, index) => {
                if (index === 0) return; // Omitir la cabecera
                
                const columns = row.split(","); // Separar columnas por ","
                const [nombreCompleto, edad, sexo, ocupacion, estudios] = columns; // Obtener las 5 columnas

                if (nombreCompleto) {
                    // Si es el primer elemento o la fila está vacía, crear una nueva fila
                    if (!fila || fila.children.length === 2) {
                        fila = document.createElement("tr") as HTMLTableRowElement; // Aseguramos que sea un HTMLTableRowElement
                        tableBody?.appendChild(fila);
                    }

                    const td = document.createElement("td");
                    td.textContent = nombreCompleto;
                    td.addEventListener("click", () => mostrarDetalles(nombreCompleto, edad, sexo, ocupacion, estudios));
                    fila.appendChild(td);
                }
            });

            // Si la última fila tiene solo una celda, agregar una vacía para completar la columna
            if (fila && (fila as HTMLTableRowElement).children.length === 1) {
                const td = document.createElement("td");
                td.textContent = "";
                (fila as HTMLTableRowElement).appendChild(td);
            }

            // Agregar listener para el botón "Cerrar" con clase btn-close
            const btnClose = document.querySelector(".btn-close");
            btnClose?.addEventListener("click", () => cerrarDetalles());
        })
        .catch(error => console.error("Error al cargar el archivo CSV:", error));

    //Búsqueda por nombre en la tabla
    document.getElementById("searchInput")?.addEventListener("input", function () {
        const searchTerm = (this as HTMLInputElement).value.toLowerCase(); // Obtiene el texto y lo pasa a minúsculas
        const rows = document.querySelectorAll("#csvBody tr"); // Obtiene todas las filas dentro del tbody

       rows.forEach((row: Element) => {
            const cells = row.querySelectorAll("td");
            let filaCoincide = false;
    
            cells.forEach((cell) => {
                const cellText = (cell.textContent || "").toLowerCase();
                if (quitarAcentos(cellText.toLowerCase()).indexOf(quitarAcentos(searchTerm.toLowerCase())) !== -1) {
                    cell.style.display = "";  // Mostrar celda
                    filaCoincide = true;      // Al menos una celda coincide
                } else {
                    cell.style.display = "none"; // Ocultar celda
                }
            });
            // Mostrar fila solo si alguna celda coincide
            (row as HTMLTableRowElement).style.display = filaCoincide ? "" : "none";
        });
    });
});

// Función para mostrar detalles
function mostrarDetalles(nombre: string, edad: string, sexo: string, ocupacion: string, estudios: string) {
    document.getElementById("detalleNombre")!.textContent = nombre;
    document.getElementById("detalleEdad")!.textContent = edad;
    document.getElementById("detalleSexo")!.textContent = sexo;
    document.getElementById("detalleOcupacion")!.textContent = ocupacion;
    document.getElementById("detalleEstudios")!.textContent = estudios;
    document.getElementById("detalles")!.classList.remove("hidden"); // Mostrar detalles
}

// Función para cerrar los detalles
function cerrarDetalles() {
    document.getElementById("detalles")!.classList.add("hidden"); // Ocultar el div de detalles
}

//Función para usar texto con acentos
function quitarAcentos(texto: string): string {
    const acentos: { [key: string]: string } = {
        á: "a", é: "e", í: "i", ó: "o", ú: "u",
        Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U",
        ñ: "n", Ñ: "N"
    };

    return texto
        .split("")
        .map(letra => acentos[letra] || letra)
        .join("");
}