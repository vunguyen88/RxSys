const { db } = require('../util/admin');

var moment = require('moment');
moment().format(); 

exports.mobileMedUpdate = (req, res) => {
    let currentDate = moment().utc();//format('YYYY-MM-DD');
    let startDate, frequency;
    // let timeUpdate = {
    //     //startDate = moment(req.body.startDate).format('YYYY-MM-DD'), 
    //     currentDate = moment().format('YYYY-MM-DD'), 
    //     nextMedDate = req.body.taken === 1 ? moment(startDate).add(req.body.frequency,'d').format('YYYY-MM-DD') : moment(startDate).add(1,'d').format('YYYY-MM-DD');
    // }
    let mobileUpdate = {
        createdOn: moment().utc(),//new Date().toUTCString(),
        //toISOString() "2020-05-20T03:22:42.245Z", 
        //toLocaleDateString() "5/19/2020",
        //toLocaleTimeString() "11:30:56 PM", 
        //toUTCString() "Wed, 20 May 2020 03:24:19 GMT", 
        //toDateString() "Tue May 19 2020",
        //toLocaleString() "5/19/2020, 11:26:30 PM", 
        //toTimeString() "23:29:19 GMT-0400 (Eastern Daylight Time)",
        taken: req.body.taken,
        missed: req.body.taken === true ? false : true
    }
    db.doc(`/medications/${req.params.medication}`)
        .get()
        .then(data => {
            frequency = data.data().frequency,
            startDate = data.data().startDate,
            pillLeft = data.data().pillLeft,
            dosage = data.data().dosage,
            //if (moment(startDate).isBefore(currentDate))
            //console.log("###############", data.data().frequency)
            db.collection(`/medications/${req.params.medication}/report`).add(mobileUpdate)
        })
        .then((data) => {
                    //console.log("data is ######################", data);
                    //res.json({ message: `medication for patient ${req.params.patientId} update successfully` });
            return db.doc(`/medications/${req.params.medication}`).update(
                {
                    currentDate: currentDate, 
                    //nextMedDate: req.body.taken === true ? moment(currentDate).add(frequency,'d').format('YYYY-MM-DD') : moment(currentDate).add(1,'d').format('YYYY-MM-DD')
                    nextMedDate: req.body.taken === true ? moment(currentDate).add(frequency,'d').utc() : moment(currentDate).add(1,'d').utc(),
                    lastModifiedOn: moment().utc(),
                    pillLeft: pillLeft - dosage,
                } 
            )
        })
        .then(()=> {
            res.json({ message: `medication for patient ${req.params.patientId} update successfully` });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
    // db.collection(`/medications/${req.params.medId}/tracking`).add(mobileUpdate)
    // //     .update({
    // //         currentDate: moment().format('YYYY-MM-DD'), 
    // //         nextMedDate: req.body.taken === 1 ? moment(currentDate).add(req.body.frequency,'d').format('YYYY-MM-DD') : moment(currentDate).add(1,'d').format('YYYY-MM-DD')
    // // })
    //     .then((data) => {
    //         console.log("data is ######################", data);
    //         //res.json({ message: `medication for patient ${req.params.patientId} update successfully` });
    //         return db.doc(`/medications/${req.params.medId}`).update(
    //             {
    //                 currentDate: currentDate, 
    //                 nextMedDate: req.body.taken === 1 ? moment(currentDate).add(req.body.frequency,'d').format('YYYY-MM-DD') : moment(currentDate).add(1,'d').format('YYYY-MM-DD')
    //             } 
    //         )
    //     })
    //     .then(()=> {
    //         res.json({ message: `medication for patient ${req.params.patientId} update successfully` });
    //     })
    //     .catch(err => {
    //         console.error(err);
    //         return res.status(500).json({ error: err.code });
    //     })
}
exports.mobileUpdateMedTracking = (req, res) => {
    let report;
    db.collection(`/medications/${req.params.medId}/tracking/`)
        .add()
}

exports.mobileGetTodayMedList = (req, res) => {
    currentDate = moment().format('MMMM D, YYYY'),//"2020-05-30";//moment().format('MMMM');
    db
        .collection('medications')
        .where('patientId', '==', req.params.patient)
        .where('nextMedDate', '==', currentDate)
        .get()
        .then(data => {
            // if (data.docs[0].data().createdBy !== req.user.name) {
            //     return res.status(403).json({ error: 'Unauthorized'});
            // } else {
            //console.log('info from user  ',data.docs[0].data().createdBy);
            let medList = [];
            data.forEach(doc => {
                //console.log('data from doc ',doc)
                medList.push({
                    drugId: doc.id,
                    name: doc.data().name,
                    createdBy: doc.data().createdBy,
                    createdOn: doc.data().createdOn,
                    lastModifiedOn: doc.data().lastModifiedOn,
                    dosage: doc.data().dosage,
                    strength: doc.data().strength,
                    timing: doc.data().timing,
                    unit: doc.data().unit,
                    frequency: doc.data().frequency, // ex. (everyday) or (day interval) (specific day)
                    sunday:doc.data().sunday,
                    monday:doc.data().monday,
                    tuesday:doc.data().tuesday,
                    wednesday:doc.data().wednesday,
                    thursday:doc.data().thursday,
                    friday:doc.data().friday,
                    saturday:doc.data().saturday,            
                    startDate: doc.data().startDate,//: moment().format('M,D,YYYY'),
                    currentDate: currentDate,//: moment(),
                    nextMedDate: doc.data().nextMedDate,//: startDate.moment().add(1,'D'),
                    rxnumber: doc.data().rxnumber,
                    prescribedBy: doc.data().prescribedBy,
                    patientId: req.params.patientId,
                    pillLeft: doc.data().pillLeft,
                    refill: doc.data().refill,
                });
            });
            return res.json(medList);
        }
        //}
        )
        
        .catch((err) => console.log(err));
}

exports.mobileGetMedList = (req, res) => {
    db
        .collection('medications')
        .where('patientId', '==', req.params.patient)
        .get()
        .then(data => {
            let medList = [];
            data.forEach(doc => {
                //console.log('data from doc ',doc)
                medList.push({
                    drugId: doc.id,
                    name: doc.data().name,
                    strength: doc.data().strength,
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
                    startDate: moment(doc.data().startDate).utc(), //moment(doc.data().startDate).format('MM-DD-YYYY'),
                    currentDate: moment().format('MMMM D, YYYY'),//moment(doc.data().currentDate).utc(),
                    nextMedDate: moment(doc.data().nextMedDate).utc(),
                    rxnumber: doc.data().rxnumber,
                    patientId: doc.data().patientId,
                    pillLeft: doc.data().pillLeft,
                    prescribedBy: doc.data().prescribedBy,
                    refill: doc.data().refull,
                    createdBy: doc.data().createdBy,
                    createdOn: moment(doc.data().createdOn).utc(),
                    lastModifiedOn: moment(doc.data().lastModifiedOn).utc(),
                });
            });
            return res.json(medList);
        }) 
        .catch((err) => console.log(err));
}

exports.getPatientMedListMobile = (req, res) => {
    db
    .collection('medications')
    .where('patientId', '==', req.params.patientId)
    .get()
    .then(data => {
        // if (data.docs[0].data().createdBy !== req.user.name) {
        //     return res.status(403).json({ error: 'Unauthorized'});
        // } else {
        //console.log('info from user  ',data.docs[0].data().createdBy);
        let medList = [];
        data.forEach(doc => {
            //console.log('data from doc ',doc)
            medList.push({
                drugId: doc.id,
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
    //}
    })
    
    .catch((err) => console.log(err));
}

exports.getAllPatientsMobile = (req, res) => {
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