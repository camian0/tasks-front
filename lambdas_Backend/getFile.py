import boto3
import json

def lambda_handler(event, context):
    s3 = boto3.client("s3")
    
    # Nombre del archivo que se subirá, tomado de los parámetros de la ruta
    nameFile = event['pathParameters']['id'] if ('pathParameters' in event and 'id' in event['pathParameters'] )else "test.txt"
    
    print(nameFile)
    # Generar URL presignada para la subida del archivo
    url = s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={
            "Bucket":"nombre del bucket",
            "Key": f"uploaded/{nameFile}"
        },        
        ExpiresIn=300  
    )
    print(url)  
    response = {
      "statusCode": 200,
      "body": json.dumps({
          "url": url
        })
    }
    print(response)
    return response