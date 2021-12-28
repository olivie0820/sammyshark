const { generateDependencyReport, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		//	list voice dependencies
		console.log(generateDependencyReport());

		//	for each guild
		client.guilds.cache.forEach(guild => {
			//	destroy existing voice connections
			if (getVoiceConnection(guild.id)) getVoiceConnection(guild.id).destroy();

			// initialzie queue
			guild.queue = [];
			console.log (`added empty queue to ${guild.name}`);
		});

		//	ready message
		console.log(`${client.user.tag} is logged in and ready to swim!`);
	},
};