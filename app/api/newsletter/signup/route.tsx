// @ts-expect-error no definition
import mailchimp from "@mailchimp/mailchimp_marketing";
import { NextRequest, NextResponse } from "next/server";

// Mailchimp Konfiguration
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Check if email is valid
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Gültige E-Mail-Adresse erforderlich" },
        { status: 400 }
      );
    }

    const listId = process.env.MAILCHIMP_LIST_ID;

    // Add email to Mailchimp list
    const result = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
    });

    return NextResponse.json({
      success: true,
      message: "E-Mail erfolgreich zum Newsletter hinzugefügt",
      memberId: result.id,
    });
  } catch (error: unknown) {
    console.error("Mailchimp API Fehler:", error);

    return NextResponse.json(
      {
        error: "Fehler beim Hinzufügen zum Newsletter",
        details: error,
      },
      { status: 500 }
    );
  }
}