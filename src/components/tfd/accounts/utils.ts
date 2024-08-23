import type { UserData } from '@/components/tfd/accounts/AuthProvider';

const endpoints = {
  login: '/api/login',
  register: '/api/register',
} as const;

type Form = {
  email: string;
  username?: string;
  password: string;
};

export const accountRequest = async (action: keyof typeof endpoints, data: Form): Promise<UserData | undefined> => {
  try {
    const url = endpoints[action];
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message);
    }
    const { username, id } = result;

    return { username, id };
  } catch (error) {
    console.error('Error Logging in:', error);

    return undefined;
  }
};
