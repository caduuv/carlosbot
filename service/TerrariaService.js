const puppeteer = require('puppeteer');
const { buscaItemPorNome, buscaRecipePorItem, buscaRecipesPossiveisPorItem } = require('../integration/TerrariaApiIntegration');
const { capitalizeFirstLetter, prepareStringLike, translate, deleteAfterChar } = require("../utils/StringUtils");
const WIKI_URL = "https://terraria.fandom.com/wiki/";



async function buscaInformacoesAdicionaisItem(itemName) {

    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(WIKI_URL + itemName.replace(/ /g, "_"), { waitUntil: 'networkidle2' });

    let informacoes = await page.evaluate(() => {

        let description;
        let image;

        try {
            description = Array.from(document.querySelectorAll(".mw-parser-output > p")).map((e) => e.innerText).join(". ");
        }
        catch (err) {
            description = undefined;
        }

        try {
            image = document.querySelector(".section.images img").src;
        }
        catch (err) {
            image = undefined;
        }


        return {
            description,
            image
        };

    });

    await browser.close();

    return informacoes;

}

async function prepareType(type) {

    if (!type) {
        return;
    }

    const res = [];


    if (type.includes("^")) {

        type.split("^").forEach(element => {
            res.push(capitalizeFirstLetter(element));
        });

        return await translate(res.join("; "));

    }

    return await translate(capitalizeFirstLetter(type));
}

function prepareIngs(ings, focusIngrediente) {
    return ings
        .slice(1)
        .split("¦")
        .map((e, i, arr) => {

            const specIng = focusIngrediente === e ? "***" : "";

            if (i % 2 === 0) {
                return `${specIng}${e} (*${arr[i + 1]}*)${specIng}`
            }
            return "\n";

        })
        .join("");
}

const buscaItemPorNomeService = async (item, adicionais = true) => {

    let itemBusca = await buscaItemPorNome(item.replace(/ /g, "%20"));

    if (!itemBusca) {
        itemBusca = await buscaItemPorNome(prepareStringLike(item, -3));
    }

    if (!itemBusca) {
        return undefined;
    } else if (!adicionais) {
        return itemBusca;
    }

    if (adicionais) {
        const informacoesAdiconais = itemBusca.name ? await buscaInformacoesAdicionaisItem(itemBusca.name) : undefined;

        const recipe = await buscaRecipePorItem(itemBusca.itemid);

        informacoesAdiconais.description = await translate(informacoesAdiconais.description);
        itemBusca.type = await prepareType(itemBusca.type);
        if (itemBusca.knockback) {
            itemBusca.knockback = deleteAfterChar(itemBusca.knockback, "&lt");
        }

        if (recipe) {
            recipe.ings = prepareIngs(recipe.ings);
        }

        return {
            ...itemBusca,
            recipe: recipe ? recipe : undefined,
            ...informacoesAdiconais
        }

    }
}

module.exports = {
    buscaItemPorNome: buscaItemPorNomeService,
    buscaRecipesPorItem: async (item) => {

        const itemBusca = await buscaItemPorNome(item, false);


        if (!itemBusca) {
            return undefined;
        }

        let recipes = await buscaRecipesPossiveisPorItem(itemBusca.name);

        const originalLength = recipes.length;

        recipes = recipes.map((e) => {

            return {
                ...e,
                ings: prepareIngs(e.ings, itemBusca.name)

            };
        }).filter((e, i) => i < 9)
        

        return {
            item: itemBusca.name,
            recipes,
            numberOfRecipes: originalLength
        };


    }

}