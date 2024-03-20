import { type NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        await fs.writeFile(`global-vars.json`, JSON.stringify(data, null, 2), 'utf-8');
        return new Response(JSON.stringify({ ok: true }), {
            status: 200
        });
    } catch(e) {
        return new Response(JSON.stringify({ ok: false, error: 'Invalid json scheme' }), {
            status: 500
        });
    }
}

export async function GET(request: NextRequest) {
    const getItem = await fs.readFile(`global-vars.json`);
    return new Response(getItem, {
        status: 200
    });
}
