const { SlashCommandBuilder } = require('@discordjs/builders');

const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	getVoiceConnection,
	NoSubscriberBehavior,
	//	VoiceConnectionStatus,
} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('request a song for sammy to sing!')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('the url of the youtube audio to play')
				.setRequired(true))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('the voice channel to play in (defaults to current channel, then user\'s channel)')),

	async execute(interaction) {
		if (!interaction.inGuild) return interaction.reply ('sorry, this command only works in a server');

		let connection;

		//	channel specified
		if (interaction.options.getChannel('channel') && interaction.options.getChannel('channel').type == 'GUILD_VOICE') {
			connection = joinVoiceChannel({
				channelId: interaction.options.getChannel('channel').id,
				guildId: interaction.guildId,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});
		}

		//	sammy's channel
		if (!connection && getVoiceConnection(interaction.guild.id)) connection = getVoiceConnection(interaction.guild.id);

		//	user's channel
		if (!connection) {
			if (interaction.member.voice.channel) {
				connection = joinVoiceChannel({
					channelId: interaction.member.voice.channel.id,
					guildId: interaction.guildId,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				});

			//	no channel
			} else {
				return interaction.reply ('you have to provide a voice channel or one of us has to be in one already!');
			}
		}

		const stream = ytdl(interaction.options.getString('url'), { filter: 'audioonly' });
		const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});

		player.play(resource);
		connection.subscribe(player);

		player.on(AudioPlayerStatus.Idle, () => {
			player.stop();
			connection.destroy;
		});
	},
};