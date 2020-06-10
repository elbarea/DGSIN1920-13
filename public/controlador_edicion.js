angular.module("calidadAire")
    .controller("controlador_edicion", ["$scope", "$http", "$window","$routeParams","$location",function ($scope, $http, $window,$routeParams,$location) {
        var id = $routeParams.id;
        var fecha = $routeParams.fecha;
        var base_url = " /api/v1/sensores";
        var url_recurso = base_url + "/" + id + "/" + fecha;
        function listarRecurso() {
            $http.get(url_recurso).then(function (res) {
                console.log("Registro recibido: " + JSON.stringify(res.data, null, 2));
                $scope.Reg = res.data[0];
            });
        }

        $scope.actualizarRegistro = function actualizarRegistro(){
            $http.put(url_recurso,$scope.Reg).then(function onSuccess(res){
                if(res.status == 200){
                    console.log("Registro actualizado con datos: " + JSON.stringify($scope.Reg,null,2));
                    $window.alert("Registro actualizado correctamente");
                    $location.path("/list");
                }
            },
            function onReject(res){
                console.log("Registro no actualizado correctamente");
            });
        }
        listarRecurso();

    }]);