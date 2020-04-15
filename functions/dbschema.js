
// Schema Defines Pharmacy
var pharmacySchema = {
    _id: "handled by Firebase",
    name: "string name", // CVS
    address_line: "string building, street, etc.",
    city: "string value",
    country: "string value",
    postal_code: "string value",
    email: 'String',
    password: 'String'
  };
  
  var patientSchema = {
    _id: "handled by Firebase",
    createdBy: "Pharmacy _id",
    createdOn: "Timestamp - UTC", // Date of original creation
    lastModifiedOn: "Timestamp - UTC",
    name: "string name", // Joe Smith
    address_line: "string building, street, etc.",
    city: "string value",
    country: "string value",
    postal_code: "string value",
    home_phone: "string name",
    work_phone: "string name",
    birthdate: "string value",
    sex: "string value", // Male or Female
    drugs: [
      // Array of Drugs Objects for patient
      {
        createdBy: "Pharmacy _id",
        createdOn: "Timestamp - UTC", // Date of original creation
        lastModifiedOn: "Timestamp - UTC",
        dateStopped: "Timestamp - UTC or Empty/Null",
        drugID: "API _id", // 3rd party api id. This is for fast lookups when patient wants more details
        name: "string name",
        strength: "string value", // ex. (500mg)
        dosage: "string value", // ex. (Two Tablets) or (5ml)
        frequency: "string value", // ex. (Twice daily) or (Once Daily)
        timing: "string name", // ex. (MUST be taken on an empty stomach)
                               // This timing may not be needed
        prescribingPhysician: "string name", // Name of physician that prescribed the medication
      }
    ]
  }
  
  // Schema Defines a Drug for patient
  var drugSchema = {
    _id: "handled by Firebase",
    createdBy: "Pharmacy _id",
    createdOn: "Timestamp - UTC", // Date of original creation
    lastModifiedOn: "Timestamp - UTC",
    dateStopped: "Timestamp - UTC or Empty/Null",
    drugID: "API _id", // 3rd party api id. This is for fast lookups when patient wants more details
    name: "string name",
    strength: "string value", // ex. (500mg)
    dosage: "string value", // ex. (Two Tablets) or (5ml)
    frequency: "string value", // ex. (Twice daily) or (Once Daily)
    timing: "string name", // ex. (MUST be taken on an empty stomach)
                              // This timing may not be needed
    prescribingPhysician: "string name",
  };