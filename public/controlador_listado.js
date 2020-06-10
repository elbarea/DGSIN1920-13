angular.module("calidadAire")
    .controller("controlador_listado", ["$scope", "$http", "$window", function ($scope, $http, $window) {
        var base_url = "/api/v1/sensores";
        function listarRegistros() {
            $http.get(base_url).then(function onSuccess(res) {
                if (res.status == 200 && res.data.length > 0) {
                    console.log("Registros recibidos: " + JSON.stringify(res.data, null, 2));
                    $scope.registros = res.data;
                }
            },
                function onReject(res) {
                    console.log("Error recibiendo los datos: " + res.status);
                    $window.alert("Ha ocurrido un error al recibir los datos. Vuelva a intentarlo de nuevo");
                });
        }
        $scope.eliminarTodo = function eliminarTodo() {
            $http.delete(base_url).then(function onSuccess(res) {
                if (res.status == 204) {
                    console.log("Registros eliminados");
                    $window.alert("Todos los registros eliminados exitosamente");
                    $scope.registros = [];
                }
                else {
                }
            },
                function onReject(res) {
                    if (res.status == 404) {
                        console.log("Error eliminando los registros: no hay registros que eliminar " + res.status);
                        $window.alert("No se puede eliminar ningún registro ya que no hay ninguno en la base de datos");
                    }
                    else {
                        console.log("Error eliminando los registros: " + res.status);
                        $window.alert("No se pudo eliminar los registros");
                    }
                });
        }
        $scope.eliminarRegistro = function eliminarRegistro(id, fecha) {
            $http.delete(base_url + "/" + id + "/" + fecha).then(function onSuccess(res) {
                if (res.status == 204) {
                    console.log("Registro correspondiente al sensor " + id + " con fecha " + fecha + " eliminado");
                    $window.alert("Registro con id " + id + " y fecha " + fecha + " eliminado exitosamente");
                    listarRegistros();
                }

            },
                function onReject(res) {
                    if (res.status == 404) {
                        console.log("Error eliminando registro con id " + id + " y fecha " + fecha + ": no hay registro que eliminar; " + res.status);
                        $window.alert("Ha ocurrido un problema eliminando los registros: no hay ningún registro con id " + id + " y fecha " + fecha);
                    }
                    else if (res.status == 422) {
                        console.log("Error eliminando registro con id " + id + " y fecha " + fecha + ": formato de fecha incorrecto; " + res.status);
                        $window.alert("Ha ocurrido un problema eliminando los registros: formato de fecha incorrecto " + fecha);
                    }
                });
        }

        $scope.crearRegistro = function crearRecurso() {
            $http.post(base_url, $scope.nReg).then(function onSuccess(res) {
                if (res.status == 201) {
                    console.log("Recurso añadido:" + JSON.stringify($scope.nReg, null, 2));
                    $window.alert("Registro añadido satisfactoriamente");
                    listarRegistros();
                }
            },
                function onReject(res) {

                    if (res.status == 409) {

                        console.log("No se puede añadir un recurso que ya existe: " + res.status);
                        $window.alert("No se pudo añadir el registro debido a que ya existe uno con el mismo id y fecha");

                    }
                    else if (res.status == 400) {

                        console.log("Error añadiendo recurso: petición sin cuerpo. Código de estado: " + res.status);
                        $window.alert("No se pudo añadir el registro debido a que no hay campos que añadir");

                    }
                    else if (res.status == 422) {
                        console.log("Error añadiendo recurso: cuerpo mal formado o formato de fecha incorrecto. Código de estado: " + res.status);
                        $window.alert("No se pudo añadir el registro debido a que faltan uno o más campos de información o a que la fecha tiene formato incorrecto. El formato debe ser yyyy-mm-ddThh:mm:ssZ");
                    }
                    else {

                        console.log("Error añadiendo recurso: " + res.status);
                        $window.alert("No se pudo añadir el recurso");

                    }
                });



        }
        console.log("Controlador para listar todos los recursos listo.");
        listarRegistros();
    }]);
