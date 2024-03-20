import { type NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer';
import fs from 'fs/promises'; 
import { renderEjsToHtml } from '@/utils/render';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    const slug = params.slug;
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    // const htmlContent = await fs.readFile(`emails/${slug}`, 'utf8');
    const htmlContent = await renderEjsToHtml(slug);
    await page.setContent(htmlContent);
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();
    return new NextResponse(screenshot, {
        headers: {
            'Content-Type': 'image/png',
        },
    });
}