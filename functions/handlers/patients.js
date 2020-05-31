const { db } = require('../util/admin');

const { reducePatientInfo } = require('../util/validators');

exports.getAllPatients = (req, res) => {
    db
        .collection('patients')
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
                });
        });
        return res.json(patients);
    })
    .catch((err) => console.log(err));
}

exports.getPatient = (req, res) => {
    let patientData = {};
    db.doc(`/patients/${req.params.patientId}`).get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        patientData = doc.data();
        patientData.patientId = doc.id;
        return db.collection('medications').where('patientId', '==', req.params.patientId).get();
    })
    .then(data => {
        patientData.medications = [];
        data.forEach(doc => {
            patientData.medications.push(doc.data())
        });
        return res.json(patientData);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.code });
    });
};

exports.getPatientsinPharmacy = (req, res) => {
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
}

exports.createPatient = (req, res) => {
    
    const newPatient = {
        address_line: req.body.address_line,
        city: req.body.city,
        country: req.body.country,
        createdBy: req.user.name,
        createdOn: new Date(). toISOString(),
        lastModifiedOn: new Date(). toISOString(),
        postal_code: req.body.postal_code,
        name: req.body.name,
        sex: req.body.sex,
        cell_phone: req.body.cell_phone 
    };
    //////
    // let token, pharmacyId;
    // db.doc(`/pharmacies/${newPharmacy.name}`).get()
    //     .then(doc => {
    //         if (doc.exists) {
    //             return res.status(400).json({error: 'this name is already taken'});
    //         } else {
    //             return firebase
    //                     .auth()
    //                     .createUserWithEmailAndPassword(newPharmacy.email, newPharmacy.password)
    //         }
    //     })
    db.doc(`/patients/${newPatient.cell_phone}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.status(400).json({error: 'this phone number is already taken'});
            } else {
                return db.doc(`/patients/${newPatient.cell_phone}`).set(newPatient)
            }
        })
    ////
    //db.collection('patients')
    //db.doc(`/pharmacies/${newPharmacy.name}`).set(pharmacyCredentials);
    //db.doc(`/patients/${newPatient.cell_phone}`).set(newPatient)
        // .where('cell_phone', '==', req.body.cell_phone)
        // .get()
        // .then(data => {
        //     console.log('=================Data from collection with where =================',data.docs[0].data().cell_phone);
        //     if(data.docs[0].data().cell_phone === req.body.cell_phone) {
        //         console.log('++++++++++++inside return same phone number++++++++++++++++');
        //         return res.json({error: 'this phone number is already taken'});
        //     } else {
        //         console.log('===============inside create new patient=============')
        //         //return db.collection('patients').add(newPatient)
        //         return data.query.firestore.doc(newPatient);
        //     }}
        // )
        
        // db.collection('patients').add(newPatient)
        .then(doc => {
            res.status(200).json({
                //message: `doc ${doc.id} created sucessful`,
                //patientId: `${doc.uid}`,
                ...newPatient
            });
        })
        .catch((err) => {
            res.status(500).json({ error: `something went wrong` });
            console.error(err);
        });
     

    //////////
    // db.collection('patients')
    //     .add(newPatient)
    //     .then((doc) => {
    //         //res.json({ message: `document ${doc.id} created successfully`}); 
    //         res.json({
    //             patientId: `${doc.id}`,
    //             ...newPatient
    //         }); 
    //         console.log('Info about doc#####################: ',doc.id);
    //         let id = doc.id;
    //         doc.update({ patientId: id});
    //     })
    //     .catch((err) => {
    //         res.status(500).json({ error: `something went wrong`});
    //         console.error(err);
    //     });    
}

exports.findPatient = (req, res) => {
    //const patientRef = db.collection('patients');
    const patient = {
        //name: req.body.name,
        //sex:  req.body.sex,
        cell_phone: req.body.cell_phone,
        //createdBy: req.body.createdBy
    }
    db.collection('patients')
        .where('cell_phone', '==', req.body.cell_phone)
        //.where('name', '==', req.body.name)
        //.where('sex', '==', req.body.sex)
        .get()
        .then(data => {
        let found = [];
        data.forEach(doc => {
            found.push({
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
        return res.json(found);
    })
    .catch(err => console.log(err));
}

exports.updatePatientInfo = (req, res) => {
    let patientInfo = reducePatientInfo(req.body);
    let docInfo, newData, patientId, createdBy, createdOn, lastModifiedOn;
    db.doc(`/patients/${req.params.patientId}`)
    .get()
    .then(doc => {
        console.log('document data:', doc.data());
        //console.log('console reach here $$$$$$$$$$$$$$$$');
        if(doc.exists) {
            patientId = doc.data().cell_phone;
            createdBy = doc.data().createdBy;
            createdOn = doc.data().createdOn;
            lastModifiedOn = new Date().toISOString();
            docInfo = {patientId, createdBy, createdOn, lastModifiedOn};
            newData = {...docInfo, ...patientInfo};
            
            return db.doc(`/patients/${req.params.patientId}`).update(newData);
        }
    })

    
    .then(() => {
        return res.json( newData );
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: err.code});
    });
}

exports.deletePatient = (req, res) => {
    const document = db.doc(`/patients/${req.params.patientId}`);
    document.get()
    .then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ error: 'patient not found' })
        }
        if (doc.data().createdBy !== req.user.name) {
            return res.status(403).json({ error: 'Unauthorized'});
        } else {
            return document.delete();
        }
    })
    .then(() => {
        res.json ({ message: ' Patient delete successfully'})
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}


