export const redirectUrlByRole = (role: string) => {
  let redirect;
  switch (role) {
    case 'ADMIN':
      redirect = '/admin';
      break;
    case 'TEACHER':
      redirect = '/instructor';
      break;
    case 'DEAN':
      redirect = '/dean';
      break;
    case 'STUDENT':
      redirect = '/';
      break;
    default:
      return { error: 'User has different ip.', url: '', status: 403 };
  }
  return { success: 'yesyes', url: redirect, status: 200 };
};
