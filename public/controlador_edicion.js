angular.module("calidadAire")
    .controller("controlador_edicion", ["$scope", "$http", "$window", "$routeParams", "$location", function ($scope, $http, $window, $routeParams, $location) {
        var id = $routeParams.id;
        var fecha = $routeParams.fecha;
        var base_url = " /api/v1/sensores";
        var url_recurso = base_url + "/" + id + "/" + fecha;
        function listarRecurso() {
            $http.get(url_recurso).then(function onSuccess(res) {
                if (res.status == 200 && res.data.length > 0) {
                    console.log("Registro recibido: " + JSON.stringify(res.data, null, 2));
                    $scope.Reg = res.data[0];
                }
            },
                function onReject(res) {
                    if (res.status == 422) {
                        console.log("Error recuperando registro, formato incorrecto de fecha. Fecha recibida: " + fecha + ", código de estado: " + res.status);
                        $window.alert("Error al recuperar el registro: formato incorrecto de fecha. Debería ser yyyy-mm-ddThh:mm:ssZ");
                        $location.path("/list");
                    }
                    else if (res.status == 404) {
                        console.log("Error recuperando registro, recurso no existente. Código de estado: " + res.status);
                        $window.alert("Error al recuperar el registro: el registro con id " + id + " y fecha " + fecha + " no existe en la base de datos");
                        $location.path("/list");
                    }
                });
        }

        $scope.actualizarRegistro = function actualizarRegistro() {
            $http.put(url_recurso, $scope.Reg).then(function onSuccess(res) {
                if (res.status == 200) {
                    console.log("Registro actualizado con datos: " + JSON.stringify($scope.Reg, null, 2));
                    $window.alert("Registro actualizado correctamente");
                    $location.path("/list");
                }
            },
                function onReject(res) {
                    if (res.status == 422) {
                        console.log("Registro no actualizado correctamente. Puede ser debido a un error de formato de fecha en la URL o en el cuerpo, o debido a que al cuerpo le falte un campo. Código de estado: " + res.status);
                        $window.alert("No se pudo actualizar el registro. Compruebe el formato de la fecha de la URL y del cuerpo del mensaje, así como que el cuerpo contenga todos los campos necesarios.");
                    }
                    else if (res.status == 400) {
                        console.log("Registro no actualizado correctamente. Petición sin cuerpo. Código de estado: " + res.status);
                        $window.alert("No se pudo actualizar el registro. La petición no contiene un cuerpo.");
                    }
                    else if(res.status == 404){
                        console.log("Registro no actualizado correctamente: no existe el registro a actualizar. Código de estado: " + res.status);
                        $window.alert("No se puede actualizar un registro que no existe. Compruebe el id y la fecha del registro.");
                    }

                });
        }
        listarRecurso();

    }]);