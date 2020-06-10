const { db } = require('../util/admin');

var moment = require('moment');
moment().format(); 

// No longer used
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
    // const toBoolean = (input) => {
    //     if(input==='yes' || input==='y' || input==='true' || input==='t') {
    //         return true;
    //     } else return false;
    // }

    //let refill = toBoolean(req.body.refill.toLowerCase());

    // let startDate = moment(req.body.startDate).format('YYYY-MM-DD'), 
    //     currentDate = moment().format('YYYY-MM-DD'), 
    //     nextMedDate = moment(startDate).add(req.body.frequency,'d').format('YYYY-MM-DD');
    // const isWeekDay = (boolean) => {
    //     if (true) {
    //         sunday = req.body.sunday;
    //         monday = req.body.monday;
    //         tuesday = req.body.tuesday;
    //         wednesday = req.body.wednesday;
    //         thursday = req.body.thursday;
    //         friday = req.body.friday;
    //         saturday = req.body.saturday;
    //     } else {
    //         sunday = false;
    //         monday = false;
    //         tuesday = false;
    //         wednesday = false;
    //         thursday = false;
    //         friday = false;
    //         saturday = false;
    //     }
    // }

    let startDate = moment(req.body.startDate).utc(), 
        currentDate = moment().format('MMMM D, YYYY'), 
        nextMedDate = moment(startDate).add(req.body.frequency,'d').format('MMMM D, YYYY');

    const newMed = {
        name: req.body.name,
        strength: req.body.strength, // ex. (500mg)
        dosage: req.body.dosage, // ex. (Two Tablets) or (5ml)
        type: req.body.type, // ex. pill, powder, liquid...
        unit: req.body.unit, // ex. g, mg, mL, %, mg/ml
        frequency: req.body.frequency, // ex. 1 for everyday, 2 for every other day, 3 for every 3 days
        sunday:req.body.sunday,
        monday:req.body.monday,
        tuesday:req.body.tuesday,
        wednesday:req.body.wednesday,
        thursday:req.body.thursday,
        friday:req.body.friday,
        saturday:req.body.saturday,
        timing: req.body.timing,  //ex. (empty stomach) or (after food)
        startDate: startDate,//: moment().utc(),
        currentDate: currentDate,//: moment().utc(),
        nextMedDate: nextMedDate,//: moment(startDate).add(frequency,'d').utc(),
        rxnumber: req.body.rxnumber,
        createdBy: req.user.name,
        prescribedBy: req.body.prescribedBy,
        patientId: req.params.patient,
        pillLeft: req.body.pillLeft,
        refill: req.body.refill, // boolean
        createdOn: moment().utc(), // Date of original creation
        lastModifiedOn: moment().utc(), // date of modified
    };

    db.doc(`/patients/${req.params.patient}`).get()
    .then(doc => {
        if(!doc.exists) {
            return res.status(404).json({ error: "Patient not found" });
        }
        return db.collection('medications').add(newMed);
    })
    .then((doc) => {
        //res.json({ message: `document ${doc.id} added successfully` });
        res.json({
            drugId:`${doc.id}`,
            ...newMed
        });
        let id = doc.id;
        doc.update({ drugId: id});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ err: 'Something wrong' });
    });
}

exports.getPatientMedList = (req, res) => {
    db
        .collection('medications')
        .where('patientId', '==', req.params.patient)
        .get()
        .then(data => {
            if (data.docs[0].data().createdBy !== req.user.name) {
                return res.status(403).json({ error: 'Unauthorized'});
            } else {
            //console.log('info from user  ',data.docs[0].data().createdBy);
            let medList = [];
            data.forEach(doc => {
                //console.log('data from doc ',doc)
                medList.push({
                    drugId: doc.id,
                    name: doc.data().name,
                    strength: req.body.strength,
                    dosage: doc.data().dosage,
                    type: doc.data().type,
                    unit: doc.data().unit,
                    frequency: doc.data().frequency,
                    timing: doc.data().timing,
                    sunday: doc.data().sunday,
                    monday: doc.data().monday,
                    tuesday: doc.data().tuesday,
                    wednesday: doc.data().wednesday,
                    thursday: doc.data().thursday,
                    friday: doc.data().friday,
                    saturday: doc.data().saturday,
                    startDate: doc.data().startDate,
                    currentDate: doc.data().currentDate,
                    nextMedDate: doc.data().nextMedDate,
                    rxnumber: doc.data().rxnumber,
                    patientId: doc.data().patientId,
                    pillLeft: doc.data().pillLeft,
                    prescribedBy: doc.data().prescribedBy,
                    refill: doc.data().refull,
                    createdBy: doc.data().createdBy,
                    createdOn: doc.data().createdOn,
                    lastModifiedOn: doc.data().lastModifiedOn,
                });
            });
            return res.json(medList);
        }
        })
        
        .catch((err) => console.log(err));
}

exports.getMedList = (req, res) => {
    db
        // .doc(`/patients/${req.headers.id}`).collection('medications')
        .collection('medications')
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

exports.deleteMeds = (req, res) => {
    //const document = db.doc(`/patients/${req.params.patient}`);
    medList = db.collection('medications').where('patientId', '==', req.params.patient)
    .get()
    .then(meds => {
        //console.log('$$$$$$$QuerySnapshot$$$$$$', meds.docs[0]);
        let batch = db.batch();
        meds.forEach(doc => {
            //console.log('@@@@@@@@@@@@@@@@@@', doc);
            batch.delete(doc)
            //console.log('####after batch delete ####');
        });
        return batch.commit();
    })
    // .then(() => {
    //     db.doc(`/patients/${req.params.patient}`).get();
    //     console.log('******************************');
    //     // res.json ({ message: ' Patient delete successfully'})
    // })
    // .then(doc =>{
    //     console.log('**********doc is********', doc);
    //     return doc.delete();
    // })
    .then(() => {
        return res.json ({ message: ' Patient delete successfully'});
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}




    