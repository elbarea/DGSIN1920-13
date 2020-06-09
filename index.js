var express = require("express")
var path = require("path");
var app = express();

var dato = { "datasetid": "luftdaten_pm_bristol", "recordid": "15f58e8c75ca64891c1dc342c8a03115cc862f31", "fields": { "pm2_5": 1.69041666666667, "date": "2019-01-01T03:00:00Z", "sensor_id": "17459", "geo_point_2d": [51.464, -2.58241968111], "pm10": 4.075 }, "geometry": { "type": "Point", "coordinates": [-2.58241968111, 51.464] }, "record_timestamp": "2020-05-08T18:23:22.562+01:00" };

const MongoClient = require('mongodb').MongoClient;
const dburl = "mongodb+srv://admin:dgsin1920@dgsin1920-13-aire-mrw65.mongodb.net/dgsin1920?retryWrites=true&w=majority";

var db;
var API = require("./API");
MongoClient.connect(dburl, (err, client) => {

    if (err) {
        console.error("Error de conexión con la BD" + err);
        process.exit(1);
    }
    else {
        db = client.db("dgsin1920").collection("sensores");
        db.find({}).toArray((err, sensores) => {
            if (err) {
                console.error("Error al recuperar los datos de la BD" + err);
            }
            else {
                console.log("Conectado a la base de datos con " + sensores.length + " registros cargados");
                API.register(app, db);

            }
        });

    }

});
app.use("/", express.static(path.join(__dirname, "public")));


app.listen(process.env.PORT || 8080, () => {
    console.log("Servidor listo");
}).on("error", (e) => {
    console.error("Ha ocurrido un problema");
});
