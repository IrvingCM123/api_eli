const dotenv_config = require('dotenv').config();
const secrets = dotenv_config.parsed;

const project_id = secrets.project_id
const private_key = secrets.private_key
const client_email = secrets.client_email
const storage_bucket = secrets.storageBucket  

import admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.cert({
	  projectId: "novedades-68953",
	  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyGf1wr4JjhJbT\n3f6E19l7DeBSZ8Bgs60pSj06MLQUWGTUXWlVxFvojCrcKgOpWOpeZSA/fRmatsP9\n86fnZMAK3RgX1bZQhRTXspTS+Qe4nTxdYTBiKw02ZbSlVMED1U41ZHYhW4unLDI0\nNY7uW+Sf1ITWyeE8ALgWLA+yt7R0bCbdwKH/rrZjhSrupZjaltF45wxPrcHPNI0w\nBZJdeBW+Ci17epzzji5CQpFjM6IaV1cxvgayGkXMeZwSMXl5Aa6llPuzUFa7fqYu\n3tYWk6fi/wL2FYqHMWeYwcGJODGvTohs5BBduV6rKxZ+wH2H6Zvt4PIvKkiIW9yD\n1W/REuDPAgMBAAECggEAOLj3U1LKg7iAMvUCcTuvq7XVKlmZ1xKShVJ8IpLNX6dx\nYYNon2S84tj1c448AUzsw+iQNzg4FeK8lB5sbNFVKoCVAk5R1N41r6bUKEcg8ua9\nCX6BItrUR+1ndbqDCJ4AXRfkWaZm2XTFfoRKQ9bnfxH3xtKgFfSirIkW7NP+OI+K\nDkC3RaboepKHvmmEaTE4BeUkQTLap17DfZaueXdXMCQvRckk6QEWr6b0yf2EgGBm\nnlaIXyY9cOocU6SmiAcMnLO8jnQ8ja1DUC3nWRHPQPn6s0ORf4yXbsFv0dMdnPaT\n7baGxPlJdxlrKJCN6BXnTTYHfIdC8Y7BuMeQ2vWhQQKBgQD1n2CDZ3rTXclltjzt\n2DMLCeti8P4AFXmPK+/YLt7vTYDo/7LozfAq5kZbPIIjb116P32MgsSxSmyTclsH\nl0RL50NJyu5umn3wshXWdca+VXTV/cvxHqFl1F/bnwk/c3AoSSVco4cWY4LSLqti\n23EAP0JYk8xnUZBQ1j3j6tlIwQKBgQC5oFBXIaQzj3TWnm5714jRmW+mOdKrs3he\n7E6ixcc3I3cBjdjtapCLO8gnWRekui+Ni9gIWHnF2RUSBbd5Rn7Lxv4Gx1+3pYvO\nRo2UqOZFsiXSXaKzajFSX8sIQnFUu45+zGUCPclJ/5cE6M8byC+jpZOClbvr6Upc\nl7B8T219jwKBgCh1PyWF5wJn4WOil/ipcwbvdFlQztXes640k4YtekU6o/A9JhAY\n0+WNFquylNEXZ/NZ/+kkJRf65VWIMZxXe0Vxa3D9Pzbytanu+4/eyITTeLJC4tPt\nsrIeQEfhs1lDP4czPTc8LGUwsPzD+TEIal2bDeefOL0P/1CBaaJgLbhBAoGAZlnm\n8qQyDdwD6HLjKJXncurPjTBE4TfMH0rc8RNsjRKZA9payk3/9UW5TzjouIOQxNNf\nAvsF6fmQjKdqSwx7zZCjcMluFazKMarlVhrrHXLlN+E5XQQoverj4GICa14fa/r3\nlwzKeGrdsm9MA12WJv2dIFu/iozP284oGeMR1DECgYAmnpRQAtXDXHUiVREmgn3/\nslabkp7qmVVZ9QlamkHwh+jtscA43eYc1BKKyGvJ2Po38zH82vEcWhFbOvH1aHRr\nMvH8Fonl2CbHXkoI8HjYr9kuZJONf4BZvL2ujL5yk9jI5pIkbNep3OmIxrWT0MfB\nzRwl0cJcUjGHx+dVqBw92g==\n-----END PRIVATE KEY-----\n",
	  clientEmail: "firebase-adminsdk-tzd20@novedades-68953.iam.gserviceaccount.com",
	
	}),
	storageBucket: "novedades-68953.appspot.com",
  });
  
  export const firebaseAdmin = admin;
 