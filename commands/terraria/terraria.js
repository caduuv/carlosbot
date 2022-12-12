const Discord = require("discord.js");
const {buscaPorNome} = require("../../service/TerrariaService");

module.exports = {
    name: "terraria",
    aliases: ["terrariaitem", "terrariaitemsearch", "terrariaitemsearch"],

    run: async (client, message, args) => {

        if (args.length === 0) {
            message.channel.send("❌ Você precisa colocar o nome do item que deseja pesquisar!");
            return;
        }
        else {
            let item = args.join(" ");
            let embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`🔍 Pesquisando por "${item}"...`)
                .setTitle("🌳 Terraria Wiki")

            message.reply({ embeds: [embed] })
                .then((msg) => {

                    buscaPorNome(item)
                        .then((result) => {

                            let embed2 = new Discord.EmbedBuilder()
                                .setColor("Green")
                                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                                .setImage(result.imageURL)
                                .setTitle(`${result.name}`)
                                .setDescription(result.description)
                                .setURL(result.url)

                            msg.edit({ embeds: [embed2] })
                        })

                })
        }

    }
}
