angular.module("calidadAire")
    .controller("controlador_integrations", ["$scope", "$http", "$window", function ($scope, $http, $window) {
        var url_api1 = "proxy13/api/v1/environment-stats";
        var url_api2 = "proxy13/api/v1/infrastructure-stats";
/*
        $scope.pintarGrafica = function pintarGrafica() {
            chart($http, $window, base_url);
        }
        */
        function get(){
            $http.get(base_url).then(function onSuccess(res){
                console.log(res);
            });
        }
        console.log("Controlador para visualizar los datos de nuestra API de manera gráfica listo.");
        get();
        //$scope.pintarGrafica();
    }]);
