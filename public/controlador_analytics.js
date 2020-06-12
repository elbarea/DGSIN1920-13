function chart($http, $window, base_url) {
    var tiempo = new Set();
    var datospm10 = {};
    var datospm2_5 = {};
    var sensores = new Set();
    var graph_data_pm10 = {};
    var graph_data_pm25 = {};
    var series_datospm10 = [];
    var series_datospm25 = [];
    var cats;

    $http.get(base_url).then(function onSuccess(res) {
        if (res.status == 200 && res.data.length > 0) {
            console.log("Registros recibidos: " + JSON.stringify(res.data, null, 2));
            var datos_raw = res.data;

            for (var i = 0; i < datos_raw.length; i++) {
                reg = datos_raw[i];
                if (!sensores.has(reg.sensorid)) {
                    sensores.add(reg.sensorid);
                    datospm10[reg.sensorid] = {};
                    datospm10[reg.sensorid][reg.fecha] = reg.pm10;
                    datospm2_5[reg.sensorid] = {};
                    datospm2_5[reg.sensorid][reg.fecha] = reg.pm2_5;
                    tiempo.add(reg.fecha);
                }
                else {
                    tiempo.add(reg.fecha);
                    datospm10[reg.sensorid][reg.fecha] = reg.pm10;
                    datospm2_5[reg.sensorid][reg.fecha] = reg.pm2_5;
                }
            }

            cats = Array.from(tiempo);

            for (var i in datospm10) {
                var array = [];

                for (var j = 0; j < cats.length; j++) {
                    var f = cats[j];
                    if (!datospm10[i][f]) {
                        array.push(null);
                    }
                    else {
                        array.push(datospm10[i][f])
                    }
                }
                graph_data_pm10[i] = array;
            }
            for (var i in datospm2_5) {
                var array = [];
                for (var j = 0; j < cats.length; j++) {
                    var f = cats[j];
                    if (!datospm2_5[i][f]) {
                        array.push(null);
                    }
                    else {
                        array.push(datospm2_5[i][f])
                    }
                }
                graph_data_pm25[i] = array;
            }

            for (var o in graph_data_pm10) {
                series_datospm10.push({ name: "Sensor " + o, data: graph_data_pm10[o] });
            }

            for (var o in graph_data_pm25) {
                series_datospm25.push({ name: "Sensor " + o, data: graph_data_pm25[o] });
            }

            console.log("Datos cargados y procesados para su visualización");
            Highcharts.chart('grafica1', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'PM<sub>10</sub> por hora',
                    useHTML: true
                },
                subtitle: {
                    text: 'Source: https://opendata.bristol.gov.uk/explore/dataset/luftdaten_pm_bristol/information/'
                },
                xAxis: {
                    categories: cats
                },
                yAxis: {
                    title: {
                        text: 'PM<sub>10</sub>',
                        useHTML: true
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: true
                    }
                },
                series: series_datospm10
            });

            Highcharts.chart('grafica2', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'PM<sub>2.5</sub> por hora',
                    useHTML: true
                },
                subtitle: {
                    text: 'Source: https://opendata.bristol.gov.uk/explore/dataset/luftdaten_pm_bristol/information/'
                },
                xAxis: {
                    categories: cats
                },
                yAxis: {
                    title: {
                        text: 'PM<sub>2.5</sub> por hora',
                        useHTML: true
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: false
                        },
                        enableMouseTracking: true
                    }
                },
                series: series_datospm25
            });
        }
    },
        function onReject(res) {
            console.log("Error recibiendo los datos: " + res.status);
            $window.alert("Ha ocurrido un error al recibir los datos. Vuelva a intentarlo de nuevo");
        });






}

angular.module("calidadAire")
    .controller("controlador_analytics", ["$scope", "$http", "$window", function ($scope, $http, $window) {
        var base_url = "/api/v1/sensores";

        function pintarGrafica() {
            chart($http, $window, base_url);
        }

        console.log("Controlador para visualizar los datos de nuestra API de manera gráfica listo.");
        pintarGrafica();
    }]);
