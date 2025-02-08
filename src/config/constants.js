import { XMLParser } from "fast-xml-parser";

export const APP_HOST = import.meta.env.VITE_API_ENDPOINT_URL;



export async function convertXML(url) {
    const parser = new XMLParser();
    const jsonResult = parser.parse(text);

    console.log(jsonResult);
}
