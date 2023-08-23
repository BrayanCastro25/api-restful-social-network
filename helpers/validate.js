const validator = require("validator");

const validate = (params) => {
    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name, "es-ES");

    let surname = !validator.isEmpty(params.surname) &&
        validator.isLength(params.surname, { min: 3, max: undefined }) &&
        validator.isAlpha(params.surname, "es-ES");

    let nick = !validator.isEmpty(params.nick) &&
        validator.isLength(params.nick, { min: 3, max: undefined });

    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email, { min: 3, max: undefined });

    let password = !validator.isEmpty(params.password);

    let bio = true;
    if(params.bio){
        bio = validator.isLength(params.bio, { min: undefined, max: 255 });
    }

    console.log(name, surname, nick, email, password, bio);

    if (!name || !surname || !nick || !email || !password || !bio) {
        throw new Error("No se ha superado la validación");
    } else {
        console.log("Validación superada");
    }
}

module.exports = {
    validate
}