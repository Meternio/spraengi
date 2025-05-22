import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLivePreviewPath = request.nextUrl.pathname.startsWith("/live-preview");
  const isApiValidatePath = request.nextUrl.pathname === "/api/validate";

  const isStoryblokRequest =
    request.nextUrl.searchParams.has("_storyblok") ||
    request.nextUrl.searchParams.has("_storyblok_tk") ||
    request.headers.get("referer")?.includes("app.storyblok.com");
  
  // Protect /api/validate - only allow Storyblok requests
  if (isApiValidatePath) {
    // If it's not a Storyblok request, return 403 Forbidden
    if (!isStoryblokRequest) {
      return new NextResponse(null, { status: 403 });
    }
    
    // Allow Storyblok requests to the API
    return NextResponse.next();
  }
  
  // Handle live-preview paths
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
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$).*)",
    "/api/validate"
  ],
};