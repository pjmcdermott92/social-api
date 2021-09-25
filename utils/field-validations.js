const REGEX = {
    EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
}

module.exports.validateRegistration = ({
    firstname, lastname, email, password, password2
}) => {
    let errors = {};
    if (!firstname || firstname.length < 2) errors = { ...errors, firstname: 'Please enter a valid First Name' };
    if (!lastname || lastname.length < 2) errors = { ...errors, lastname: 'Please enter a valid Last Name' };
    if (!email || !REGEX.EMAIL.test(email)) errors = { ...errors, email: 'Please enter a valid Email Address' };
    if (!password || !REGEX.PASSWORD.test(password)) errors = { ...errors, password: 'Please enter a valid Password' };
    if (password !== password2) errors = { ...errors, password2: 'Passwords do not match' };
    return errors;
}

module.exports.validateLogin = ({ email, password }) => {
    let errors = {};
    if(!email || !REGEX.EMAIL.test(email)) errors = { ...errors, email: 'Enter a valid Email Address' };
    if(!password || password.length < 1) errors = { ...errors, password: 'Enter your Password' };
    return errors;
}
