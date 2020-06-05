var express = require("express")
var path = require("path");
var bp = require("body-parser");
var app = express();

var dato = { "datasetid": "luftdaten_pm_bristol", "recordid": "15f58e8c75ca64891c1dc342c8a03115cc862f31", "fields": { "pm2_5": 1.69041666666667, "date": "2019-01-01T03:00:00Z", "sensor_id": "17459", "geo_point_2d": [51.464, -2.58241968111], "pm10": 4.075 }, "geometry": { "type": "Point", "coordinates": [-2.58241968111, 51.464] }, "record_timestamp": "2020-05-08T18:23:22.562+01:00" };

const MongoClient = require('mongodb').MongoClient;
const dburl = "mongodb+srv://admin:dgsin1920@dgsin1920-13-aire-mrw65.mongodb.net/dgsin1920?retryWrites=true&w=majority";

//Función adaptada, copiada de https://github.com/mii-dgsin/dgsin-contacts-back/blob/master/index.js:63
function formatSensores(sensores) {
    return sensores.map((reg) => {
        delete reg._id
        return reg;
    });
}

function checkFields(reg) {
    var b = (!reg.sensorid || !reg.fecha || !reg.pm10 || !reg.pm2_5 || !reg.latlong);
    return b;
};

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

app.use(bp.json());

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
    db.find({}).toArray((err, sensores) => {
        if (err) {
            console.error("Error obteniendo los datos de la BD: " + err);
            res.sendStatus(500);
        }
        else {
            var sin_id = formatSensores(sensores);
            console.debug("Mandando registros " + JSON.stringify(sensores, null, 2));
            res.send(sin_id);

        }
    });

});

//Post sobre colección para añadir recurso
app.post(BASE_API + "/sensores",(req, res) => {
    var nReg = req.body;
    if (!nReg) {
        console.warn("Petición POST a /sensores sin cuerpo, mandando 400");
        res.sendStatus(400);
    }
    else {
        console.info("Petición POST a /sensores con cuerpo: " + JSON.stringify(nReg));

        if (checkFields(nReg)) {
            console.warn("El registro no está bien formado, mandando 422. Registro recibido: " + nReg);
            res.sendStatus(422);
        }
        else {
            db.find({"sensorid":nReg.sensorid, "fecha":nReg.fecha}).toArray((err,sensores)=>{
                if(err){
                    console.error("Error recuperando datos de la BD: "+err);
                    res.sendStatus(500);
                }
                else{
                    if(sensores.length > 0){
                        console.warn("El registro a introducir ya existe. Mandando 409");
                        res.sendStatus(409);
                    }
                    else{
                        console.debug("Añadiendo registro: "+JSON.stringify(nReg,null,2));
                        db.insert(nReg);
                        res.sendStatus(201);
                    }

                }
            });
        }


    }
});



app.use("/", express.static(path.join(__dirname, "public")));


app.listen(process.env.PORT || 8080, () => {
    console.log("Servidor listo");
}).on("error", (e) => {
    console.error("Ha ocurrido un problema");
});
