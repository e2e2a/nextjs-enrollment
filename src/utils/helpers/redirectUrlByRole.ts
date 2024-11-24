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
    case 'ACCOUNTING':
      redirect = '/accounting';
      break;
    default:
      return { error: 'Forbidden.', url: '', status: 403 };
  }
  return { success: 'yesyes', url: redirect, status: 200 };
};
