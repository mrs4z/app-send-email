import * as ejs from 'ejs';
import * as fs from 'fs/promises';
import * as path from 'path';
import i18next from '../../i18n-setup';
import globalVars from '../../global-vars.json';
// const i18next = require('./i18n-setup');

function isJavaScriptKeyword(word: string) {
    const keywords = ['true', 'false', 'null', 'undefined', 'this', 'function', 'if', 'return', 'var', 'let', 'const', 'while', 'for', 'switch', 'case', 'break', 'continue', 'new', 'delete', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'void', 'in', 'of', 'do', 'with', 'class', 'extends', 'static', 'import', 'export', 'super'];
    return keywords.includes(word);
}

export const renderEjsToHtml = async (pathToFile: string, vars = []): Promise<string> => {
    const ejsFilePath = path.join(process.cwd(), 'emails', pathToFile);
    const ejsData = {
        ...globalVars,
        t: i18next.t.bind(i18next),
    };

    try {
        const readEjs = await fs.readFile(ejsFilePath, 'utf-8');
        return ejs.render(readEjs, ejsData);
    } catch(e) {
        throw e;
    }
}

export const findVariablesInEJS = async (fileName: string): Promise<string[]> => {
    const pathFile = path.join(process.cwd(), 'emails', fileName);
    const content = await fs.readFile(pathFile, 'utf-8');
    const regex = /<%=?\s*([^%>]+?)\s*%>/g;
    let match;
    const variables = new Set();

    while ((match = regex.exec(content)) !== null) {
        const expression = match[1].trim();

        if (expression.startsWith('t(')) {
            const argsRegex = /\{([\s\S]*?)\}/g;
            const argsMatch = argsRegex.exec(expression);

            if (argsMatch) {
                const argsContent = argsMatch[1];
                const varRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b(?=:)/g;
                let varMatch;
                while ((varMatch = varRegex.exec(argsContent)) !== null) {
                    variables.add(varMatch[0]);
                }
            }
        } else {
            const varRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
            let varMatch;
            while ((varMatch = varRegex.exec(expression)) !== null) {
                if (!isJavaScriptKeyword(varMatch[0])) {
                    variables.add(varMatch[0]);
                }
            }
        }
    }

    // @ts-ignore
    return Array.from(variables);
}

export const updateJsonFile = async (fields: string[]) => {
    try {
        const pathFile = path.join(process.cwd(), 'global-vars.json');
        const jsonContent = await fs.readFile(pathFile, 'utf-8');
        const jsonData = JSON.parse(jsonContent);

        let isUpdated = false;

        fields.forEach(field => {
        if (jsonData[field] === undefined) {
            jsonData[field] = '';
            isUpdated = true;
        }
        });

        if(isUpdated) {
            await fs.writeFile(pathFile, JSON.stringify(jsonData, null, 2), 'utf-8');
        }
    } catch(e) {
        console.error(e);
    }
}


export const getAllEmailTemplatesPaths = async () => {
    const directory = path.join(process.cwd(), 'emails');
    return await getFilesWithExtension(directory, 'ejs');
}


async function getFilesWithExtension(directory: string, extension: string): Promise<string[]> {
    try {
        const files: string[] = await fs.readdir(directory);
        const filteredFiles: string[] = files.filter(file => path.extname(file).toLowerCase() === '.' + extension.toLowerCase());
        return filteredFiles;
    } catch (error) {
        console.error('Error reading directory:', error);
        throw error;  // или обрабатывайте ошибку по вашему усмотрению
    }
}

