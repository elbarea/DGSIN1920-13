# Documentación proyecto DGSIN1920-13

-----------
Fuente de los datos: <https://opendata.bristol.gov.uk/explore/dataset/luftdaten_pm_bristol/information/>

## Acceder a todas las mediciones

* Petición
  * GET  <https://dgsin1920-13.herokuapp.com/api/v1/sensores>
* Respuesta:
  
  ```json
   [
    {
      "sensorid": "17459",
      "fecha": "2019-01-01T03:00:00Z",
      "pm10": 4.075,
      "pm2_5": 1.69041666666667,
      "latlong": "51.464, -2.58241968111"
    },
    {
      "sensorid": "14679",
      "fecha": "2019-01-01T03:00:00Z",
      "pm10": 11.4491666666667,
      "pm2_5": 5.04666666666667,
      "latlong": "51.4183818022, -2.59161819781"
    },...
   ]
  ```
  
## Acceder a las mediciones hechas por un sensor

* Petición
  * GET <https://dgsin1920-13.herokuapp.com/api/v1/sensores/:idsensor>
  * Por ejemplo: GET <https://dgsin1920-13.herokuapp.com/api/v1/sensores/17459>
* Respuesta

  ```json
  [
      {
          "sensorid": "17459",
          "fecha": "2019-01-01T03:00:00Z",
          "pm10": 4.075,
          "pm2_5": 1.69041666666667,
          "latlong": "51.464, -2.58241968111"
      },
      {
          "sensorid": "17459",
          "fecha": "2019-01-01T02:00:00Z",
          "pm10": 3.30916666666667,
          "pm2_5": 1.74875,
          "latlong": "51.464, -2.58241968111"
      },
      {
          "sensorid": "17459",
          "fecha": "2019-01-01T01:00:00Z",
          "pm10": 4.12291666666667,
          "pm2_5": 2.21416666666667,
          "latlong": "51.464, -2.58241968111"
      }
  ]
  ```

## Acceder a una medición en concreto

* Petición
  * GET <https://dgsin1920-13.herokuapp.com/api/v1/sensores/:idsensor/:fecha>
  * Por ejemplo: GET <https://dgsin1920-13.herokuapp.com/api/v1/sensores/17459/2019-01-01T02:00:00Z>
* Respuesta

  ```json
  [
    {
      "sensorid": "17459",
      "fecha": "2019-01-01T02:00:00Z",
      "pm10": 3.30916666666667,
      "pm2_5": 1.74875,
      "latlong": "51.464, -2.58241968111"
    }
  ]
  ```

## Poblar la BD si está vacía

* Petición
  * GET <https://dgsin1920-13.herokuapp.com/api/v1/sensores/loadInitialData>
* Respuesta
  * BD vacía:

  ```html
  201 Created
  ```

  * BD no vacía:
  
  ```html
  409 Conflict
  ```

## Incluir un recurso nuevo

* Petición
  * POST <https://dgsin1920-13.herokuapp.com/api/v1/sensores/>
  * Cuerpo:
  
  ```json
  {
    "sensorid": "12376",
    "fecha": "2019-01-01T03:00:00Z",
    "pm10": "1",
    "pm2_5": "1.5",
    "latlong": "4,3"
  }
  ```

* Respuesta

  ```html
  201 Created
  ```
  
## Eliminar una colección completa

* Petición
  * DELETE <https://dgsin1920-13.herokuapp.com/api/v1/sensores/>
* Respuesta:
  * La colección existe:
  
  ```html
  204 No Content
  ```

  * La colección no existe:
  
  ```html
  404 Not Found
  ```

## Eliminar todas las mediciones de un sensor

* Petición
  * DELETE <https://dgsin1920-13.herokuapp.com/api/v1/sensores/:idsensor>
  * Por ejemplo: DELETE <https://dgsin1920-13.herokuapp.com/api/v1/sensores/17459>
* Respuesta:

  ```html
  204 No Content
  ```

## Eliminar una medición en concreto

* Petición
  * DELETE <https://dgsin1920-13.herokuapp.com/api/v1/sensores/:idsensor/:fecha>
  * Por ejemplo: DELETE <https://dgsin1920-13.herokuapp.com/api/v1/sensores/14679/2019-01-01T03:00:00Z>
* Respuesta:

  ```html
  204 No content
  ```

## Actualizar un recurso específico

* Petición
  * PUT <https://dgsin1920-13.herokuapp.com/api/v1/sensores/7677/2019-01-01T02:00:00Z>
  * Cuerpo:
  
  ```json
  {
    "sensorid": "12376",
    "fecha": "2019-01-01T03:00:00Z",
    "pm10": "1",
    "pm2_5": "1.5",
    "latlong": "4,3"
  }
  ```

* Respuesta
  
  ```json
  {
    "sensorid": "12376",
    "fecha": "2019-01-01T03:00:00Z",
    "pm10": "1",
    "pm2_5": "1.5",
    "latlong": "4,3"
  }
  ```

