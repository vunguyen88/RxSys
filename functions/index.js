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
    //mobileMedUpdate 
} = require('./handlers/medications');

const {
    mobileMedUpdate,
    getTodayMedList,
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
app.get('/patients', FBAuth, getAllPatients); // Working
app.get('/getPatientsinPharmacy', getPatientsinPharmacy); // No longer used //function to get all the patients inside pharmacy collection
app.get('/patients/:patient', FBAuth, getPatient); // Working
app.post('/patients', FBAuth, createPatient); // Checked
app.put('/patients/:patient', FBAuth, updatePatientInfo); // Working
app.get('/patients/search/:patient', findPatient); // Need fix
app.delete('/patients/:patient', FBAuth, deletePatient); //Working

// Medications routes
app.post('/patient/:patient/addMedication', FBAuth, addMedication); // no longer used
app.post('/patient/:patient/medication', FBAuth, addMed); //Working
app.get('/patient/:patient/medication', FBAuth, getPatientMedList); // Working but need update
app.get('/getMedList', FBAuth, getMedList); // get all meds in medications collection // Working
app.delete('/patient/:patient/medicationd/:medication', FBAuth, deleteMedication);
app.delete('/patients/:patient/medication'); 
// Mobile routes
app.post('/patients/:patient/medications/:medication/mobileMedUpdate', mobileMedUpdate); // send update to firebase whether patient taking med or not
app.get('/patients/:patient/getTodayMedList', getTodayMedList);
//app.get('/patient/:patientId/getPatientMedListMobile', getPatientMedListMobile);
app.get('/patientsMobile', getAllPatientsMobile); // Working

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);