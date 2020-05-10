const { db } = require('../util/admin');
const firebase = require('firebase');

const config = require('../util/config');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reducePharmacyDetails } = require('../util/validators');

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
        name: req.body.name,
        isCorporate: req.body.isCorporate
    };

    const { valid, errors } = validateSignupData(newPharmacy);
    if(!valid) return res.status(400).json(errors);

    // Validate data
    let token, pharmacyId;
    db.doc(`/pharmacies/${newPharmacy.name}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({error: 'this name is already taken'});
            } else {
                return firebase
                        .auth()
                        .createUserWithEmailAndPassword(newPharmacy.email, newPharmacy.password)
            }
        })
        .then((data) => {
            // pass uid of data retrieve into pharmacyID
            //pharmacyID = data.user.uid;
            pharmacyId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const pharmacyCredentials = {
                email:req.body.email,
                createdOn: new Date(). toISOString(),
                name: newPharmacy.name,
                //pharmacyID: pharmacyID,
                pharmacyId: pharmacyId,
                isCorporate: newPharmacy.isCorporate
            };
            db.doc(`/pharmacies/${newPharmacy.name}`).set(pharmacyCredentials);
        })
        .then(() => {
            return res.status(201).json({ token });
        })
        .catch((err) => {
            console.error(err);
            if(err.code === "auth/email-already-in-use") {
                return res.status(400).json({ error: 'email already in used' })
            } else {
                return res.status(500).json({ error: err.code});
            }
        });
}

exports.login = (req, res) => {
    const pharmacy = {
        email: req.body.email,
        password: req.body.password,
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
                return res.status(403).json({error: "Wrong password"});
            }
            if(err.code === "auth/user-not-found") {
                return res.status(400).json({error: "User not found"})
            }
            return res.status(500).json({error: err.code});
        })  
}

// Add pharmacy details
exports.addPharmacyDetails = (req, res) => {
    let pharmacyDetails = reducePharmacyDetails(req.body);
    let pharmacyId;
    db.doc(`/pharmacies/${req.params.pharmacyName}`)
    .get().then(doc => {
        if(doc.exists) {
            pharmacyId = doc.data().pharmacyID;
            console.log('document data:', doc.data());
            return db.doc(`/pharmacies/${req.params.pharmacyName}`).update(pharmacyDetails)
        }
    })
    .then(() => {
        return res.json({
            pharmacyName: `${req.params.pharmacyName}`,
            pharmacyId:`${pharmacyId}`,
            ...pharmacyDetails
        }); 
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: err.code});
    });
}