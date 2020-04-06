const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();

admin.initializeApp();
const firebaseConfig = {
    apiKey: "AIzaSyDAjSXVR2psXFf7IReW1ysagImI-6bfddU",
    authDomain: "rxsys-c2f7a.firebaseapp.com",
    databaseURL: "https://rxsys-c2f7a.firebaseio.com",
    projectId: "rxsys-c2f7a",
    storageBucket: "rxsys-c2f7a.appspot.com",
    messagingSenderId: "517239854759",
    appId: "1:517239854759:web:4e0a6445a0db25586bed82",
    measurementId: "G-EXYD1VMNBB"
};


const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// function to get all the pharmacies in phamacy collection from database
app.get('/pharmacy', (req, res) => {
    db
        .collection('pharmacy')
        .get()
        .then((data) => {
            let pharmacies = [];
            data.forEach((doc) => {
                pharmacies.push({
                    pharmacyID: doc.id,
                    address_line: doc.data().address_line,
                    phone: doc.data().cell_phone,
                    city: doc.data().city,
                    country: doc.data().country,
                    createdBy: doc.data().createdBy,
                    createdOn: doc.data().createdOn,
                    name: doc.data().name,
                    postal_code: doc.data().postal_code,
                });
            });
            return res.json(pharmacies);
        })
        .catch((err) => console.error(err));
})

// exports.getPharmacies = functions.https.onRequest((req, res) => {

// });

// function to get all the patients in patients collection from database
app.get('/patients', (req, res) => {
    db
        .collection('patients')
        .get()
        .then((data) => {
            let patients = [];
            data.forEach((doc) => {
                patients.push({
                    patientID: doc.id,
                    address_line: doc.data().address_line,
                    cell_phone: doc.data().cell_phone,
                    city: doc.data().city,
                    country: doc.data().country,
                    createdBy: doc.data().createdBy,
                    createdOn: doc.data().createdOn,
                    lastModifiedOn: doc.data().lastModifiedOn,
                    name: doc.data().name,
                    postal_code: doc.data().postal_code,
                    sex: doc.data().sex
                });
        });
        return res.json(patients);
    })
    .catch((err) => console.log(err));
})

// exports.getPatients = functions.https.onRequest((req, res) => {
    
// });

// function to get all the patients inside pharmacy collection

app.get('/getPatientsinPharmacy',(req, res) => {
    db
        .collection('pharmacy/WARaUoZfeimCIsk4FtPQ/patients')
        .orderBy('createdOn', 'desc')
        .get()
        .then((data) => {
            let patients = [];
            data.forEach((doc) => {
                patients.push({
                    patientID: doc.id,
                    address_line: doc.data().address_line,
                    cell_phone: doc.data().cell_phone,
                    city: doc.data().city,
                    country: doc.data().country,
                    createdBy: doc.data().createdBy,
                    createdOn: doc.data().createdOn,
                    lastModifiedOn: doc.data().lastModifiedOn,
                    name: doc.data().name,
                    postal_code: doc.data().postal_code,
                    sex: doc.data().sex
                })
        });
        return res.json(patients);
    })
    .catch((err) => console.log(err));
});

// function to input new pharmacy into database
app.post('/pharmacy',(req, res) => {
    const newPharmacy = {
        address_line: req.body.address_line,
        city: req.body.city,
        country: req.body.country,
        createdBy: req.body.createdBy,
        createdOn: new Date(). toISOString(),
        postal_code: req.body.postal_code,
        name: req.body.name
    };

    db
        .collection('pharmacy')
        .add(newPharmacy)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully`}); 
        })
        .catch(err => {
            res.status(500).json({ error: `something went wrong`});
            console.error(err);
        })
})

// function to input new patient into database
app.post('/patients',(req, res) => {
    if (req.method !== 'POST') {
        return res.status(400).json({ error: 'Wrong method. Should be POST method'});
    }
    const newPatient = {
        address_line: req.body.address_line,
        city: req.body.city,
        country: req.body.country,
        createdBy: req.body.createdBy,
        createdOn: new Date(). toISOString(),
        lastModifiedOn: new Date(). toISOString(),
        postal_code: req.body.postal_code,
        name: req.body.name,
        sex: req.body.sex,
        cell_phone: req.body.cell_phone,
        
    };

    db
        .collection('patients')
        .add(newPatient)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully`}); 
        })
        .catch(err => {
            res.status(500).json({ error: `something went wrong`});
            console.error(err);
        })
})

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

const isEmail = (email) => {
    const regEx = 	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(email.match(regEx)) return true;
    else return false;
}

// Signup route for pharmacy
app.post('/signup', (req, res) => {
    const newPharmacy = {
        email: req.body.email,
        password: req.body.password,
        //confirmPassword: req.body.confirmPassword,
        name: req.body.name
    };

    // create an errors object to validate then proceed if there no errors
    let errors = {};

    if(isEmpty(newPharmacy.email)) {
        errors.email = 'Email should not be empty'
    } else if (!isEmail(newPharmacy.email)){
        errors.email = 'Must be a valid email'
    }

    if(isEmpty(newPharmacy.password)) {
        errors.password = 'Password should not be empty'
    }

    if(isEmpty(newPharmacy.name)) {
        errors.name = 'Name should not be empty'
    }

    if(Object.keys(errors).length > 0) {
        return res.status(400).json(errors);  
    } 

    // Validate data
    let token, pharmacyID;
    db.doc(`/pharmacy/${newPharmacy.name}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({name: 'this name is already taken'});
            } else {
                return firebase
                        .auth()
                        .createUserWithEmailAndPassword(newPharmacy.email, newPharmacy.password)
            }
        })
        .then((data) => {
            // pass uid of data retrieve into pharmacyID
            pharmacyID = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const pharmacyCredentials = {
                //address_line: newPharmacy.address_line,
                //city: newPharmacy.city,
                //country: newPharmacy.country,
                //createdBy: newPharmacy.createdBy,
                createdOn: new Date(). toISOString(),
                //postal_code: newPharmacy.postal_code,
                name: newPharmacy.name,
                pharmacyID: pharmacyID
            };
            db.doc(`/pharmacy/${newPharmacy.name}`).set(pharmacyCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if(err.code === "auth/email-already-in-use") {
                return res.status(400).json({ email: 'email already in used' })
            } else {
                return res.status(500).json({ error: err.code});
            }
        });
});

// Login route for pharmacy
app.post('/login', (req, res) => {
    const pharmacy = {
        email: req.body.email,
        password: req.body.password
    }

    let errors = {};

    if(isEmpty(pharmacy.email)) {
        errors.email = 'Email should not be empty';
    }

    if(isEmpty(pharmacy.password)) {
        errors.password = 'Password should not be empty';
    }

    if(Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    firebase.auth()
        .signInWithEmailAndPassword(pharmacy.email, pharmacy.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({token});
        })
        .catch((err) => {
            console.error(err);
            if(err.code === "auth/wrong-password") {
                return res.status(403).json({general: "Wrong password"});
            }
            return res.status(500).json({error: err.code});
        })  
})

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);