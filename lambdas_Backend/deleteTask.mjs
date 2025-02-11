import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// import { v4 } from "uuid";

// cliente dynamo
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    let response = null;
    try {
        let itemID = Number.parseInt(event.pathParameters.taskID);
        const command = new DeleteCommand({
            TableName: "testTable",
            Key: { id: itemID },
            ConditionExpression: "attribute_exists(id)"
        });
        let res = await docClient.send(command);
        console.log(res);

        response = {
            statusCode: 200,
            body: JSON.stringify({ "message": "Tarea eliminada correctamente." })
        };
        return response;
    } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            console.error("Error en Lambda: Eliminar tarea no se econtró el id", err.message);
            console.error("Stack trace:", err.stack);
            response = {
                statusCode: 400,
                body: JSON.stringify({
                    "message": "Error eliminando la tarea verifica, la tarea enviada"
                })
            };
            return response;
        }
        console.error("Error en Lambda: Eliminar tarea", err.message);
        console.error("Stack trace:", err.stack);

        // Información adicional del error
        console.error("Nombre del error:", err.name);
        if (err.requestId) {
            console.error("Request ID:", err.requestId);
        }
        if (err.statusCode) {
            console.error("Status Code:", err.statusCode);
        }
        if (err.code) {
            console.error("Error Code:", err.code);
        }
        response = {
            statusCode: 500,
            body: JSON.stringify({
                "message": "Error eliminando la tarea."
            })
        };
        return response;
    }

};