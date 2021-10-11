const { SlashCommandBuilder } = require('@discordjs/builders');

//	const ytdl = require('ytdl-core');
const {
	//	AudioPlayerStatus,
	//	StreamType,
	//	createAudioPlayer,
	//	createAudioResource,
	getVoiceConnection,
} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('tells sammy to leave her voice channel :('),

	async execute(interaction) {
		if (!interaction.inGuild) {
			await interaction.reply ({ content: 'sorry, this command only works in a server', ephemeral: true });
		} else if (!getVoiceConnection(interaction.guild.id)) {
			await interaction.reply ({ content: 'i\'m not even in voice. rude', ephemeral: true });
		} else {
			getVoiceConnection(interaction.guild.id).destroy().then(() => {
				interaction.reply ({ content: 'i\'m not even in voice. rude', ephemeral: true });
			});
		}
	},
};