const Discord = require("discord.js");
const { buscaItemPorNome, buscaRecipesPorItem } = require("../../service/TerrariaService");
const { verificaComandos } = require("../../utils/CommandsUtils");
const { deleteAfterChar } = require("../../utils/StringUtils");

const MAX_RESULTS=8;

function montaFieldsEmbed(item) {

    const fields = [];

    if (item.damage) {
        fields.push({ name: "🥊 Dano", value: deleteAfterChar(item.damage, "&").trim(), inline: true });
    }

    if (item.damagetype) {
        fields.push({ name: "⚔ Tipo de Dano", value: deleteAfterChar(item.damagetype, "&lt").trim(), inline: true });
    }

    if (item.knockback) {
        fields.push({ name: "⏩ Recuo", value: item.knockback, inline: true });
    }

    if (item.critical) {
        fields.push({ name: "🩸 Crítico", value: item.critical, inline: true });
    }

    if (item.velocity) {
        fields.push({ name: "🍃 Velocidade", value: item.velocity, inline: true });
    }

    if (item.type) {
        fields.push({ name: "📦 Categoria(s)", value: item.type, inline: true });
    }
    if (item.recipe) {

        if (item.recipe.ings) {

            fields.push({ name: "🧪 Ingredientes", value: item.recipe.ings, inline: true });
        }

        if (item.recipe.station) {
            fields.push({ name: "🛠 Estação", value: item.recipe.station, inline: true });
        }

    }

    return fields;

}

function montaItemEmbed(client, item) {

    const fields = montaFieldsEmbed(item);

    const embed = new Discord.EmbedBuilder()
        .setTitle(item.name)
        .setURL('https://terraria.wiki.gg/wiki/' + item.name.replace(/ /g, "_"))
        .setColor("Green")
        .setFields(fields);

    let author = {
        name: "Item Encontrado"
    }
    if (item.image) {
        author.iconURL = item.image;
    }
    embed.setAuthor(author);

    if (item.description) {
        embed.setDescription(item.description);
    }

    return embed;

}

function montaRecipesEmbed(client, data) {

    if(!data){
        return;
    }

    const fields = data.recipes.map((element) => {
        return { name: "⚙⠀" + element.result, value: `${element.ings}`, inline: true }
    });

    const msgAdicional = data.recipes.length > MAX_RESULTS ? `Para ver mais as receitas, clique no emoji⠀"🔎"⠀\n(*Página **${1}** de ${Math.ceil(data.numberOfRecipes/MAX_RESULTS)}*).\n` : "";

    const embed = new Discord.EmbedBuilder()
        .setTitle("Receitas com \"" + data.item + "\"")
        .setDescription(`Aqui estão as receitas que você pode fazer com o item pesquisado. \n${msgAdicional}⠀`)
        .setURL('https://terraria.wiki.gg/wiki/' + data.item.replace(/ /g, "_"))
        .setColor("Green")
        .setFields(fields)
    return embed;

}

module.exports = {
    name: "terraria",
    aliases: ["terrariaitem", "terrariaitemsearch", "terrariaitemsearch"],

    run: async (client, message, args) => {

        if (args.length === 0) {
            message.channel.send("❌ Você precisa especificar o tipo da pesquisa!");
            return;
        }

        let type = args.shift();

        if (args.length === 0) {
            message.channel.send("❌ Você precisa colocar argumentos para a pesquisa!");
            return;
        }

        let commands = args.filter((e) => { return e.startsWith("-") });

        verificaComandos(commands);

        args = args.filter((e) => { return !e.startsWith("-") });
        let item = args.join(" ");

        let embed = new Discord.EmbedBuilder()
            .setTitle("🌳 Pesquisando item \"" + item + "\"...")
            .setColor("Green")
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setDescription("Aguarde enquanto pesquisamos o item \"" + item + "\" na Wiki do Terraria...");

        message.channel.send({ embeds: [embed] }).then(async (msg) => {

            let data = null;
            if (type === "item") {

                if (!commands.includes("-makes")) {

                    data = await buscaItemPorNome(item);

                    if (data) {
                        embed = montaItemEmbed(client, data);
                    }

                } else {
                    data = await buscaRecipesPorItem(item);
                    if (data) {
                        embed = montaRecipesEmbed(client, data);
                    }
                }


            } else {
                msg.edit("❌ Tipo de pesquisa inválido!");
                return;
            }

            if (data) {
                msg.edit({ embeds: [embed] });
                if(commands.includes("-makes") && data.recipes.length > MAX_RESULTS){
                    msg.react("🔎");
                }
            } else {
                msg.delete()
                message.reply("❌ Não foi possível encontrar o item \"" + item + "\"!")
            }

        })


    }
}
