import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const comingSoonUrl = '/coming-soon';
  
  const isStoryblokRequest = 
    request.nextUrl.searchParams.has('_storyblok') ||
    request.nextUrl.searchParams.has('_storyblok_tk') ||
    request.headers.get('referer')?.includes('app.storyblok.com');

  const isComingSoonPage = request.nextUrl.pathname === comingSoonUrl;

  if (!isStoryblokRequest && !isComingSoonPage) {
    return NextResponse.redirect(new URL(comingSoonUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$).*)'],
};