const { db } = require('../util/admin');

exports.addMedication = (req, res) => {
    const newMed = {
        name: req.body.name,
        strength: req.body.strength, // ex. (500mg)
        dosage: req.body.dosage, // ex. (Two Tablets) or (5ml)
        frequency: req.body.frequency, // ex. (Twice daily) or (Once Daily)
        timing: req.body.timing,
        createdBy: req.user.name,
        createdOn: new Date(). toISOString(), // Date of original creation
        lastModifiedOn: new Date(). toISOString(),
    }
    // Create new doc using ID created by Firebase for new medication
    // db.doc(`/patients/${req.headers.id}`).collection('medications')
    //     .add(medication)

    // Create new doc with set ID
    db
        .doc(`/patients/${req.params.patientId}`).collection('medications').doc(newMed.name)
        .set(newMed)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully`}); 
            let id = doc.id;
            doc.update({ _id: id});
        })
        .catch((err) => {
            res.status(500).json({ error: `something went wrong`});
            console.error(err);
        })
}

exports.addMed = (req, res) => {
    const newMed = {
        name: req.body.name,
        strength: req.body.strength, // ex. (500mg)
        dosage: req.body.dosage, // ex. (Two Tablets) or (5ml)
        frequency: req.body.frequency, // ex. (Twice daily) or (Once Daily)
        timing: req.body.timing,
        createdBy: req.user.name,
        patientId: req.params.patientId,
        createdOn: new Date(). toISOString(), // Date of original creation
        lastModifiedOn: new Date(). toISOString(),
    };

    db.doc(`/patients/${req.params.patientId}`).get()
    .then(doc => {
        if(!doc.exists) {
            return res.status(404).json({ error: "Patient not found" });
        }
        return db.collection('medications').add(newMed);
    })
    .then((doc) => {
        //res.json(newMed);
        //res.json({ message: `document ${doc} added successfully` });
        let id = doc.id;
        doc.update({ drugId: id});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ err: 'Something wrong' });
    });
}

exports.getMedList = (req, res) => {
    db
        .doc(`/patients/${req.headers.id}`).collection('medications')
        .orderBy('createdOn', 'desc')
        .get()
        .then((data) => {
            let medList = [];
            data.forEach((doc) => {
                medList.push({
                    name: doc.data().name,
                    createdBy: doc.data().createdBy,
                    createdOn: doc.data().createdOn,
                    lastModifiedOn: doc.data().lastModifiedOn,
                    dosage: doc.data().dosage,
                    strength: doc.data().strength,
                    timing: doc.data().timing
                });
        });
        return res.json(medList);
    })
    .catch((err) => console.log(err));
}

exports.deleteMedication = (req, res) => {
    let drugname;
    const document = db.doc(`/medications/${req.params.medId}`);
    //const document = db.doc('medications').where('patientId', '==', req.params.patientId).where('drugId', '==', req.params.medId).limit(1);
    document.get()
    .then(doc => {
        drugname = doc.data().name;
        if (!doc.exists) {
            return res.status(404).json({ error: 'drug not found' })
        }
        if (doc.data().patientId !== req.params.patientId) {
            return res.status(403).json({ error: 'drug belongs to different patient' });
        }
        if (doc.data().createdBy !== req.user.name) {
            return res.status(403).json({ error: 'Unauthorized' });
        } else {
            return document.delete();
        }
    })
    .then(() => {
        res.json ({ message: `drug ${drugname} delete successfully` })
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
    
}


    