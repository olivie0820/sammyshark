const { SlashCommandBuilder } = require('@discordjs/builders');

const {
	getVoiceConnection,
} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('tells sammy to leave her voice channel'),

	async execute(interaction) {
		if (!interaction.inGuild) {
			return interaction.reply ({ content: 'sorry, this command only works in a server', ephemeral: true });
		}

		const connection = getVoiceConnection(interaction.guild.id);

		if (!connection) {
			interaction.reply ({ content: 'i\'m not even in voice. rude', ephemeral: true });
		} else {
			await connection.player.stop();
			await connection.destroy();
			interaction.reply ({ content: 'left the vc, bye bye!', ephemeral: true });
		}
	},
};