'use server';

import Accounts from '@/models/Accounts';

export const createAccount = async (account: any, userId: string) => {
  const newAccount = new Accounts({
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
