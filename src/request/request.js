apiUrl: import.meta.env.VITE_API_ENDPOINT_URL;

import { APP_HOST } from "../config/constants.js";
import { convertXML } from "@/config/constants.js";

// let loading;

export const postData = async function (url = "", data = {}, needToken) {
    url = APP_HOST + url;
    let aHeaders = new Headers();
    aHeaders.append("Content-Type", "application/json");
    // if (needToken) {
    //     let token = localStorage.getItem("token");
    //     if (token != null) {
    //         aHeaders.append("Authorization", `${"Bearer " + token}`);
    //     } else {
    //         throw "No se pudo obtener el token";
    //     }
    // }

    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: aHeaders,
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });
    const dataResponse = await response.json();
    return { status: response.status, "data": dataResponse };
};

export const deleteRequest = async function (url = "", needToken) {
    url = APP_HOST + url;
    let aHeaders = new Headers();
    aHeaders.append("Content-Type", "application/json");
    // if (needToken) {
    //     let token = localStorage.getItem("token");
    //     if (token != null) {
    //         aHeaders.append("Authorization", `${"Bearer " + token}`);
    //     } else {
    //         throw "No se pudo obtener el token";
    //     }
    // }
    const response = await fetch(url, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: aHeaders,
        redirect: "follow",
        referrerPolicy: "no-referrer",
    });
    return response.json();
};

export const getData = async function (url = "", params = {}) {
    try {
        url = APP_HOST + url;
        // Verificamos que hay params para enviarlos en la petición    
        console.log("params request", params);
        if (Object.keys(params).length > 0) {
            console.log("dentro revisar params")
            // Convertimos objetos a JSON antes de construir la URL
            // const formattedParams = Object.fromEntries(
            //     Object.entries(params).map(([key, value]) => [
            //         key,
            //         typeof value === "object" ? JSON.stringify(value) : value
            //     ])
            // );
            let jsonString = JSON.stringify(params)
            // const encodedJsonString = encodeURIComponent(jsonString);

            url += "?" + jsonString;
        }
        console.log("en la reques", url);
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                // Authorization: "Bearer " + localStorage.getItem("token"),
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });
        const dataResponse = await response.json();
        return { status: response.status, "data": dataResponse };
    } catch (error) {
        console.error("❌ Error en la subida:", error, Error.message);
        return { status: 400, message: "Error subiendo el archivo" };
    }

};

export const getRawData = async function (url = "") {
    url = APP_HOST + url;
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    });
    return response.text();
};

export const putDocument = async function (url = "", formData = null) {
    url = APP_HOST + url;
    const response = await fetch(url, {
        method: "POST",
        body: formData,
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    });
    return response.json();
};

// para subir archivos a s3
export const postFormData = async function (url = "", formData = null) {
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",

            redirect: "follow",
            referrerPolicy: "no-referrer",
        });
        if (response.status === 204) {
            return { 'status': 204, message: "Archivo subido correctamente" };
        }

        const errorText = await response.text();
        const errorJson = convertXML(errorText);
        console.error("❌ Error en la subida:", errorJson, Error.message);
        return { status: 400, message: `Error subiendo archivo ${errorJson, Error.message}` };

    } catch (error) {
        console.error("❌ Error en la subida:", errorJson, Error.message);
        return { status: 400, message: "Error subiendo el archivo" };

    }
};

export const putData = async function (url = "", data = {}) {
    url = APP_HOST + url;
    const response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + localStorage.getItem("token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });
    const dataResponse = await response.json();
    return { status: response.status, "data": dataResponse };
};

export const deleteData = async function (url = "", data = {}) {
    url = APP_HOST + url;
    const response = await fetch(url, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + localStorage.getItem("token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });
    const dataResponse = await response.json();
    return { status: response.status, "data": dataResponse };
};

// export const downloadData = async function (
//     url,
//     params = {},
//     name_file = "download.pdf"
// ) {
//     url = APP_HOST + url;
//     if (Object.keys(params).length > 0) {
//         url += "?" + new URLSearchParams(params).toString();
//     }
//     const response = await fetch(url, {
//         method: "GET",
//         mode: "cors",
//         cache: "no-cache",
//         credentials: "same-origin",
//         headers: {
//             "Content-Type": "blob",
//             // Authorization: "Bearer " + localStorage.getItem("token"),
//         },
//         redirect: "follow",
//         referrerPolicy: "no-referrer",
//     });

//     response
//         .blob()
//         .then((res) => {
//             let url = window.URL.createObjectURL(res);
//             const a = document.createElement("a");
//             a.download = name_file;
//             a.href = url;

//             document.body.appendChild(a);
//             a.click();
//             a.remove();

//             window.URL.revokeObjectURL(url);
//         })
//         .catch(() => {
//             ElNotification({
//                 title: "Error",
//                 message: "ocurrió un error al descargar el archivos",
//                 type: "error",
//             });
//         });
// };


export const downloadData = async function (url, params = {}, fileName = "download.pdf") {
    try {
        // Construcción de la URL del endpoint
        url = APP_HOST + url;
        if (Object.keys(params).length > 0) {
            url.search = new URLSearchParams(params).toString();
        }

        // Petición para obtener la URL del archivo
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                // Authorization: "Bearer " + localStorage.getItem("token"),
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener la URL del archivo");
        }

        // Extraer la URL del archivo de la respuesta (asumimos que la API devuelve un JSON con la URL)
        const data = await response.json();
        console.log("data", data);
        const fileUrl = data.url; // Ajusta esto según la estructura de tu respuesta

        if (!fileUrl) {
            throw new Error("No se recibió una URL válida para el archivo");
        }

        // Llamar a la función para descargar el archivo desde la URL obtenida
        downloadFileFromUrl(fileUrl, fileName);

    } catch (error) {
        console.log(error);
    }
};

// Función para descargar el archivo desde la URL obtenida
export const downloadFileFromUrl = async (fileUrl) => {
    try {
        const response = await fetch(fileUrl);
        console.log("respose archivo", fileUrl);
        if (!response.ok) {
            throw new Error("Error al descargar el archivo");
        }

        const blob = await response.blob();
        const urlParts = fileUrl.split("/",);
        let fileName = urlParts[urlParts.length - 1]; // Última parte de la URL como nombre del archivo        
        const fin = fileName.indexOf("?"); // Obtener el nombre del archivo desde la URL
        // console.log(urlParts)
        fileName = fileName.substring(0, fin);

        // Crear URL de descarga y forzar la descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);


    } catch (error) {
        console.error("Error al descargar el archivo:", error);
        ElNotification({
            title: "Error",
            message: "No se pudo descargar el archivo",
            type: "error",
        });
    }
};


export const downloadDataPOST = async function (
    url,
    formData = null,
    name_file = "download.pdf"
) {
    url = APP_HOST + url;
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    });

    response
        .blob()
        .then((res) => {
            let url = window.URL.createObjectURL(res);

            const a = document.createElement("a");
            a.download = name_file;
            a.href = url;
            a.target = "_blank";

            document.body.appendChild(a);
            a.click();
        })
        .catch(() => {
            ElNotification({
                title: "Error",
                message: "ocurrió un error al descargar el archivos",
                type: "error",
            });
        });
};

export const downloadDataNew = async function (
    url,
    params = {},
    name_file = "download.pdf"
) {
    url = APP_HOST + url;
    if (Object.keys(params).length > 0) {
        url += "?" + new URLSearchParams(params).toString();
    }
    await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    })
        .then(response => response.text())
        .then((resultText) => {
            let res = JSON.parse(resultText);
            if (res.error === true || res.error === undefined) {
                ElNotification({
                    title: "Atención",
                    message: res.message,
                    type: "warning",
                });
                return;
            }
            ElNotification({
                title: "Archivo generado",
                message: "El archivo se generó correctamente.",
                type: "success",
            });

            let dataEncoded = window.atob(res.data);
            let blob = createBlob(dataEncoded);

            let url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.download = name_file;
            a.href = url;

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        })
        .catch(() => {
            ElNotification({
                title: "Error",
                message: "Ocurrió un error al descargar el archivo",
                type: "error",
            });
        });
};

function createBlob(dataEncoded) {
    const byteCharacters = dataEncoded
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'contentType' });
    return blob;
}