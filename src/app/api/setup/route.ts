import { findVariablesInEJS, getAllEmailTemplatesPaths, updateJsonFile } from "@/utils/render";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const allEmails = await getAllEmailTemplatesPaths();

    for(const email of allEmails) {
        const getVariables = await findVariablesInEJS(email);
        if(getVariables.length > 0) {
            await updateJsonFile(getVariables);
        }
    }

    return new Response(
        JSON.stringify({
            message: 'good'
    }), { status: 200 });
}
