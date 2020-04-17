const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
};

const isEmail = (email) => {
    const regEx =   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(email.match(regEx)) return true;
    else return false;
};

exports.validateSignupData = (data) => {
    // create an errors object to validate then proceed if there no errors
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = 'Email should not be empty'
    } else if (!isEmail(data.email)){
        errors.email = 'Must be a valid email'
    }

    if(isEmpty(data.password)) {
        errors.password = 'Password should not be empty'
    }

    if(isEmpty(data.name)) {
        errors.name = 'Name should not be empty'
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = 'Email should not be empty';
    }

    if(isEmpty(data.password)) {
        errors.password = 'Password should not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}

exports.reducePharmacyDetails = (data) => {
    let pharmacyDetails = {};

    if(!isEmpty(data.address_line.trim())) pharmacyDetails.address_line = data.address_line;
    if(!isEmpty(data.city.trim())) pharmacyDetails.city = data.city;
    if(!isEmpty(data.country.trim())) pharmacyDetails.country = data.country;
    if(!isEmpty(data.postal_code.trim())) pharmacyDetails.postal_code = data.postal_code;
    return pharmacyDetails;
};

exports.reducePatientInfo = (data) => {
    let patientInfo = {};

    if(!isEmpty(data.address_line.trim())) patientInfo.address_line = data.address_line;
    if(!isEmpty(data.city.trim())) patientInfo.city = data.city;
    if(!isEmpty(data.cell_phone.trim())) patientInfo.cell_phone = data.cell_phone;
    if(!isEmpty(data.postal_code.trim())) patientInfo.postal_code = data.postal_code;
    if(!isEmpty(data.name.trim())) patientInfo.name = data.name;

    return patientInfo;
};