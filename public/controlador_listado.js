angular.module("calidadAire")
    .controller("controlador_listado", ["$scope", "$http", "$window", function ($scope, $http, $window) {
        var base_url = " /api/v1/sensores";
        function listarRegistros() {
            $http.get(base_url).then(function (res) {
                console.log("Registros recibidos: " + JSON.stringify(res.data, null, 2));
                $scope.registros = res.data;
            });
        }
        $scope.eliminarTodo = function eliminarTodo() {
            $http.delete(base_url).then((res) => {
                if (res.status == 204) {
                    console.log("Registros eliminados");
                    $window.alert("Todos los registros eliminados exitosamente");
                    listarRegistros();
                }
                else {
                    console.log("Error eliminando los registros: " + res.status);
                    $window.alert("Ha ocurrido un problema eliminando los registros: " + res.status);
                }
            });
        }
        $scope.eliminarRegistro = function eliminarRegistro(id, fecha) {
            $http.delete(base_url + "/" + id + "/" + fecha).then((res) => {
                if (res.status == 204) {
                    console.log("Registro correspondiente al sensor " + id + " con fecha " + fecha + " eliminado");
                    $window.alert("Registro con id " + id + " y fecha " + fecha + " eliminado exitosamente");
                    listarRegistros();
                }
                else {
                    console.log("Error eliminando registro con id " + id + " y fecha " + fecha + " : " + res.status);
                    $window.alert("Ha ocurrido un problema eliminando los registros: " + res.status);
                }
            });
        }
        console.log("Controlador para listar todos los recursos listo.");
        listarRegistros();
    }]);