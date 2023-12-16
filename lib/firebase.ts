import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, Firestore, DocumentReference,collection,getDocs,query, CollectionReference, DocumentData, Query, QueryConstraint,QuerySnapshot } from "firebase/firestore";
import { errorHandler } from "./helpers";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "ocean-aa872.firebaseapp.com",
    projectId: "ocean-aa872",
    storageBucket: "ocean-aa872.appspot.com",
    messagingSenderId: "592359293641",
    appId: "1:592359293641:web:d89c2409b1fda7410d4318",
    measurementId: "G-NKBKEEE3V0"
};

let app : FirebaseApp;
let firestoreDB : Firestore;

export const initializeFirebase = () : FirebaseApp => {
    try {
        app = initializeApp(firebaseConfig);
        firestoreDB = getFirestore(app);
        return app;
    } catch (error) {
        errorHandler(error, 'InitializeFirebase', 'firebase.js');
    }
};

export const uploadData = async (data : object, collectionName : string, id : string) => {
    try {
        const document : DocumentReference = doc(firestoreDB, collectionName, id);
        const result = await setDoc(document, data);
        return result;
    } catch (error) {
        errorHandler(error, 'uploadData', 'firebase.js');
    }
};

export const getData = async (collectionName : string,queryProvided : QueryConstraint) => { 
    try {
        let result : Array<object> = []
        const collectionRef : CollectionReference<DocumentData> = collection(firestoreDB, collectionName);
        const q : Query<DocumentData>  = query(collectionRef,queryProvided);
        const docSnap : QuerySnapshot<DocumentData> = await getDocs(q);

        docSnap.forEach((doc) => {
            result.push(doc.data())
        });
        return result;
    } catch (error) {
        errorHandler(error, 'getData', 'firebase.js');
    }
}

export const getFirebaseApp = () : FirebaseApp => app;
