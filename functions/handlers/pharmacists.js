const { db } = require('../util/admin');
const firebase = require('firebase');

const config = require('../util/config');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reducePharmacistDetails } = require('../util/validators');

exports.getListofPharmacists = (req, res) => {
    db
        .collection('pharmacists')
        //.orderBy('createdOn', 'desc')
        .get()
        .then((data) => {

            let pharmacists = [];
            data.forEach((doc) => {
                pharmacists.push({
                    name: doc.data().name,
                    pharmacyId: doc.data().pharmacyId,
                    email: doc.data().email,
                    location: doc.data().location,
                    address_line: doc.data().address_line,
                    city: doc.data().city,
                    country: doc.data().country,
                    phone: doc.data().cell_phone,
                    isCorporate: doc.data().isCorporate,
                    createdOn: doc.data().createdOn,
                    postal_code: doc.data().postal_code,
                });
            });
            return res.json(pharmacists);
        })
        .catch((err) => console.error(err));
}

// exports.createPharmacy = (req, res) => {
//     const newPharmacy = {
//         address_line: req.body.address_line,
//         city: req.body.city,
//         country: req.body.country,
//         createdBy: req.body.createdBy,
//         createdOn: new Date(). toISOString(),
//         postal_code: req.body.postal_code,
//         name: req.body.name
//     };
//     db.collection('pharmacies')
//         .add(newPharmacy)
//         .then((doc) => {
//             res.json({ message: `document ${doc.id} created successfully`}); 
//         })
//         .catch((err) => {
//             res.status(500).json({ error: `something went wrong`});
//             console.error(err);
//         });
// }

// Signup route
exports.signup = (req, res) => {
    const toBoolean = (input) => {
        if(input==='yes' || input==='y' || input==='true' || input==='t' || input === true) {
            return true;
        } else return false;
    }
    
    let input = toBoolean(req.body.isCorporate);
    const newPharmacist = {
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        name: req.body.name,
        isCorporate: input
    };

    const { valid, errors } = validateSignupData(newPharmacist);
    if(!valid) return res.status(400).json(errors);

    // Validate data
    let token, pharmacistId;
    db.doc(`/pharmacists/${newPharmacist.name}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({error: 'this name is already taken'});
            } else {
                return firebase
                        .auth()
                        .createUserWithEmailAndPassword(newPharmacist.email, newPharmacist.password)
            }
        })
        .then((data) => {
            pharmacistId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const pharmacistCredentials = {
                email:req.body.email,
                createdOn: new Date(). toISOString(),
                name: newPharmacist.name,
                pharmacistId: pharmacistId,
                isCorporate: newPharmacist.isCorporate
            };
            db.doc(`/pharmacists/${newPharmacist.name}`).set(pharmacistCredentials);
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

// Login route
exports.login = (req, res) => {
    const pharmacist = {
        email: req.body.email,
        password: req.body.password,
    }

    const { valid, errors } = validateLoginData(pharmacist);
    if(!valid) return res.status(400).json(errors);

    firebase.auth()
        .signInWithEmailAndPassword(pharmacist.email, pharmacist.password)
        .then((data) => {
            console.log('######',data);
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

// Add pharmacist details
exports.addPharmacistDetails = (req, res) => {
    let pharmacistDetails = reducePharmacistDetails(req.body);
    let pharmacistId;
    db.doc(`/pharmacists/${req.params.pharmacist}`)
    .get().then(doc => {
        if(doc.exists) {
            pharmacistId = doc.data().pharmacistId;
            console.log('document data:', doc.data());
            return db.doc(`/pharmacists/${req.params.pharmacist}`).update(pharmacistDetails)
        }
    })
    .then(() => {
        return res.json({
            pharmacist: `${req.params.pharmacist}`,
            pharmacistId:`${pharmacistId}`,
            ...pharmacistDetails
        }); 
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: err.code});
    });
}

// Change password
exports.changePassword = (req, res) => {
    let password = req.body.currentPassword;
    
    const validatePassword = (password) => {
        if (password.length < 6) {
            return res.status(400).json({ error:'Weak password. Password should have at least 6 characters'});
        }
        else 
            return password;
    }
    let email = req.user.email;
    let newPassword = validatePassword(req.body.newPassword);

    firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((data) => {

            return data.user.updatePassword(newPassword);
        })
        .then(() => {

            return res.json({message: "password updated."});

        }).catch(function(err){
            console.log(err);
        });
}

// Send an email to reset password
exports.resetPassword = (req, res) => {
     
    let email = req.body.email;
    firebase.auth()
        .sendPasswordResetEmail(email).then(()=>{
            return res.json({message:"code sent"});
        })
        .catch((error) => {
            console.log(error);
        })
}

// Signout 
exports.signOut = (req, res) => {
    firebase.auth()
        .signOut()
        .then(() => {
            return res.json({message: "Signout successfully"});
        })
        .catch((error) => {
            console.log(error);
        })
}



