const Discord = require("discord.js");

module.exports = {
    name: "ping",
    aliases: [],

    run: async (client, message) => {
        
        let embed = new Discord.EmbedBuilder()
        .setColor("Random")
        .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setDescription(`🏓 Olá ${message.author}, seu ping é de ${client.ws.ping}ms!`)
        .setFooter({text: `Comando requisitado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
        .setTitle("Ping")
        .setTimestamp()
        message.reply({embeds: [embed]})

    }
}