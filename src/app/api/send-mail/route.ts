import { type NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer';
import fs from 'fs/promises'; 
import nodemailer from 'nodemailer';


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
    const path = await fs.readFile(`emails/${htmlTemplate}`, 'utf8');
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'mrs4zjs@gmail.com',
        pass: 'uuup jijt zmfo rdkd'
      }
    });
  
    let info = await transporter.sendMail({
      from: '"Test MAIL" <mrs4zjs@gmail.com>',
      // to: 'rodionkislov@yandex.ru',
      to: email,
      // to: 'bolshov-96@bk.ru',
      // to: 'mrs4z@icloud.com',
      // to: 'mrs4zjs@gmail.com',
      subject: 'TEST',
      text: '',
      html: path
    });
  
    return info.messageId;
  }