import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const contentLength = req.headers.get('content-length');

  // Check if request size exceeds 50 MB
   if (contentLength && parseInt(contentLength, 10) > 50 * 1024 * 1024) {
      return NextResponse.json(
         { message: 'Payload too large. The maximum file size allowed is 50MB.' },
         { status: 413 }
      )
   }

  return NextResponse.next()
}