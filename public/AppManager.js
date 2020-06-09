angular.module("calidadAire", ["ngRoute"]).config(function ($routeProvider) {
    $routeProvider.when("/",
        {
            templateUrl: "static.html",
        }
    )
    /*.when("/contact/:name",
        {
            templateUrl: "edit.html",
            controller: "EditCtrl"
        }
    );

    console.log("App initialized and configured");*/
});