import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.time('Login Middleware');

  // Example logic
  console.log('Processing login request');

  // Middleware logic here, e.g. checking authentication
  // You might want to return a response based on your logic
  // const isLoggedIn = checkAuthentication(request);

  console.timeEnd('Login Middleware');
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
