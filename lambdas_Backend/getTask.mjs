import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Crear el cliente de DynamoDB
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    let response = null;
    try {
        // Parámetros para la paginación
        const limit = 2; // Número de items por página
        console.log("peticion: ", JSON.stringify({ event }));

        let exclusiveStartKey = null;
        // verificamos si hay string parameters en la url y si existe la clave exclusiveStartKey
        // if (event.queryStringParameters && event.queryStringParameters.exclusiveStartKey) {
        if (event.queryStringParameters) {
            // exclusiveStartKey = JSON.parse(event.queryStringParameters.exclusiveStartKey)
            const encodedJsonString = Object.keys(event.queryStringParameters)[0];
            // Paso 2: Decodificar la cadena JSON
            // const decodedJsonString = decodeURIComponent(encodedJsonString);
            // Paso 3: Analizar la cadena JSON para convertirla en un objeto
            const jsonObject = JSON.parse(encodedJsonString);
            console.log("jsonObject: ", jsonObject);
            console.log("clave: ", jsonObject.exclusiveStartKey);

        }

        console.log("despues query exclusiveStartKey: ", exclusiveStartKey);
        // Obtener las tareas con paginación
        const scanCommand = new ScanCommand({
            TableName: "testTable",
            Limit: limit,
            ...(exclusiveStartKey && { ExclusiveStartKey: exclusiveStartKey })
        });

        const res = await docClient.send(scanCommand);
        console.log("Resultado del escaneo:", res);

        response = {
            statusCode: 200,
            body: JSON.stringify({
                "message": "Tares obtenidas correctamente.",
                "items": res.Items,
                "lastEvaluatedKey": res.LastEvaluatedKey // Esto se utiliza para obtener la siguiente página de resultados
            })
        };
        return response;
    } catch (err) {
        console.error("Error en Lambda obtener tareas:", err.message);
        console.error("Stack trace: ", err.stack);

        // Información adicional del error
        console.error("Nombre del error: ", err.name);
        if (err.requestId) {
            console.error("Request ID: ", err.requestId);
        }
        if (err.statusCode) {
            console.error("Status Code: ", err.statusCode);
        }
        if (err.code) {
            console.error("Error Code: ", err.code);
        }

        response = {
            statusCode: 500,
            body: JSON.stringify({
                "message": "Error obteniendo las tareas",
            })
        };
        return response;
    }
};
