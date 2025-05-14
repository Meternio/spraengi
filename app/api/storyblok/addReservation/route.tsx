import { NextResponse } from "next/server";
import { ISbContentMangmntAPI } from "@storyblok/react/rsc";
import { ReservationStoryblok } from "@/component-types-sb";

const STORYBLOK_SPACE_ID = "335981";
const STORYBLOK_MANAGEMENT_TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN;
const RESERVATIONS_FOLDER_ID = "668141819";

export async function POST(request: Request): Promise<Response> {
  try {
    const body: ReservationStoryblok  = await request.json();
    const { name, phone, email, message, people, date, time } = body;

    if (!name || !phone || !people || !date || !time) {
      return NextResponse.json(
        { message: "Es gab einen Fehler bei der Reservation, bitte überprüfe deine Daten nochmals!" },
        { status: 400 },
      );
    }

    const folderId = RESERVATIONS_FOLDER_ID;

    const storyPayload: ISbContentMangmntAPI = {
      story: {
        name: `${name} (${people}) - ${new Date(date).toLocaleDateString("de-DE")}, ${time}`,
        slug: `${name
          .toLowerCase()
          .replace(/\s+/g, "-")}-${Date.now()}`,
        parent_id: folderId,
        content: {
          component: "reservation",
          name: name,
          phone: phone,
          email: email || "",
          message: message || "",
          people: parseInt(people, 10),
          time: time,
          date: new Date(date).toLocaleDateString("de-DE"),
        },
      },
    };

    const createStoryResponse = await fetch(
      `https://mapi.storyblok.com/v1/spaces/${STORYBLOK_SPACE_ID}/stories/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(STORYBLOK_MANAGEMENT_TOKEN && { Authorization: STORYBLOK_MANAGEMENT_TOKEN }),
        },
        body: JSON.stringify(storyPayload),
      },
    );

    if (!createStoryResponse.ok) {
      const errorData = await createStoryResponse.json();
      console.error("Storyblok API Error (creating story):", errorData);
      return NextResponse.json(
        {
          message: "Es gab einen Fehler bei der Reservation, bitte überprüfe deine Daten nochmals!",
          error: errorData,
        },
        { status: createStoryResponse.status },
      );
    }

    const newStory = await createStoryResponse.json();
    return NextResponse.json(
      { message: "Reservation erfolgreich!", story: newStory },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { message: "Es gab einen Fehler bei der Reservation, bitte überprüfe deine Daten nochmals!" },
      { status: 500 },
    );
  }
}
