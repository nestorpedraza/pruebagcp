# Prueba Domina Node GCP

Este proyecto es una función HTTP de Google Cloud Functions que valida un token de autenticación y procesa una solicitud POST con datos JSON.

## Requisitos

- Node.js
- npm
- Google Cloud SDK

## Instalación

1. Clona el repositorio:
2. ejecutar el comando code .env
3. agregar al archivo .env
ACCESS_TOKEN = rnohxyEaSSuZceeLw9OBW7fXldOG05HEgkeK3N
DB_USER =  postgres
DB_HOST = localhost
DB_NAME = nombreBD
DB_PASSWORD = passwordBD
DB_PORT = 5432

4. ejecutar el comando: node --env-file .env index.js

    
## Despliegue

1. Asegúrate de tener el SDK instalado y estar autenticado con: gcloud auth login
2. Selecciona el proyecto: gcloud config set project TU_ID_PROYECTO
3. comentar la linea: require('dotenv').config(); en el index.js
3. Despliega la función:
    gcloud functions deploy apiHttp --runtime nodejs20 --trigger-http --allow-unauthenticated --region us-central1 --env-vars-file .env.yaml

Notas importantes:

apiHttp debe coincidir con el nombre de tu función en index.js
Convierte tus variables de .env a .env.yaml para GCP: ACCESS_TOKEN: "TU_TOKEN_DE_VALIDACION"
DB_USER: "postgres"
DB_HOST: "localhost"
DB_NAME: "nombrebd"
DB_PASSWORD: "password"
DB_PORT: "5432"
DB_SSL: "true"

4. Para verificar el despliegue: gcloud functions describe apiHttp

5. Para obtener la URL de la función: gcloud functions describe apiHttp --format='get(httpsTrigger.url)'

