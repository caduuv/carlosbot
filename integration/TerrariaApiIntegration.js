const { getLanguage } = require('../utils/CommandsUtils');
const { prepareStringLike, translate } = require("../utils/StringUtils");
const buscaItemPorNomeFields = "itemid%2C%20name%2C%20hardmode%2C%20type%2C%20listcat%2C%20tag%2C%20damage%2C%20damagetype%2C%20defense%2C%20knockback%2C%20critical%2C%20velocity";
const buscaRecipePorItemIdFields = "resulttext%2C%20amount%2C%20version%2C%20station%2C%20ingredients%2C%20ings%2C%20args"

const API_ENDPOINT = `https://terraria.wiki.gg/api.php`


async function getRequestItemParams(item, language) {
    let itemFromAnotherLanguage;
    let searchItem = item;

    if (language !== "en") {
        const params = `?action=cargoquery&format=json&limit=1&tables=Items&fields=${buscaItemPorNomeFields}&where=image%20like%20%27%25sprite%20do%20item${item}%27&callback=&utf8=1`;
        itemFromAnotherLanguage = await consultaApi(`https://terraria.wiki.gg/${getLanguage()}/api.php`, (param) => params, item)

        if (!itemFromAnotherLanguage) {

            const translatedItem = await translate(
                item.replace(/%25/g, "").replace(/%20/g, " ")
                , { to: "en", from: "pt" });
            

            itemSegundaInstancia = await consultaApi(API_ENDPOINT, getRequestItemParams, prepareStringLike(translatedItem, -3), "en")
            
            if (itemSegundaInstancia) {
                searchItem = itemSegundaInstancia.name;
            }
        }

    }

    return `?action=cargoquery&format=json&limit=1&tables=Items&fields=${buscaItemPorNomeFields}&where=name%20like%20'${itemFromAnotherLanguage && itemFromAnotherLanguage.name ? itemFromAnotherLanguage.name.replace(/ /, "%20") : searchItem}'&callback=&utf8=1`
}

function getRequestRecipeParams(itemId) {

    return `?action=cargoquery&format=json&limit=1&tables=Recipes&fields=${buscaRecipePorItemIdFields}&where=resultid%20%3D%20${itemId}&callback=&utf8=1`
}

function getRequestRecipesByItemParams(itemName) {
    
    return `?action=cargoquery&format=json&limit=500&tables=Recipes&fields=result%2C%20ings&where=ings%20like%20'%25%C2%A6${itemName}%C2%A6%25'&callback=&utf8=1`
}

async function consultaApi(endpoint, getRequestParams, arg, language = getLanguage()) {

    const response = await fetch(endpoint + await getRequestParams(arg, language));

    const text = await (await response.text()).replace("/**/(", "").slice(0, -1);

    const res = JSON.parse(text).cargoquery;

    return res ? res.length > 0 ? res.length === 1 ?  res[0].title : res.map((e) => e.title) : undefined : undefined;
}


module.exports = {

    buscaItemPorNome: async (item) => {

        return await consultaApi(API_ENDPOINT, await getRequestItemParams, item);

    },

    buscaRecipePorItem: async (itemId) => {

        return await consultaApi(API_ENDPOINT, await getRequestRecipeParams, itemId);

    },

    buscaRecipesPossiveisPorItem: async (itemName) => {

        return await consultaApi(API_ENDPOINT, await getRequestRecipesByItemParams, itemName);

    },

}