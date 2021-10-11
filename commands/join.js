const { SlashCommandBuilder } = require('@discordjs/builders');

//	const ytdl = require('ytdl-core');
const {
	//	AudioPlayerStatus,
	//	StreamType,
	//	createAudioPlayer,
	//	createAudioResource,
	joinVoiceChannel,
	getVoiceConnection,
	//	VoiceConnectionStatus,
} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('invites sammy to join a voice channel')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('the voice channel to join (defaults to user\'s current channel)')),

	async execute(interaction) {
		if (!interaction.inGuild) return await interaction.reply ({ content: 'sorry, this command only works in a server', ephemeral: true });

		let channel;

		//	channel specified
		if (interaction.options.getChannel('channel') && interaction.options.getChannel('channel').type == 'GUILD_VOICE') {
			channel = interaction.options.getChannel('channel');
		//	user's channel
		} else if (interaction.member.voice.channel) {
			channel = interaction.member.voice.channel;
		//	no channel
		} else {
			return interaction.reply ('you have to provide a voice channel or be in one already!');
		}

		//	current channel
		if (getVoiceConnection(channel.guild.id) && getVoiceConnection(channel.guild.id).joinConfig.channelId == channel.id) {
			return interaction.reply ('i\'m already in that channel! silly goose');
		}

		const connection = await joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guildId,
			adapterCreator: channel.guild.voiceAdapterCreator,
		});

		connection.on('stateChange', (oldState, newState) => {
			console.log(`connection in ${channel.guild.name} transitioned from ${oldState.status} to ${newState.status}`);
		});

		await interaction.reply ({ content: 'yeet', ephemeral: true });
	},
};