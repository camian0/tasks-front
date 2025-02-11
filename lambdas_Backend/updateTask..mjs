import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// import { v4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    let response = null;
    try {
        // cliente dynamo

        let { email, task_name, finish_date, task_state } = JSON.parse(event.body);

        let itemID = Number.parseInt(event.pathParameters.taskID);
        let newItem = {
            email, task_name, finish_date, task_state,
        };

        const command = new UpdateCommand({
            TableName: "testTable",
            Key: { id: itemID },
            UpdateExpression: "set task_name = :task_name, finish_date = :finish_date, task_state = :task_state",
            ExpressionAttributeValues: {
                ":task_name": newItem.task_name,
                ":finish_date": newItem.finish_date,
                ":task_state": newItem.task_state,
            },
            ConditionExpression: "attribute_exists(id)",
            ReturnValues: "ALL_NEW",
        });
        let res = await docClient.send(command);
        console.log(res);

        response = {
            statusCode: 200,
            body: JSON.stringify({ "message": "Tarea actualizada correctamente. ", "data": res.Attributes })
        };
        return response;
    } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            console.error("Error en Lambda: Actualizar tarea no se econtró el id", err.message);
            console.error("Stack trace:", err.stack);
            response = {
                statusCode: 400,
                body: JSON.stringify({
                    "response": "Error actualizando la tarea, verifica la tarea enviada"
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
                "response": "Error actualizando la tarea, verifica la tarea enviada"
            })
        };
        return response;
    }

};