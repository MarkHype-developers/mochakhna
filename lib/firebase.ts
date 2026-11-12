// Firebase SDK — loaded only by the admin panel (/admin), never by the public pages.
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FB } from "./content";

export const app = getApps().length ? getApp() : initializeApp(FB);
export const auth = getAuth(app);
export const db = getFirestore(app);
