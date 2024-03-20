import { type NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';
import {renderEjsToHtml} from "@/utils/render";


export async function POST(request: NextRequest) {
    const { email, template } = await request.json()
    await sendMail(email, template);

    return new Response(JSON.stringify({
        message: 'good'
    }), {
        status: 200
    })

}

async function sendMail(email: string, htmlTemplate: string) {
    // const path = await fs.readFile(`emails/${htmlTemplate}`, 'utf8');
    const path = await renderEjsToHtml(htmlTemplate)
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: '',
            pass: ''
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    let transporter = nodemailer.createTransport(config);

    let info = await transporter.sendMail({
      from: `"Test MAIL" <${config.auth.user}>`,
      to: email,
      subject: 'TEST',
      text: '',
      html: path
    });

    console.log(info);

    return info.messageId;
  }
