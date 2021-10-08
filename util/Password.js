exports.checkValidatePassword = (password) => {
    const regexValidate =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const passwordIsValid = regexValidate.test(password);
    return passwordIsValid
}
