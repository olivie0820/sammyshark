const { generateDependencyReport, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		//	list voice dependencies
		console.log(generateDependencyReport());

		//	destroy exiting voice connections
		client.guilds.cache.forEach(guild => {
			if (getVoiceConnection(guild.id)) getVoiceConnection(guild.id).destroy();
		});

		//	ready message
		console.log(`${client.user.tag} is logged in and ready to swim!`);
	},
};