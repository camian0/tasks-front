import boto3
import json
import traceback

def lambda_handler(event, context):
    try:        
        s3 = boto3.client("s3")        
        # Nombre del archivo que se subirá, tomado de los parámetros de la ruta
        nameFile = event['pathParameters']['id'] if ('pathParameters' in event and 'id' in event['pathParameters'] )else "test.txt"        
        # Generar URL presignada para la subida del archivo
        presigned_post = s3.generate_presigned_post(
            Bucket="nombre del bucket",
            Key=f"uploaded/{nameFile}",
            ExpiresIn=300  
        )
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'url local host que se conecta',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps(presigned_post)            
        }

    except Exception as e:
        # Capturar detalles del error
        error_message = f"Error: {type(e).__name__} - {str(e)}"
        stack_trace = traceback.format_exc()

        print("=== ERROR EN LAMBDA generar link archivo===")
        print(error_message)
        print(stack_trace)

        return {
            "statusCode": 500,
            "message": json.dumps({
                "error": error_message,
                "stack_trace": stack_trace
            })
        }

