// // app/api/login/route.ts
// import { cookies } from 'next/headers';

// export async function POST(req: Request) {
//     const body = await req.json();
//     console.log(body);
//     // try {
//     //   const res = await fetch("https://unetech-apis-production.up.railway.app/api/admin_users/sign-in", {
//     //     method: 'POST',
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({
//     //       event: 'nestle',
//     //       email: req.body?.email,
//     //       password: req.body?.password
//     //     }),

//     //   });
//     //   const data = await res.json();
//     //   console.log(data)
//     //   const token = data;

//     //   // Set cookie
//     //   (await cookies()).set({
//     //     name: 'token',
//     //     value: token,
//     //     httpOnly: true,
//     //     path: '/',
//     //     secure: process.env.NODE_ENV === 'production',
//     //     sameSite: 'lax',
//     //     maxAge: 60 * 60 * 24, // 1 day
//     //   });
//     // } catch (error) {
//     //   console.log("Error fetching events:", error);
//     // } finally {
      
//     // }

//   const cookieStore = cookies();
//   (await cookieStore).set('token', 'abc123');

//   return new Response(JSON.stringify({ success: true }));
// }

import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json(); // This must match frontend Content-Type
    console.log('Parsed body:', body.token);
    (await cookies()).set({
      name: 'token',
      value: body.token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    });


    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error parsing request:', error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 400,
    });
  }
}
