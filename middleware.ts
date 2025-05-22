import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLivePreviewPath = request.nextUrl.pathname.startsWith("/live-preview");

  const isStoryblokRequest =
    request.nextUrl.searchParams.has("_storyblok") ||
    request.nextUrl.searchParams.has("_storyblok_tk") ||
    request.headers.get("referer")?.includes("app.storyblok.com");
  
  // Only handle live-preview paths
  if (isLivePreviewPath) {
    // If it's not a Storyblok request, redirect to home page
    if (!isStoryblokRequest) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    // Allow Storyblok requests to live-preview
    return NextResponse.next();
  }

  // For all other routes, proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$).*)",
  ],
};