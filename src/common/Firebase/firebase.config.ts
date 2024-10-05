import * as firebaseJson from 'src/common/Firebase/firebase-admin.json';
import admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.cert({
	  projectId: firebaseJson.project_id,
	  privateKey: firebaseJson.private_key,
	  clientEmail: firebaseJson.client_email,
	
	}),
	storageBucket: "novedades-68953.appspot.com",
  });
  
  export const firebaseAdmin = admin;
