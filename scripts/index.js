$(document).ready(function () {
    alert("Bienvenido");

    // Evento para agregar maestro
    $("#agregar").submit(function (event) {
        event.preventDefault();

        // Simulando agregar maestro al array local
        const nombre = $("#nombre").val();
        const apellidoPaterno = $("#apellido_paterno").val();
        const apellidoMaterno = $("#apellido_materno").val();
        const correo = $("#correo").val();
        const telefono = $("#telefono").val();
        const fechaIngreso = $("#fecha_ingreso").val();

        // Validar campos simples
        if (!nombre || !apellidoPaterno || !correo || !telefono || !fechaIngreso) {
            alert("Todos los campos obligatorios deben ser completados.");
            return;
        }

        // Agregar maestro a la lista
        miApp.data.push({
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            correo,
            telefono,
            fechaIngreso,
        });

        alert("Maestro agregado correctamente");
        $("#agregar")[0].reset(); // Limpiar el formulario
    });

    var MiApp = function () {
        this.data = [];
    };

    var miApp = new MiApp();

    // Evento para consultar maestros
    $("#consultar").submit(function (event) {
        event.preventDefault();

        // Limpiar contenedor previo
        $("#resultado").empty();

        if (miApp.data.length === 0) {
            $("#resultado").append("<p>No hay maestros registrados.</p>");
            return;
        }

        // Mostrar lista de maestros
        miApp.data.forEach(function (maestro, index) {
            $("#resultado").append(`
                <div class="maestro">
                    <h3>Maestro ${index + 1}</h3>
                    <p><strong>Nombre:</strong> ${maestro.nombre}</p>
                    <p><strong>Apellido Paterno:</strong> ${maestro.apellidoPaterno}</p>
                    <p><strong>Apellido Materno:</strong> ${maestro.apellidoMaterno || 'N/A'}</p>
                    <p><strong>Correo:</strong> ${maestro.correo}</p>
                    <p><strong>Teléfono:</strong> ${maestro.telefono}</p>
                    <p><strong>Fecha de Ingreso:</strong> ${maestro.fechaIngreso}</p>
                    <hr>
                </div>
            `);
        });
    });
});
