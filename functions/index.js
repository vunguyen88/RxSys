const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllPatients, getPatientsinPharmacy, createPatient, findPatient } = require('./handlers/patients');
const { getAllpharmacies, createPharmacy, signup, login } = require('./handlers/pharmacies');


// Patients route
app.get('/patients', getAllPatients);
app.get('/getPatientsinPharmacy', getPatientsinPharmacy); // function to get all the patients inside pharmacy collection
app.post('/createPatient', FBAuth, createPatient);
app.post('/findPatient', findPatient);


// Pharmacy route
app.get('/pharmacy', getAllpharmacies);
app.post('/createPharmacy', createPharmacy);
app.post('/signup', signup);
app.post('/login', login);














// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);