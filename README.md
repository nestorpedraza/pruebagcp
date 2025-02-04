# Prueba Domina Node GCP

Este proyecto es una función HTTP de Google Cloud Functions que valida un token de autenticación y procesa una solicitud POST con datos JSON.

## Requisitos

- Node.js
- npm
- Google Cloud SDK

## Instalación

1. Clona el repositorio:
2. npm install
3. ejecutar el comando code .env
4. agregar al archivo .env y .env.yaml y agregar        variables de entorno

## Variables de Entorno .env
ACCESS_TOKEN = rnohxyEaSSuZceeLw9OBW7fXldOG05HEgkeK3N

DB_USER = postgres

DB_HOST = localhost

DB_NAME = nombreBD

DB_PASSWORD = passwordBD

DB_PORT = 5432

## Variables de Entorno .env.yaml
ACCESS_TOKEN: "rnohxyEaSSuZceeLw9OBW7fXldOG05HEgkeK3N"

DB_USER: "postgres"

DB_HOST: "localhost"

DB_NAME: "nombreBD"

DB_PASSWORD: "passwordBD"

DB_PORT: "5432"

DB_SSL: "true"

## Despliegue
1. Asegúrate de tener el SDK instalado y estar autenticado con: gcloud auth login
2. Selecciona el proyecto: gcloud config set project TU_ID_PROYECTO
3. comentar la linea: require('dotenv').config(); en el index.js
4. Despliega la función:
    gcloud functions deploy apiHttp --runtime nodejs20 --trigger-http --allow-unauthenticated --region us-central1 --env-vars-file .env.yaml
5. Para verificar el despliegue: gcloud functions describe apiHttp

## Notas importantes:
apiHttp debe coincidir con el nombre de tu función en index.js



