const { SlashCommandBuilder } = require('@discordjs/builders');

//	const ytdl = require('ytdl-core');
const {
	//	AudioPlayerStatus,
	//	StreamType,
	//	createAudioPlayer,
	//	createAudioResource,
	//	joinVoiceChannel,
	getVoiceConnection,
	//	VoiceConnectionStatus,
} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('logs the status of the voice connection in the current server'),

	async execute(interaction) {
		if (!interaction.inGuild) return await interaction.reply ({ content: 'sorry, this command only works in a server', ephemeral: true });

		if (getVoiceConnection(interaction.guild.id)) {
			const connection = await getVoiceConnection(interaction.guild.id);
			await interaction.reply ({ content: `status is currently ${connection.state.status}`, ephemeral: true });
		} else {
			await interaction.reply ({ content: 'not currently connected in this server', ephemeral: true });
		}
	},
};