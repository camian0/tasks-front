export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        console.log("entro al option del file", event)
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'aqui el localhost del front que se vaya a usar',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Credentials': true,
            },
            body: ''
        };
        return response;
    }
}