let language = "pt";

function changeLanguage(lang) {
    language = lang;
}

function getLanguage() {
    return language;
}

module.exports = {
    verificaComandos: (commands) => {

        commands.includes("-en") ? changeLanguage("en") : changeLanguage("pt")

    },
    changeLanguage,
    getLanguage
}