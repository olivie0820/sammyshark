const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require ('./config.json');
const fs = require('fs');
const { Client, Collection, Intents } = require ('discord.js');

const client = new Client ({
	intents: [Intents.FLAGS.GUILDS],
	presence: {
		status: 'online',
		activities: [{
			name: 'now with / commands!',
			type: 'STREAMING',
			url: 'https://www.youtube.com/watch?v=tDTrOPqBXxI' }],
	},
});

const commands = [];
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const { clientId } = require ('./config.json');
const { guildId } = require ('./config.json');

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		//	load commands
		console.log('Started refreshing application (/) commands.');

		//	guild
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		/*
		//	global
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		*/

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

//	login
client.login (token);