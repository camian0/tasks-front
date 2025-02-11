import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// import { v4 } from "uuid";

export const handler = async (event) => {
    let response = null;
    try {
        // cliente dynamo
        const client = new DynamoDBClient({});
        const docClient = DynamoDBDocumentClient.from(client);

        let { email, task_name, file_name, finish_date, task_state } = JSON.parse(event.body);
        const numeroAleatorio = Math.floor(Math.random() * 100) + 1;
        let id = numeroAleatorio;
        let newItem = {
            id, email, task_name, file_name, finish_date, task_state,
        };

        const command = new PutCommand({
            TableName: "testTable",
            Item: newItem,
            ConditionExpression: "attribute_not_exists(id)"
        });
        let res = await docClient.send(command);
        console.log(res);
        response = {
            statusCode: 200,
            body: JSON.stringify({ "message": "Tarea creada correctamente. ", "data": res.Attributes })
        };
        return response;
    } catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            console.error("Error en Lambda: El id ya existe", err.message);
            console.error("Stack trace:", err.stack);
            response = {
                statusCode: 400,
                body: JSON.stringify({
                    "response": "Error creando la tarea, verifica la tarea enviada"
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
                "message": "Error guardando la tarea."
            })
        };
        return response;
    }
};