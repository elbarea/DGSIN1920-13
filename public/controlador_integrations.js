function charts1($http, $window, url) {
    var tiempo = new Set();
    var datos_energia = {};
    var datos_carbono = {};
    var datos_poblacion = {};
    var paises = new Set();
    var graph_data_energia = {};
    var graph_data_carbono = {};
    var graph_data_poblacion = {};
    var series_datos_energia = [];
    var series_datos_carbono = [];
    var series_datos_poblacion = [];
    var cats;

    $http.get(url).then(function onSuccess(res) {
        if (res.status == 200 && res.data.length > 0) {
            console.log("Registros recibidos: " + JSON.stringify(res.data, null, 2));
            var datos_raw = res.data;

            for (var i = 0; i < datos_raw.length; i++) {
                reg = datos_raw[i];
                if (!paises.has(reg.country)) {
                    paises.add(reg.country);
                    datos_energia[reg.country] = {};
                    datos_energia[reg.country][reg.year] = reg["energy-use"];
                    datos_carbono[reg.country] = {};
                    datos_carbono[reg.country][reg.year] = reg["carbon-emission"];
                    datos_poblacion[reg.country] = {};
                    datos_poblacion[reg.country][reg.year] = reg["population-total"];
                    tiempo.add(reg.year);
                }
                else {
                    tiempo.add(reg.year);
                    datos_energia[reg.country][reg.year] = reg["energy-use"];
                    datos_carbono[reg.country][reg.year] = reg["carbon-emission"];
                    datos_poblacion[reg.country][reg.year] = reg["population-total"];
                }
            }

            cats = Array.from(tiempo);

            for (var i in datos_energia) {
                var array = [];

                for (var j = 0; j < cats.length; j++) {
                    var f = cats[j];
                    if (!datos_energia[i][f]) {
                        array.push(null);
                    }
                    else {
                        array.push(datos_energia[i][f])
                    }
                }
                graph_data_energia[i] = array;
            }
            for (var i in datos_carbono) {
                var array = [];
                for (var j = 0; j < cats.length; j++) {
                    var f = cats[j];
                    if (!datos_carbono[i][f]) {
                        array.push(null);
                    }
                    else {
                        array.push(datos_carbono[i][f])
                    }
                }
                graph_data_carbono[i] = array;
            }

            for (var i in datos_poblacion) {
                var array = [];
                for (var j = 0; j < cats.length; j++) {
                    var f = cats[j];
                    if (!datos_poblacion[i][f]) {
                        array.push(null);
                    }
                    else {
                        array.push(datos_poblacion[i][f])
                    }
                }
                graph_data_poblacion[i] = array;
            }

            for (var o in graph_data_energia) {
                series_datos_energia.push({ name: o, data: graph_data_energia[o] });
            }

            for (var o in graph_data_carbono) {
                series_datos_carbono.push({ name: o, data: graph_data_carbono[o] });
            }

            for (var o in graph_data_poblacion) {
                series_datos_poblacion.push({ name: o, data: graph_data_poblacion[o] });
            }

            console.log("Datos cargados y procesados para su visualización");

            const min = arr => Math.min(...arr);
            const max = arr => Math.max(...arr);

            Highcharts.chart('grafica1', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Uso de energía'
                },
                subtitle: {
                    text: 'https://dgsin1920-02.herokuapp.com/api/v1/environment-stats'
                },

                xAxis: {
                    categories: cats,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'kg de petróleo equivalente'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f}kg</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: series_datos_energia
            });

            Highcharts.chart('grafica2', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Emisiones de carbono (C0<sub>2</sub>)',
                    useHTML: true
                },
                subtitle: {
                    text: 'https://dgsin1920-02.herokuapp.com/api/v1/environment-stats'
                },

                xAxis: {
                    categories: cats,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'kt (kiloToneladas)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f}kt</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: series_datos_carbono
            });

            Highcharts.chart('grafica3', {
                chart: {
                    type: 'area'
                },
                title: {
                    text: 'Población por años'
                },
                subtitle: {
                    text: 'https://dgsin1920-02.herokuapp.com/api/v1/environment-stats'
                },

                xAxis: {
                    allowDecimals: false,
                    labels: {
                        formatter: function () {
                            return this.value;
                        }
                    },
                    accessibility: {
                        rangeDescription: min(tiempo) + " a " + max(tiempo)
                    }
                },
                yAxis: {
                    title: {
                        text: 'Population'
                    },
                    labels: {
                        formatter: function () {
                            return this.value / 1000000 + 'M';
                        }
                    }
                },
                tooltip: {
                    pointFormat: '{series.name} - {point.y:,.0f}</b><br/>people in {point.x}'
                },
                plotOptions: {
                    area: {
                        pointStart: min(tiempo),
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    }
                },
                series: series_datos_poblacion
            });
        }
    },
        function onReject(res) {
            console.log("Error recibiendo los datos: " + res.status);
            $window.alert("Ha ocurrido un error al recibir los datos. Vuelva a intentarlo de nuevo");
        });
}

function charts2($http, $window, url) {
    var tiempo = new Set();
    var datos_consumo = {};
    var datos_trenes = {};
    var datos_aviones = {};
    var paises = new Set();
    var graph_data_consumo = {};
    var graph_data_trenes = {};
    var graph_data_aviones = {};
    var series_datos_consumo = [];
    var series_datos_trenes = [];
    var series_datos_aviones = [];
    var cats;

    $http.get(url).then(function onSuccess(res) {
        if (res.status == 200 && res.data.length > 0) {
            console.log("Registros recibidos: " + JSON.stringify(res.data, null, 2));
            var datos_raw = res.data;

            for (var i = 0; i < datos_raw.length; i++) {
                reg = datos_raw[i];
                if (!paises.has(reg.country)) {
                    paises.add(reg.country);
                    datos_consumo[reg.country] = {};
                    datos_consumo[reg.country][reg.year] = reg["elect-pwr-cns"];
                    datos_trenes[reg.country] = {};
                    datos_trenes[reg.country][reg.year] = reg["rail-lns"];
                    datos_aviones[reg.country] = {};
                    datos_aviones[reg.country][reg.year] = reg["air-trnspt"];
                    tiempo.add(reg.year);
                }
                else {
                    tiempo.add(reg.year);
                    datos_consumo[reg.country][reg.year] = reg["elect-pwr-cns"];
                    datos_trenes[reg.country][reg.year] = reg["rail-lns"];
                    datos_aviones[reg.country][reg.year] = reg["air-trnspt"]
                }
            }

            cats = Array.from(tiempo);

            for (var i in datos_consumo) {
                var array = [];

                for (var j = 0; j < cats.length; j++) {
                    var f = cats[j];
                    if (!datos_consumo[i][f]) {
                        array.push(null);
                    }
                    else {
                        array.push(datos_consumo[i][f])
                    }
                }
                graph_data_consumo[i] = array;
            }
            for (var i in datos_trenes) {
                var array = [];
                for (var j = 0; j < cats.length; j++) {
                    var f = cats[j];
                    if (!datos_trenes[i][f]) {
                        array.push(null);
                    }
                    else {
                        array.push(datos_trenes[i][f])
                    }
                }
                graph_data_trenes[i] = array;
            }

            for (var i in datos_aviones) {
                var array = [];
                for (var j = 0; j < cats.length; j++) {
                    var f = cats[j];
                    if (!datos_aviones[i][f]) {
                        array.push(null);
                    }
                    else {
                        array.push(datos_aviones[i][f])
                    }
                }
                graph_data_aviones[i] = array;
            }

            for (var o in graph_data_consumo) {
                series_datos_consumo.push({ name: o, data: graph_data_consumo[o] });
            }

            for (var o in graph_data_trenes) {
                series_datos_trenes.push({ name: o, data: graph_data_trenes[o] });
            }

            for (var o in graph_data_aviones) {
                series_datos_aviones.push({ name: o, data: graph_data_aviones[o] });
            }

            console.log("Datos cargados y procesados para su visualización");

            const min = arr => Math.min(...arr);
            const max = arr => Math.max(...arr);

            Highcharts.chart('grafica4', {
                chart: {
                    type: 'area'
                },
                title: {
                    text: 'Consumo por años'
                },
                subtitle: {
                text: 'https://dgsin1920-02.herokuapp.com/api/v1/infrastructure-stats'
            },
                xAxis: {
                allowDecimals: false,
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                },
                accessibility: {
                    rangeDescription: min(tiempo) + " a " + max(tiempo)
                }
            },
                yAxis: {
                title: {
                    text: 'kwh per cápita'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
                tooltip: {
                pointFormat: '{series.name} - {point.y:,.0f}</b><br/>khw per cápita en {point.x}'
            },
                plotOptions: {
                area: {
                    pointStart: min(tiempo),
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
                series: series_datos_consumo
            });

    Highcharts.chart('grafica5', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Líneas de ferrocarril por años'
        },
        subtitle: {
            text: 'https://dgsin1920-02.herokuapp.com/api/v1/infrastructure-stats'
        },
        xAxis: {
            categories: cats,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'km Totales'
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            }
        },
        tooltip: {
            split: true,
            valueSuffix: ' km'
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series:series_datos_trenes
    });

    Highcharts.chart('grafica6', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Transporte aéreo por años'
        },
        subtitle: {
            text: 'https://dgsin1920-02.herokuapp.com/api/v1/infrastructure-stats'
        },
        xAxis: {
            categories: cats,
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'Salidas de avión registradas'
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            }
        },
        tooltip: {
            split: true,
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            }
        },
        series:series_datos_aviones
    });
}
    },
function onReject(res) {
    console.log("Error recibiendo los datos: " + res.status);
    $window.alert("Ha ocurrido un error al recibir los datos. Vuelva a intentarlo de nuevo");
});
}


angular.module("calidadAire")
    .controller("controlador_integrations", ["$scope", "$http", function ($scope, $http, $window) {
        var url_api1 = "proxy13/api/v1/environment-stats";
        var url_api2 = "proxy13/api/v1/infrastructure-stats";

        function integracion1() {
            charts1($http, $window, url_api1);
        }

        function integracion2() {
            charts2($http, $window, url_api2);
        }
        console.log("Controlador para visualizar los datos de nuestra API de manera gráfica listo.");
        //get();
        integracion1();
        integracion2();
    }]);
