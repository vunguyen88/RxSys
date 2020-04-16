const { db } = require('../util/admin');
const firebase = require('firebase');

const config = require('../util/config');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData } = require('../util/validators');

exports.getAllpharmacies = (req, res) => {
    db
        .collection('pharmacies')
        .orderBy('createdOn', 'desc')
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
}

exports.createPharmacy = (req, res) => {
    const newPharmacy = {
        address_line: req.body.address_line,
        city: req.body.city,
        country: req.body.country,
        createdBy: req.body.createdBy,
        createdOn: new Date(). toISOString(),
        postal_code: req.body.postal_code,
        name: req.body.name
    };

    db.collection('pharmacies')
        .add(newPharmacy)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully`}); 
        })
        .catch((err) => {
            res.status(500).json({ error: `something went wrong`});
            console.error(err);
        });
}

exports.signup = (req, res) => {
    const newPharmacy = {
        email: req.body.email,
        password: req.body.password,
        //confirmPassword: req.body.confirmPassword,
        name: req.body.name
    };

    const { valid, errors } = validateSignupData(newPharmacy);
    if(!valid) return res.status(400).json(errors);

    // Validate data
    let token, pharmacyID;
    db.doc(`/pharmacies/${newPharmacy.name}`).get()
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
                //postal_code: newPharmacy.postal_code,
                createdOn: new Date(). toISOString(),
                name: newPharmacy.name,
                pharmacyID: pharmacyID
            };
            db.doc(`/pharmacies/${newPharmacy.name}`).set(pharmacyCredentials);
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
}

exports.login = (req, res) => {
    const pharmacy = {
        email: req.body.email,
        password: req.body.password
    }

    const { valid, errors } = validateLoginData(pharmacy);
    if(!valid) return res.status(400).json(errors);

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
}