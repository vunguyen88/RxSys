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
    db.doc(`/patients/${req.headers.id}`).collection('medications').doc(newMed.name)
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

    