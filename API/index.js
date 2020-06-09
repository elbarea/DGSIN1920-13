var path = require("path");
var bp = require("body-parser");
var express = require("express")

const BASE_API = "/api/v1";

//Función adaptada, copiada de https://github.com/mii-dgsin/dgsin-contacts-back/blob/master/index.js:63
function formatSensores(sensores) {
    return sensores.map((reg) => {
        delete reg._id
        return reg;
    });
}

//Función para comprobar si un objeto está vacío
//Necesaria porque cuando se mandan peticiones sin cuerpo
//el cuerpo es {}, el cual es un objeto (!obj devuelve false)
//pero el objeto está vacío. 
//Código extraído de https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
function isEmpty(obj) {
    return (Object.keys(obj).length === 0 && obj.constructor === Object);
}


function checkFields(reg) {
    var b = (!reg.sensorid || !reg.fecha || !reg.pm10 || !reg.pm2_5 || !reg.latlong);
    return b;
};

function checkDateFormat(fecha) {
    var regex_fecha = RegExp(/^(2\d{3})[-](([0][1-9])|([1][0-2]))[-](([0][1-9])|([12][0-9])|([3][01]))[T](([01][0-9])|([2][0-3]))[:]([0-5][0-9])[:]([0-5][0-9])Z$/);
    var check = regex_fecha.test(fecha);
    return check;
};
module.exports.register = function (app, db) {



    app.use(bp.json());
    app.use("/", express.static(path.join(__dirname, "public")));

    app.get(BASE_API + "/sensores/docs",(req,res)=>{
        res.redirect("https://martian-shuttle-476641.postman.co/collections/11617864-f1285501-c876-4dae-b935-443bc6dfae74?version=latest&workspace=0e638d6e-e75c-43d4-84d6-bdc36e284504");
    });

    app.get(BASE_API + "/sensores/loadInitialData", (req, res) => {

        db.find({}).toArray((err, sensores) => {
            if (sensores.length == 0) {
                console.info("Base de datos vacía, añadiendo valores iniciales");
                var jsondb = require("../bd/bd.json");
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
    app.post(BASE_API + "/sensores", (req, res) => {
        var nReg = req.body;
        if (isEmpty(nReg)) {
            console.warn("Petición POST a /sensores sin cuerpo, mandando estado 400");
            res.sendStatus(400);
        }
        else {
            console.info("Petición POST a /sensores con cuerpo: " + JSON.stringify(nReg));

            if (checkFields(nReg)) {
                console.warn("El registro no está bien formado, mandando 422. Registro recibido: " + nReg);
                res.sendStatus(422);
            }
            else {
                db.find({ "sensorid": nReg.sensorid, "fecha": nReg.fecha }).toArray((err, sensores) => {
                    if (err) {
                        console.error("Error recuperando datos de la BD: " + err);
                        res.sendStatus(500);
                    }
                    else {
                        if (sensores.length > 0) {
                            console.warn("El registro a introducir ya existe. Mandando estado 409");
                            res.sendStatus(409);
                        }
                        else {
                            console.debug("Añadiendo registro: " + JSON.stringify(nReg, null, 2));
                            db.insert(nReg);
                            res.sendStatus(201);
                        }

                    }
                });
            }


        }
    });

    //Delete sobre colección para borrarla

    app.delete(BASE_API + "/sensores", (req, res) => {
        console.info("Petición de DELETE para eliminar colección sensores");
        db.remove({}, { multi: true }, (err, result) => {
            if (err) {
                console.error("Error eliminando colección de la BD");
                res.sendStatus(500);
            }
            else {
                var n = result.result.n;
                if (n == 0) {
                    console.warn("No hay registros que eliminar");
                    res.sendStatus(404);
                } else {
                    console.debug(n + " registros eliminados exitosamente.");
                    res.sendStatus(204);
                }
            }
        });
    });

    //PUT sobre colección -- no permitido

    app.put(BASE_API + "/sensores", (req, res) => {
        console.warn("Petición PUT a /sensores, operación no permitida, mandando estado 405");
        res.sendStatus(405);

    });


    //El GET se haría sobre un id de sensor, y se devuelven
    //todas las mediciones disponibles de dicho sensor

    app.get(BASE_API + "/sensores/:id", (req, res) => {
        var id = req.params.id;
        if (!id) {
            console.warn("Petición GET de recurso específico sin id");
            res.sendStatus(400);
        }
        else {
            console.info("Petición recibida para servir /sensores/" + id);
            db.find({ "sensorid": id }).toArray((err, sensores) => {
                if (err) {
                    console.error("Error de la BD");
                    res.sendStatus(500);
                }
                else {
                    if (sensores.length > 0) {
                        var respuesta = formatSensores(sensores);
                        console.debug("Mandando registros correspondientes al sensor " + id);
                        res.send(respuesta);
                    }
                    else {
                        console.warn("No existe un sensor con el id pedido");
                        res.sendStatus(404);
                    }
                }
            });
        }
    });

    //GET sobre recurso específico
    //Hay que especificar id de sensor, fecha y hora de medición

    app.get(BASE_API + "/sensores/:id/:fecha", (req, res) => {
        var id = req.params.id;
        var fecha = req.params.fecha;

        if (!id || !fecha) {
            console.warn("Petición GET de recurso específico sin id o sin fecha");
            res.sendStatus(400);
        }
        else {
            console.info("Petición GET recibida para servir /sensores/" + id + "/" + fecha);

            if (!checkDateFormat(fecha)) {
                console.warn("Formato de fecha incorrecto, mandando estado 422");
                res.sendStatus(422);
            }
            else {
                db.find({ "sensorid": id, "fecha": fecha }).toArray((err, reg) => {
                    if (err) {
                        console.error("Error de acceso a la BD");
                        res.sendStatus(500);
                    }
                    else {
                        if (reg.length > 0) {
                            var respuesta = formatSensores(reg);
                            console.debug("Mandando registro correspondiente al sensor " + id + " con fecha " + fecha);
                            res.send(reg);
                        }
                        else {
                            console.warn("No existe un registro con id de sensor: " + id + " y fecha: " + fecha);
                            res.sendStatus(404);
                        }
                    }
                });
            }

        }
    });

    //POST a un recurso específico -- no permitido
    app.post(BASE_API + "/sensores/:id", (req, res) => {
        var id = req.params.id;
        console.warn("Petición POST a /sensores/" + id + "; no permitido, mandando estado 405");
        res.sendStatus(405);
    });

    app.post(BASE_API + "/sensores/:id/:fecha", (req, res) => {
        var id = req.params.id;
        var fecha = req.params.fecha;
        console.warn("Petición POST a /sensores/" + id + " /" + fecha + "; no permitido, mandando estado 405");
        res.sendStatus(405);
    });

    //DELETE a un recurso específico -- solo id
    app.delete(BASE_API + "/sensores/:id", (req, res) => {
        var id = req.params.id;
        if (!id) {
            console.warn("Petición DELETE a /sensores/:id sin id, mandando estado 400");
            res.sendStatus(400);
        }
        else {
            console.info("Petición DELETE a /sensores/" + id);
            db.remove({ "sensorid": id }, {}, (err, result) => {
                if (err) {
                    console.error("Error eliminando registros de la BD");
                    res.sendStatus(500);
                }
                else {
                    var n = result.result.n;
                    if (n == 0) {
                        console.warn("No se ha eliminado nignún registro. Compruebe el id");
                        res.sendStatus(404);
                    }
                    else {
                        console.debug("Registros eliminados: " + n);
                        res.sendStatus(204);
                    }



                }
            });
        }
    });

    //DELETE sobre recurso específico -- id y fecha
    app.delete(BASE_API + "/sensores/:id/:fecha", (req, res) => {
        var id = req.params.id;
        var fecha = req.params.fecha;

        if (!id || !fecha) {
            console.warn("Petición DELETE de recurso específico sin id o sin fecha");
            res.sendStatus(400);
        }
        else {
            console.info("Petición DELETE recibida para eliminar registro" + id + "/" + fecha);

            if (!checkDateFormat(fecha)) {
                console.warn("Formato de fecha incorrecto, mandando estdo 422");
                res.sendStatus(422);
            }
            else {
                db.remove({ "sensorid": id, "fecha": fecha }, (err, result) => {
                    if (err) {
                        console.error("Error de acceso a la BD");
                        res.sendStatus(500);
                    }
                    else {
                        var n = result.result.n;
                        if (n == 0) {
                            console.warn("No se ha eliminado nignún registro. Compruebe el id y la fecha introducidas");
                            res.sendStatus(404);
                        }
                        else {
                            console.debug("Registro con id " + id + " y fecha " + fecha + " eliminado");
                            res.sendStatus(204);
                        }
                    }
                });
            }

        }
    });

    //PUT a un recurso específico con id y fecha

    app.put(BASE_API + "/sensores/:id/:fecha", (req, res) => {

        var id = req.params.id;
        var fecha = req.params.fecha;
        var nReg = req.body;
        if (!id || !fecha) {
            console.warn("Petición PUT sobre recurso específico sin id o sin fecha");
            res.sendStatus(400);
        }
        else if (isEmpty(nReg)) {
            console.warn("Petición PUT a /sensores/" + id + "/" + fecha + " sin cuerpo, mandando estado 400")
            res.sendStatus(400);
        }
        else {
            console.info("Petición PUT a /sensores/" + id + "/" + fecha + " con cuerpo " + JSON.stringify(nReg, null, 2));
            var c1 = checkDateFormat(fecha);
            var c2 = checkDateFormat(nReg.fecha);
            var b = checkFields(nReg);
            if (b) {
                console.warn("El cuerpo de la petición no está bien formado: " + JSON.stringify(nReg));
                console.warn("Mandando estado 422");
                res.sendStatus(422);
            }
            else {
                if (!c1 || !c2) {
                    console.warn("El formato de la fecha no es correcto");
                    res.sendStatus(422);
                } else {
                    db.find({ "sensorid": id, "fecha": fecha }).toArray((err, sensores) => {
                        if (err) {
                            console.error("Error recuperando datos de la BD");
                            res.sendStatus(500);
                        }
                        else {
                            if (sensores.length > 0) {
                                db.update({ "sensorid": id, "fecha": fecha }, nReg);
                                console.debug("Actualizando registro con id " + id + " y fecha " + fecha);
                                res.send(nReg);
                            }
                            else {
                                console.warn("No hay ningún registro asociado al sensor con id " + id + " y fecha " + fecha);
                                res.sendStatus(404);
                            }
                        }
                    })
                }
            }
        }
    });



}