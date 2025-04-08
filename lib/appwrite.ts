import {Account,Avatars,Client,OAuthProvider, Databases} from "react-native-appwrite";
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

 
export const config={
    platform: 'com.jsm.WellNex',
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectid: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

console.log("Appwrite Endpoint:", config.endpoint);
console.log("Appwrite Project ID:", config.projectid);

export const client=new Client();

client
    .setEndpoint(config.endpoint!)
    .setProject(config.projectid!)
    .setPlatform(config.platform!);

export const avatar=new Avatars(client);
export const account=new Account(client);
export const databases = new Databases(client);

export async function login(){
    try{
        const redirectUri= Linking.createURL("/");
        const response=await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri
        );
        if (!response) throw new Error("Failed to login");

        const browserResult = await WebBrowser.openAuthSessionAsync(response.toString(), redirectUri);

        if (browserResult.type != 'success') throw new Error("Failed to login"); 
                const url = new URL(browserResult.url);
        
                const secret = url.searchParams.get('secret')?.toString();
                const userId = url.searchParams.get('userId')?.toString();
        
                if (!secret || !userId) throw new Error('Failed to login');

                const session =await account.createSession(userId,secret);

                if (!session) throw new Error('Failed to create session');
                
                return true;
        
    }catch (error) {
        console.error(error);
        return false;
    }
}

export async function logout() {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getCurrentUser() {
    try {
      const response = await account.get();
      if (!response) return null;
  
      const userAvatar = avatar.getInitials(response.name);
      return { ...response, avatar: userAvatar.toString() };
    } catch (error) {
      return null; // Instead of logging an error, return null
    }
  }
  
  export async function getDocuments() {
    try {
      const response = await databases.listDocuments("67bd43150023c2506475", "67bd454b0021ca911867");
      return response.documents;
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  }

  export async function addDocument(data: any) {
    try {
      const response = await databases.createDocument("67bd43150023c2506475", "67bd454b0021ca911867", "unique()", data);
      return response;
    } catch (error) {
      console.error("Error adding document:", error);
      return null;
    }
  }
  
