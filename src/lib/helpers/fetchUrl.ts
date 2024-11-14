// export const fetchURL = async ( url: string, method: string, errMessage: string, data?: any,) => {
//   const response = await fetch(`${url}`, {
//     method: `${method}`,
//     headers: {
//       'Content-Type': 'application/json',
//       'API-Key': process.env.NEXT_PUBLIC_API_KEY!,
//     },
//     body: data ? JSON.stringify(data) : undefined,
//   });
//   const res = await response.json();

//   if (!response.ok) {
//     throw new Error(res.error || errMessage);
//   }
//   return res;
// };
