$(document).ready(function () {
    alert("Bienvenido");

    // Evento para agregar maestro
    $("#agregar").submit(function (event) {
        event.preventDefault();

        // Capturar datos del formulario
        const nombre = $("#nombre").val();
        const apellidoPaterno = $("#apellido_paterno").val();
        const apellidoMaterno = $("#apellido_materno").val();
        const correo = $("#correo").val();
        const telefono = $("#telefono").val();
        const fechaIngreso = $("#fecha_ingreso").val();

        // Validar campos obligatorios
        if (!nombre || !apellidoPaterno || !correo || !telefono || !fechaIngreso) {
            alert("Todos los campos obligatorios deben ser completados.");
            return;
        }

        // Enviar datos al backend usando AJAX
        $.ajax({
            url: "/maestros", // Ruta del backend
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                nombre: nombre,
                apellidoPaterno: apellidoPaterno,
                apellidoMaterno: apellidoMaterno,
                correo: correo,
                telefono: telefono,
                fechaIngreso: fechaIngreso,
            }),
            success: function (response) {
                alert("Maestro agregado correctamente");
                $("#agregar")[0].reset(); // Limpiar el formulario
            },
            error: function (xhr, status, error) {
                console.error("Error al agregar maestro:", error);
                alert("Error al agregar maestro. Por favor, inténtalo de nuevo.");
            },
        });
    });

    // Evento para consultar maestros
    $("#consult").submit(function (event) {
        event.preventDefault();

        $("#listaMaestro").empty(); // Limpiar resultados previos

        // Obtener maestros desde el backend
        $.ajax({
            url: "/maestros",
            method: "GET",
            dataType: "json",
            success: function (response) {
                console.log("Datos recibidos:", response);

                if (response.length === 0) {
                    $("#listaMaestro").append("<li>No hay maestros registrados.</li>");
                } else {
                    response.forEach((maestro) => {
                        $("#listaMaestro").append(
                            `<li>${maestro.nombre} ${maestro.apellido_paterno} ${maestro.correo} ${maestro.telefono}</li>`
                        );
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error al obtener maestros:", error);
                $("#listaMaestro").append("<li>Error al cargar maestros.</li>");
            },
        });
    });
});
