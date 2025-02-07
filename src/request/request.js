apiUrl: import.meta.env.VITE_API_ENDPOINT_URL;

import { APP_HOST } from "../config/constants.js";

// let loading;

export const postData = async function (url = "", data = {}, needToken) {
    url = APP_HOST + url;
    let aHeaders = new Headers();
    aHeaders.append("Content-Type", "application/json");
    if (needToken) {
        let token = localStorage.getItem("token");
        if (token != null) {
            aHeaders.append("Authorization", `${"Bearer " + token}`);
        } else {
            throw "No se pudo obtener el token";
        }
    }
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
    const data = await response.json();
    return { status: response.status, data };
};

export const deleteRequest = async function (url = "", needToken) {
    url = APP_HOST + url;
    let aHeaders = new Headers();
    aHeaders.append("Content-Type", "application/json");
    if (needToken) {
        let token = localStorage.getItem("token");
        if (token != null) {
            aHeaders.append("Authorization", `${"Bearer " + token}`);
        } else {
            throw "No se pudo obtener el token";
        }
    }
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
    url = APP_HOST + url;
    // Verificamos que hay params para enviarlos en la petición
    if (Object.keys(params).length > 0) {
        url += "?" + new URLSearchParams(params).toString();
    }
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
    const data = await response.json();
    return { status: response.status, data };
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

export const putFormData = async function (url = "", formData = null) {
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

export const putData = async function (url = "", data = {}) {
    url = APP_HOST + url;
    const response = await fetch(url, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });
    const data = await response.json();
    return { status: response.status, data };
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
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
    });
    const data = await response.json();
    return { status: response.status, data };
};

export const downloadData = async function (
    url,
    params = {},
    name_file = "download.pdf"
) {
    url = APP_HOST + url;
    if (Object.keys(params).length > 0) {
        url += "?" + new URLSearchParams(params).toString();
    }
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "blob",
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

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        })
        .catch(() => {
            ElNotification({
                title: "Error",
                message: "ocurrió un error al descargar el archivos",
                type: "error",
            });
        });
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