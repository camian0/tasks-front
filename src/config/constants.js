import { XMLParser } from "fast-xml-parser";

export const APP_HOST = import.meta.env.VITE_API_ENDPOINT_URL;

export function convertXML(xmlResponse) {
    const parser = new XMLParser();
    const jsonResult = parser.parse(xmlResponse);
    return jsonResult
}

export const TASK_STATUS = {
    "TO DO": "PENDIENTE",
    PROCESS: "EN PROCESO",
    FINISHED: "FINALIZADO",
}