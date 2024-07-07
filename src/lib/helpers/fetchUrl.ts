export const fetchURL = async (data: any, url: string, method: string, errMessage: string) => {
  const response = await fetch(`${url}`, {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.NEXT_PUBLIC_API_KEY!,
    },
    body: JSON.stringify(data),
  });
  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.error || errMessage);
  }
  return res;
};
