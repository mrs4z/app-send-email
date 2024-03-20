import { NextRequest } from "next/server";
import * as fs from 'fs/promises';
import * as path from 'path';
import { renderEjsToHtml } from "@/utils/render";


export async function GET(request: NextRequest) {
    const directory = path.join(process.cwd(), 'emails');
    const files = await getFilesWithExtension(directory, 'ejs');

    const filesConverted = [];

    for(const item of files) {
        filesConverted.push(await renderEjsToHtml(item))
    }
    // console.log(files);

    return new Response(JSON.stringify(files), {
        status: 200
    });

}

async function getFilesWithExtension(directory: string, extension: string): Promise<string[]> {
    try {
        // Считываем содержимое директории
        const files: string[] = await fs.readdir(directory);
        
        // Фильтруем файлы по расширению
        const filteredFiles: string[] = files.filter(file => path.extname(file).toLowerCase() === '.' + extension.toLowerCase());
        
        return filteredFiles;
    } catch (error) {
        console.error('Error reading directory:', error);
        throw error;  // или обрабатывайте ошибку по вашему усмотрению
    }
}
