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
    getPatientMedList,
    deleteMedication 
} = require('./handlers/medications');

// Patients route
app.get('/patients', getAllPatients);
app.get('/getPatientsinPharmacy', getPatientsinPharmacy); // function to get all the patients inside pharmacy collection
app.get('/patient/:patientId', FBAuth, getPatient);
app.post('/createPatient', FBAuth, createPatient); //Checked
app.put('/patient/:patientId', FBAuth, updatePatientInfo); //Checked
app.post('/findPatient', findPatient);
app.delete('/patient/:patientId', FBAuth, deletePatient); //Checked

// Pharmacy route
app.get('/pharmacy', getAllpharmacies);
app.post('/createPharmacy', createPharmacy);
app.post('/signup', signup); //Checked
app.post('/login', login); //Checked
app.put('/pharmacy/:pharmacyName', FBAuth, addPharmacyDetails); //Checked
app.delete('/patient/:patientId/medication')

// Medication route
app.post('/patient/:patientId/addMedication', FBAuth, addMedication); // no longer used
app.post('/patient/:patientId/medication', FBAuth, addMed); //added new medication into medications collection //Checked
app.get('/patient/:patientId/medication', FBAuth, getPatientMedList); //Checked
app.get('/getMedList', FBAuth, getMedList); // get all meds in medications collection //Checked
app.delete('/patient/:patientId/medication/:medId', FBAuth, deleteMedication);

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);