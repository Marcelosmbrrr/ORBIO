import JSZip from "jszip";

export interface ValidationResult {
    verified_file: File | null;
    result: boolean;
    message: string;
    key: "valid" | "invalid";
}

/**
 * Valida um arquivo de log (KML ou KMZ).
 * @param file Arquivo a ser validado.
 * @returns Resultado da validação contendo o arquivo verificado, status e mensagem.
 */
export async function logValidation(file: File): Promise<ValidationResult> {
    let verified_file: File | null = null;
    let result: boolean;
    let message: string;
    let key: "valid" | "invalid";

    try {
        if (await isValidZip(file)) {
            const kmlContent = await convertKMZtoKML(file);
            const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
            const kmlFile = new File([blob], file.name.replace(/(\.tlog)?\.kmz$/, ".kml"), { type: 'application/vnd.google-earth.kml+xml' });
            await isValidKML(kmlFile);
            verified_file = kmlFile;
        } else {
            await isValidKML(file);
            verified_file = file;
        }
        result = true;
        message = 'Válido';
        key = "valid";
    } catch (error: any) {
        result = false;
        message = error.message;
        key = "invalid";
    }

    return { verified_file, result, message, key };
}

/**
 * Verifica se o arquivo é um ZIP válido.
 * @param file Arquivo a ser verificado.
 * @returns Verdadeiro se o arquivo for um ZIP válido, falso caso contrário.
 */
async function isValidZip(file: File): Promise<boolean> {
    const uint8Array = await new Response(file).arrayBuffer();
    const uint8ArraySlice = uint8Array.slice(0, 4);
    const view = new DataView(uint8ArraySlice);
    const signature = view.getUint32(0, true);

    // Assinatura de um arquivo ZIP: 0x04034b50
    return signature === 0x04034b50;
}

/**
 * Converte um arquivo KMZ em conteúdo KML.
 * @param file Arquivo KMZ a ser convertido.
 * @returns Conteúdo KML extraído do arquivo KMZ.
 */
async function convertKMZtoKML(file: File): Promise<string> {
    const jszip = new JSZip();
    let zip;
    try {
        zip = await jszip.loadAsync(file);
    } catch (error) {
        throw new Error('Failed to load KMZ file. Ensure it is a valid KMZ file.');
    }

    const kmlFile = zip.file(/.kml$/i)[0];
    if (kmlFile) {
        const kmlContent = await kmlFile.async('text');
        return kmlContent;
    } else {
        throw new Error('No KML file found in the KMZ.');
    }
}

/**
 * Verifica se um arquivo KML é válido.
 * @param file Arquivo KML a ser verificado.
 * @throws Erro se o arquivo não for um KML válido.
 */
async function isValidKML(file: File): Promise<void> {
    if (!file.name.endsWith('.kml')) {
        throw new Error('O arquivo não é um arquivo KML.');
    }

    if (file.size === 0) {
        throw new Error('O arquivo está vazio e não pode ser validado.');
    }

    const text = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'application/xml');

    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
        throw new Error('O conteúdo do arquivo não é um XML válido.');
    }

    const kmlElement = xmlDoc.getElementsByTagName('kml');
    if (kmlElement.length === 0) {
        throw new Error('O conteúdo do arquivo não é um arquivo KML válido.');
    }

    const kmlNamespace = kmlElement[0].namespaceURI;
    if (kmlNamespace !== 'http://www.opengis.net/kml/2.2') {
        throw new Error('O arquivo KML possui um namespace incorreto.');
    }

    const placemarks = xmlDoc.getElementsByTagName('Placemark');
    if (placemarks.length === 0) {
        throw new Error('O arquivo KML não contém nenhum elemento Placemark.');
    }

    const validateCoordinates = (coords: string): boolean => {
        const [longitude, latitude] = coords.split(',').map(Number);
        return (
            longitude >= -180 && longitude <= 180 &&
            latitude >= -90 && latitude <= 90
        );
    };

    const coordinates = xmlDoc.getElementsByTagName('coordinates');
    for (let i = 0; i < coordinates.length; i++) {
        const coordsText = coordinates[i].textContent;
        if (coordsText) {
            const coords = coordsText.trim().split(/\s+/);
            for (const coord of coords) {
                if (!validateCoordinates(coord)) {
                    throw new Error(`Coordenadas inválidas encontradas`);
                }
            }
        } else {
            throw new Error('O elemento de coordenadas está vazio ou não é válido.');
        }
    }
}