const translator = require('translation-google')

module.exports = {

    
    capitalizeFirstLetter(string) {
        if(typeof string !== "string"){
            return "";
        }
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    //Method to delete all string after a specific character
    deleteAfterChar(string, char) {
        return string.split(char)[0];
    },
    
    prepareStringLike(item, deadLength = -2) {

        const strings = item.split(" ");
        const newItem = "%25" + strings.map((e) => {

            return (e.length > 5 ? e.slice(0, deadLength) : e) + "%25";
    
        }).join("%20");
        return newItem;
    
    },
    
    async translate(text, options = { to: 'pt', from: 'en' }) {
        if (!text) {
            return;
        }
        const translation = await translator(text, options)
        return translation.text;
    }

    
}