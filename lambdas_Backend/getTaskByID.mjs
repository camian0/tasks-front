import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// import { v4 } from "uuid";

// cliente dynamo
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    let response = null;
    try {
        let itemID = Number.parseInt(event.pathParameters.id);
        const command = new GetCommand({
            TableName: "testTable",
            Key: { id: itemID },

        });
        let res = await docClient.send(command);
        console.log(res);

        if (!res.Item) {
            response = {
                statusCode: 400,
                body: JSON.stringify({ "message": "Tarea no cencontrada, verifica la tarea enviada" })
            };
            return response;
        }

        response = {
            statusCode: 200,
            body: JSON.stringify({ "message": "Tarea obtenida correctamente.", "data": res.Item })
        };
        return response;
    } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            console.error("Error en Lambda: obtener tarea por id, no se econtró el id", err.message);
            console.error("Stack trace:", err.stack);
            response = {
                statusCode: 400,
                body: JSON.stringify({
                    "response": "Error obteniendo tarea por id verifica la tarea enviada"
                })
            };
            return response;
        }
        console.error("Error en Lambda: obtener tarea por id", err.message);
        console.error("Stack trace:", err.stack);

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
    }

};