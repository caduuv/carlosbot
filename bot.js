const Discord = require("discord.js");
const client = new Discord.Client(
    { intents: [
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMessages,
        Discord.IntentsBitField.Flags.MessageContent,
        Discord.IntentsBitField.Flags.GuildMembers,
    ] 
    });
const config = require("./config.json");
const fs = require("fs");

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync(`./commands/`);

fs.readdirSync('./commands/').forEach(local => {
    const comandos = fs.readdirSync(`./commands/${local}`).filter(arquivo => arquivo.endsWith('.js'))

    for (let file of comandos) {
        
        let feature = require(`./commands/${local}/${file}`)

        if (feature.name) {
            client.commands.set(feature.name, feature)
        }
        if (feature.aliases && Array.isArray(feature.aliases))
            feature.aliases.forEach(x => client.aliases.set(x, feature.name))
    }
});

client.on("ready", () => {
    console.log(`Bot iniciado com sucesso!`);
    client.user.setActivity(`Estou em desenvolvimento!`, { type: "STREAMING" });
})

client.on("messageCreate", async (message) => {

    let prefix = config.prefix;

    if (message.author.bot) return;
    if (message.channel.type === Discord.ChannelType.DM) return;
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    
    let cmd = args.shift().toLowerCase()
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd)
    if (!command) command = client.commands.get(client.aliases.get(cmd))

    try {
        command.run(client, message, args)
    } catch (err) {
        await message.channel.send(`❌ Ocorreu um erro ao executar este comando!`);
    }
});

client.login(config.token);
