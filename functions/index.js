const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllPatients, getPatientsinPharmacy, createPatient, findPatient, updatePatientInfo } = require('./handlers/patients');
const { getAllpharmacies, createPharmacy, signup, login, addPharmacyDetails } = require('./handlers/pharmacies');
const { addMedication, getMedList } = require('./handlers/medications');


// Patients route
app.get('/patients', FBAuth, getAllPatients);
app.get('/getPatientsinPharmacy', getPatientsinPharmacy); // function to get all the patients inside pharmacy collection
app.post('/createPatient', FBAuth, createPatient);
app.put('/updatePatientInfo', FBAuth, updatePatientInfo);
app.post('/findPatient', findPatient);


// Pharmacy route
app.get('/pharmacy', getAllpharmacies);
app.post('/createPharmacy', createPharmacy);
app.post('/signup', signup);
app.post('/login', login);
app.post('/addPharmacyDetails', FBAuth, addPharmacyDetails);


// Medication route
app.post('/addMedication', FBAuth, addMedication);
app.get('/getMedList', FBAuth, getMedList);


// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);