import { type NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer';
import fs from 'fs/promises'; 

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    const slug = params.slug;
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const htmlContent = await fs.readFile(`emails/${slug}`, 'utf8');
    await page.setContent(htmlContent);
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();
    return new NextResponse(screenshot, {
        headers: {
            'Content-Type': 'image/png',
        },
    });
}