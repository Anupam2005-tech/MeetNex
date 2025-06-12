const { Client, Account } = require("node-appwrite");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_APIKEY);

const account = new Account(client);
async function getCurrentSession() {
    try {
      const session = await account.getSession('current');
      return session;
    } catch (error) {
      console.error("Error fetching current session:", error.message);
      return null;
    }
  }

module.exports = { account, getCurrentSession };
