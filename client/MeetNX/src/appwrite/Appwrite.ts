import { Client, Account, ID, OAuthProvider } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
 
export const createEmailTokenForLogin = async (email: string) => {
  try {
    const sessionToken = await account.createEmailToken(
      ID.unique(),
      email
    );
    return sessionToken;
  } catch (error) {
    console.error("Error creating email token:", error);
    throw error;
  }
};

export const createOAuth2Session = (
  provider: OAuthProvider,
  // Fix: Add a type assertion to the default environment variable.
  successUrl: string = import.meta.env.VITE_SUCCESS_URL as string, 
  failureUrl: string
) => {
  try {
    account.createOAuth2Session(provider, successUrl, failureUrl);
  } catch (error) {
    console.error("Error creating OAuth session:", error);
    throw error;
  }
};

export const completeEmailSession = async (userId: string, secret: string) => {
  try {
    const session = await account.createSession(userId, secret);
    return session;
  } catch (error) {
    console.error("Error completing email session:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    if ((error as { code: number }).code === 401) {
      return null;
    }
    console.error("Error getting current user:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
