const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');

var moment = require('moment');
moment().format(); 

const { 
    signup, 
    login, 
    addPharmacistDetails,
    changePassword, 
    resetPassword,
    signOut,
    getListofPharmacists, 
} = require('./handlers/pharmacists');

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
    addMedication,
    getMedList, 
    addMed,
    getPatientMedList,
    deleteMedication,
    deleteMeds,
    //mobileMedUpdate 
} = require('./handlers/medications');

const {
    mobileGetTodayMedList,
    mobileMedUpdate,
    mobileGetMedList,
    getAllPatientsMobile,
} = require('./handlers/mobile');


// Pharmacists routes
app.post('/signup', signup); // tested
app.post('/login', login); // tested
app.put('/pharmacists/:pharmacist', FBAuth, addPharmacistDetails); // tested
app.put('/password', FBAuth, changePassword); // tested
app.post('/password', resetPassword); // tested
app.get('/signout', FBAuth, signOut); // tested
app.get('/pharmacists', FBAuth, getListofPharmacists); // tested


// Patients routes
app.post('/patients', FBAuth, createPatient); // tested
app.get('/patients', FBAuth, getAllPatients); // tested
app.delete('/patients/:patient', FBAuth, deletePatient); // tested
app.get('/patients/:patient', FBAuth, getPatient); // Working
app.put('/patients/:patient', FBAuth, updatePatientInfo); // Working
app.get('/patients/search/:patient', findPatient); // Need fix
//app.get('/getPatientsinPharmacy', getPatientsinPharmacy); // No longer used //function to get all the patients inside pharmacy collection


// Medications routes
app.post('/patients/:patient/medications', FBAuth, addMed); // tested
app.delete('/patient/:patient/medicationd/:medication', FBAuth, deleteMedication); // tested
app.get('/patient/:patient/medications', FBAuth, getPatientMedList); // Working but need update
app.get('/getMedList', FBAuth, getMedList); // get all meds in medications collection // Working
app.delete('/patients/:patient/medicationss', deleteMeds); 
//app.post('/patient/:patient/addMedication', FBAuth, addMedication); // no longer used


// Mobile routes
app.get('/patients/:patient/medications', mobileGetMedList); // tested
app.get('/patients/:patient/medications/current', mobileGetTodayMedList); // tested
app.post('/patients/:patient/medications/:medication/mobileMedUpdate', mobileMedUpdate); // tested
//app.get('/patient/:patientId/getPatientMedListMobile', getPatientMedListMobile);
app.get('/patientsMobile', getAllPatientsMobile); // Working

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);