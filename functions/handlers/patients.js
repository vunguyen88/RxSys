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
    
    db.collection('patients')
        .add(newPatient)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully`}); 
            let id = doc.id;
            doc.update({ patientID: id});
        })
        .catch((err) => {
            res.status(500).json({ error: `something went wrong`});
            console.error(err);
        });    
}

exports.findPatient = (req, res) => {
    //const patientRef = db.collection('patients');
    const patient = {
        name: req.body.name,
        //sex:  req.body.sex,
        cell_phone: req.body.cell_phone,
        //createdBy: req.body.createdBy
    }
    db.collection('patients')
        .where('cell_phone', '==', req.body.cell_phone)
        .where('name', '==', req.body.name)
        .where('sex', '==', req.body.sex)
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
    db.doc(`/patients/${req.headers.id}`)
        .update(patientInfo)
        .then(() => {
            return res.json({ message: 'Patient info updated successfully'});
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({error: err.code});
        });
}

exports.deletePatient = (req, res) => {
    //let id = req.headers.id;
    db.collection('patients').doc('D8pO3CbffJoX7FgGKCPk').delete()
    .then(() => {
        return res.json({ message: 'Patient info updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({error: err.code});
    });
}