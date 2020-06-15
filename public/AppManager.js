angular.module("calidadAire", ["ngRoute"]).config(function ($routeProvider) {
    $routeProvider.when("/",
        {
            templateUrl: "static.html",
        }
    )
        .when("/about", {
            templateUrl:"about.html"
        })
        .when("/list",
            {
                templateUrl: "listado.html",
                controller: "controlador_listado"
            })
        .when("/analytics",
            {
                templateUrl: "analytics.html",
                controller: "controlador_analytics"
            })
        .when("/integrations",
            {
                templateUrl: "integrations.html",
                controller: "controlador_integrations"
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