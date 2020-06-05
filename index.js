var express = require("express")
var path = require("path");
var bp = require("body-parser");
var app = express();

var dato = { "datasetid": "luftdaten_pm_bristol", "recordid": "15f58e8c75ca64891c1dc342c8a03115cc862f31", "fields": { "pm2_5": 1.69041666666667, "date": "2019-01-01T03:00:00Z", "sensor_id": "17459", "geo_point_2d": [51.464, -2.58241968111], "pm10": 4.075 }, "geometry": { "type": "Point", "coordinates": [-2.58241968111, 51.464] }, "record_timestamp": "2020-05-08T18:23:22.562+01:00" };

const MongoClient = require('mongodb').MongoClient;
const dburl = "mongodb+srv://admin:dgsin1920@dgsin1920-13-aire-mrw65.mongodb.net/dgsin1920?retryWrites=true&w=majority";
var client = MongoClient.connect(dburl, (err, client) => {

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
            }
        });

    }

});

const BASE_API = "/api/v1";


app.get(BASE_API + "/sensores/loadInitialData", (req, res) => {

    db.find({}).toArray((err, sensores) => {
        if (sensores.length == 0) {
            console.info("Base de datos vacía, añadiendo valores iniciales");
            var jsondb = require("./bd/bd.json");
            for (var i = 0; i < jsondb.length; i++) {
                var sensorid = jsondb[i].fields.sensor_id;
                var fecha = jsondb[i].fields.date;
                var pm10 = jsondb[i].fields.pm10;
                var pm2_5 = jsondb[i].fields.pm2_5;
                var latlong = jsondb[i].fields.geo_point_2d;

                var entrada = {
                    "sensorid": sensorid,
                    "fecha": fecha,
                    "pm10": pm10,
                    "pm2_5": pm2_5,
                    "latlong": latlong[0] + ", " + latlong[1]
                }

                db.insert(entrada);
            }
            console.log("Inserción terminada");
            res.sendStatus(201);
        }
        else {
            console.warn("Base de datos no vacía, no se hace nada");
            res.sendStatus(409);
        }
    });
});


//Hacer get sobre una colección
app.get(BASE_API + "/sensores", (req, res) => {
    console.info("Petición GET a /sensores");
    db.find({}).toArray((err, sensores)=>{
        if (err) {
            console.error("Error obteniendo los datos de la BD: " + err);
            res.sendStatus(500);
        }
        else {
            console.debug("Mandando registros " + JSON.stringify(sensores, null, 2));
            res.send(sensores);

        }
    });

});

app.use("/", express.static(path.join(__dirname, "public")));

app.use(bp.json);

app.listen(process.env.PORT || 8080, () => {
    console.log("Servidor listo");
}).on("error", (e) => {
    console.error("Ha ocurrido un problema");
});
