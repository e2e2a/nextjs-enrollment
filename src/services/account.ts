'use server';

import Account from '@/models/Account';

export const createAccount = async (account: any, userId: string) => {
  const newAccount = new Account({
    provider: account?.provider,
    type: account?.type,
    providerAccountId: account?.providerAccountId,
    access_token: account?.access_token,
    expires_at: account?.expires_at,
    scope: account?.scope,
    token_type: account?.token_type,
    id_token: account?.id_token,
    userId: userId,
  });
  await newAccount.save();
};
