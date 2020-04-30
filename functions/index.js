const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { 
    getAllPatients, 
    getPatientsinPharmacy, 
    createPatient, 
    findPatient, 
    updatePatientInfo, 
    deletePatient,
    getPatient
} = require('./handlers/patients');

const { 
    getAllpharmacies, 
    createPharmacy, 
    signup, 
    login, 
    addPharmacyDetails 
} = require('./handlers/pharmacies');

const { 
    addMedication,
    getMedList, 
    addMed,
    deleteMedication 
} = require('./handlers/medications');

// Patients route
app.get('/patients', FBAuth, getAllPatients);
app.get('/getPatientsinPharmacy', getPatientsinPharmacy); // function to get all the patients inside pharmacy collection
app.get('/patient/:patientId', FBAuth, getPatient);
app.post('/createPatient', FBAuth, createPatient);
app.put('/updatePatientInfo', FBAuth, updatePatientInfo);
app.post('/findPatient', findPatient);
app.delete('/patient/:patientId', FBAuth, deletePatient);

// Pharmacy route
app.get('/pharmacy', getAllpharmacies);
app.post('/createPharmacy', createPharmacy);
app.post('/signup', signup);
app.post('/login', login);
app.post('/addPharmacyDetails', FBAuth, addPharmacyDetails);
app.delete('/patient/:patientId/medication')

// Medication route
app.post('/patient/:patientId/addMedication', FBAuth, addMedication);
app.post('/patient/:patientId/medication', FBAuth, addMed);
app.get('/getMedList', FBAuth, getMedList);
app.delete('/patient/:patientId/medication/:medId', FBAuth, deleteMedication);

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);