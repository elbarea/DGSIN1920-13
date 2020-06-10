angular.module("calidadAire", ["ngRoute"]).config(function ($routeProvider) {
    $routeProvider.when("/",
        {
            templateUrl: "static.html",
        }
    )
        .when("/list",
            {
                templateUrl: "listado.html",
                controller: "controlador_listado"
            })
        .when("/sensor/:id",
            {
                templateUrl: "sensor.html",
                controller: "controlador_sensor"
            })
        .when("/sensor/:id/:fecha",
            {
                templateUrl: "edicion.html",
                controller: "controlador_edicion"
            })


        ;

    console.log("Aplicación cargada y configurada correctamente");
});