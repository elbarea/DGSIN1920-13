angular.module("calidadAire", ["ngRoute"]).config(function ($routeProvider) {
    $routeProvider.when("/",
        {
            templateUrl: "static.html",
        }
    )
        .when("/list",
            {
                templateUrl: "listado.html",
                controller:"controlador_listado"
            });

    console.log("Aplicación cargada y configurada correctamente");
});