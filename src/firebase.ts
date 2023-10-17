import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase-admin/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);

export const db = getFirestore();

export const getData = async (ref, query) => {

  console.log(ref, query)

  const snapshot = await ref.where(...query).get()

  if (snapshot.empty) {
    console.log('No matching documents.');
    return {
      results: []
    };
  }

  let results = []

  snapshot.forEach(doc => {
    results = [ ...results, doc.data() ]
  });

  return {
    results
  }
}

// const arcadeRef = db.collection('arcades');

// await arcadeRef.doc().set({
//   "name": "Las Vegas Arcade",
//   "address": {
//     "leisure": "Las Vegas Arcade",
//     "house_number": "89-91",
//     "road": "Wardour Street",
//     "suburb": "Soho",
//     "town": "Islington",
//     "city": "City of Westminster",
//     "ISO3166-2-lvl8": "GB-WSM",
//     "state_district": "Greater London",
//     "state": "England",
//     "ISO3166-2-lvl4": "GB-ENG",
//     "postcode": "W1F 0TD",
//     "country": "United Kingdom",
//     "country_code": "gb"
//   },
//   "place_id": 60052217,
//   "osm_id": 5480809514,
//   "games": [
//     85872,
//     79271
//   ]
// });

// await arcadeRef.doc().set({
//   "name": "The Four Quarters",
//   "address": {
//     "amenity": "The Four Quarters",
//     "house_number": "187",
//     "road": "Rye Lane",
//     "suburb": "Peckham",
//     "city_district": "London Borough of Southwark",
//     "ISO3166-2-lvl8": "GB-SWK",
//     "city": "London",
//     "state_district": "Greater London",
//     "state": "England",
//     "ISO3166-2-lvl4": "GB-ENG",
//     "postcode": "SE15 4TP",
//     "country": "United Kingdom",
//     "country_code": "gb"
//   },
//   "place_id": 265684983,
//   "osm_id": 828010759,
//   "games": [
//     17245
//   ]
// });

// const ref = db.collection('arcades');

// await ref.doc().set({
//   "name": "NQ64",
//   "address": {
//     "leisure": "NQ64",
//     "house_number": "25",
//     "road": "Lothian Road",
//     "neighbourhood": "Lauriston",
//     "suburb": "Tollcross",
//     "city": "City of Edinburgh",
//     "ISO3166-2-lvl6": "GB-EDH",
//     "state": "Scotland",
//     "ISO3166-2-lvl4": "GB-SCT",
//     "postcode": "EH1 2DJ",
//     "country": "United Kingdom",
//     "country_code": "gb",

//   },
//   "place_id": 42075947,
//   "osm_id": 3300377735,
//   "games": [
//     13893
//   ]
// });