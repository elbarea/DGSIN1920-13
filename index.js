var express = require("express")
var path = require("path");
var app = express();
var cors = require("cors");
var request = require("request");
const api_externa = "https://dgsin1920-02.herokuapp.com";

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
app.use("/proxy13", (req, res) => {
    var url_api = api_externa + req.url;
    console.log(req.baseUrl + req.url + " correctamente enrutado");
    req.pipe(request(url_api)).pipe(res);
});
app.use(cors());


app.listen(process.env.PORT || 8080, () => {
    console.log("Servidor listo");
}).on("error", (e) => {
    console.error("Ha ocurrido un problema");
});
