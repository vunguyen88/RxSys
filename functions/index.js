const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

var moment = require('moment');
moment().format(); 

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
    addPharmacyDetails,
    resetPassword,
    signOut,
    changePassword 
} = require('./handlers/pharmacies');

const { 
    addMedication,
    getMedList, 
    addMed,
    getPatientMedList,
    deleteMedication,
    //mobileMedUpdate 
} = require('./handlers/medications');

const {
    mobileMedUpdate,
    getTodayMedList,
    getAllPatientsMobile,
} = require('./handlers/mobile');

// Pharmacy route
app.get('/signout', FBAuth, signOut);
app.put('/password', FBAuth, changePassword);
app.post('/pharmacists/:email', resetPassword);
app.get('/pharmacy', FBAuth, getAllpharmacies); // Working
app.post('/createPharmacy', createPharmacy);
app.post('/signup', signup); // Working
app.post('/login', login); // Working
app.put('/pharmacists/:pharmacist', FBAuth, addPharmacyDetails); // Working
app.delete('/patients/:patient/medication'); 

// Patients route
app.get('/patients', FBAuth, getAllPatients); // Working
app.get('/getPatientsinPharmacy', getPatientsinPharmacy); // No longer used //function to get all the patients inside pharmacy collection
app.get('/patients/:patient', FBAuth, getPatient); // Working
app.post('/patients', FBAuth, createPatient); // Checked
app.put('/patients/:patient', FBAuth, updatePatientInfo); // Working
app.get('/patients/search/:patient', findPatient); // Need fix
app.delete('/patients/:patient', FBAuth, deletePatient); //Working

// Medication route
app.post('/patient/:patient/addMedication', FBAuth, addMedication); // no longer used
app.post('/patient/:patient/medication', FBAuth, addMed); //Working
app.get('/patient/:patient/medication', FBAuth, getPatientMedList); // Working but need update
app.get('/getMedList', FBAuth, getMedList); // get all meds in medications collection // Working
app.delete('/patient/:patient/medicationd/:medication', FBAuth, deleteMedication);

// Mobile route
app.post('/patients/:patient/medications/:medication/mobileMedUpdate', mobileMedUpdate); // send update to firebase whether patient taking med or not
app.get('/patients/:patient/getTodayMedList', getTodayMedList);
//app.get('/patient/:patientId/getPatientMedListMobile', getPatientMedListMobile);
app.get('/patientsMobile', getAllPatientsMobile); // Working

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);