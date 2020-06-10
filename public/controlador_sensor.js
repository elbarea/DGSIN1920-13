angular.module("calidadAire")
    .controller("controlador_sensor", ["$scope", "$http", "$window", "$routeParams","$location", function ($scope, $http, $window, $routeParams,$location) {
        var id = $routeParams.id;
        var base_url = "/api/v1/sensores";
        url_sensor = base_url + "/" + id;
        function listarSensor() {
            $http.get(url_sensor).then(function onSuccess(res) {
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
        $scope.eliminarSensor = function eliminarSensor() {
            $http.delete(url_sensor).then(function onSuccess(res) {
                if (res.status == 204) {
                    console.log("Registros eliminados");
                    $window.alert("Registros asociados al sensor con id " + id + " eliminados satisfactoriamente");
                    $location.path("/list");
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
        
        console.log("Controlador para listar todos los recursos asociados a un sensor listo.");
        listarSensor();
    }]);
