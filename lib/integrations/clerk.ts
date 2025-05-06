import { auth, currentUser } from '@clerk/nextjs/server';

export async function getUserEmail(): Promise<string | null> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return null;
    }
    const user = await currentUser();
    return user?.emailAddresses[0]?.emailAddress ?? null;
  } catch (error) {
    console.error('Error fetching user email:', error);
    return null;
  }
}