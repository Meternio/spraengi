import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log("Email API called");
    
    const body = await req.json();
    const { to, subject, content, replyTo } = body;

    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, or content" },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("Missing SMTP environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("Creating transporter...");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    });

    console.log("Sending email...");
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      ...(replyTo && { replyTo }),
      subject,
      html: content,
    });

    console.log("Email sent successfully:", info.messageId);
    return NextResponse.json(
      { 
        success: true,
        message: "Email sent successfully", 
        messageId: info.messageId 
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Email API error:", error);
    
    // Always return JSON, even on error
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to send email", 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}