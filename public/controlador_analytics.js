function chart($http,$window,base_url) {
    var tiempo = {};
    var datos = {};
    var sensores = {};

    $http.get(base_url).then(function onSuccess(res) {
        if (res.status == 200 && res.data.length > 0) {
            console.log("Registros recibidos: " + JSON.stringify(res.data, null, 2));
            var datos_raw = res.data;

            for (reg in datos_raw){
                sensores.push({"id":reg.sensorid});
                tiempo.push({"fecha":reg.fecha});
                //datos.push()
            }
            console.log("wololo");
        }
    },
        function onReject(res) {
            console.log("Error recibiendo los datos: " + res.status);
            $window.alert("Ha ocurrido un error al recibir los datos. Vuelva a intentarlo de nuevo");
        });

    

    Highcharts.chart('grafica', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Monthly Average Temperature'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });
}

angular.module("calidadAire")
    .controller("controlador_analytics", ["$scope", "$http", "$window", function ($scope, $http, $window) {
        var base_url = "/api/v1/sensores";

        $scope.pintarGrafica = function pintarGrafica() {
            chart($http,$window,base_url);
        }

        console.log("Controlador para visualizar los datos de nuestra API de manera gráfica listo.");
        $scope.pintarGrafica();
    }]);
