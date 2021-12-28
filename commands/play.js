const { SlashCommandBuilder } = require('@discordjs/builders');

const ytdl = require('ytdl-core');
const {
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	getVoiceConnection,
	NoSubscriberBehavior,
	VoiceConnectionStatus,
	entersState,
} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('request a song for sammy to sing, and resume playback if paused')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('optional url of youtube audio to add to queue'))
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('the voice channel to play in (defaults to user\'s channel, then sammy\'s channel)')),

	async execute(interaction) {
		if (!interaction.inGuild) return interaction.reply ({ content: 'sorry, this command only works in a server', ephemeral: true });
		await interaction.deferReply ({ ephemeral: true });
		let replyString = '';

		//	GET AUDIO
		//	url provided
		if (interaction.options.getString('url')) {
			//	valid url
			if (ytdl.validateURL (interaction.options.getString('url'))) {
				const info = await ytdl.getInfo(interaction.options.getString('url'));
				interaction.guild.queue.push({ link: interaction.options.getString('url'), info: info });
				if (interaction.guild.queue.length > 1) replyString = `Added ${info.videoDetails.title} to the queue`;
			//	invalid url
			} else {
				replyString = 'Sorry, I couldn\'t find anything at that url';
			}
		}

		//	GET CHANNEL
		let channel;
		//	channel specified
		if (interaction.options.getChannel('channel') && interaction.options.getChannel('channel').type == 'GUILD_VOICE') {
			channel = interaction.options.getChannel('channel');
		//	user's channel
		} else if (interaction.member.voice.channel) {
			channel = interaction.member.voice.channel;
		}

		//	GET CONNECTION
		//	default to current (may be empty)
		let connection = getVoiceConnection(interaction.guild.id);

		//	channel specified and connection exists in a different channel
		if (channel && connection && connection.joinConfig.channelId != channel.id) {
			//	switch connection channel (connection already initialized)
			if (replyString) replyString += '\n';
			replyString += `switching over to ${channel.toString()}`;
			connection = await joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

		//	channel specified and no connection exists
		} else if (channel && (!connection || connection.joinConfig.channelId != channel.id)) {
			if (replyString) replyString += '\n';
			replyString += `connecting to ${channel.toString()}`;

			//	CREATE NEW CONNECTION
			connection = await joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

			//	CONNECTION LISTENERS
			connection.on(VoiceConnectionStatus.Disconnected, async () => {
				try {
					await Promise.race([
						entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
						entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
					]);
				} catch (err) {
					connection.destroy();
				}
			});

			connection.on('stateChange', (oldState, newState) => {
				console.log(`connection in ${channel.guild.name} transitioned from ${oldState.status} to ${newState.status}`);
			});

			//	CREATE NEW PLAYER
			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause,
				},
			});

			//	PLAYER LISTENER
			player.on('stateChange', (oldState, newState) => {
				console.log(`player in ${interaction.guild.name} transitioned from ${oldState.status} to ${newState.status}`);

				//	playing --> idle
				if (oldState.status == 'playing' && newState.status == 'idle') {
					interaction.guild.queue.shift();
					if (interaction.guild.queue.length > 0) {
						const stream = ytdl(interaction.guild.queue[0].link, { filter: 'audioonly' });
						const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
						player.play(resource);
					}
				}
			});

			//	CONNECT CONNECTION AND PLAYER
			await connection.subscribe (player);
			connection.player = player;
		}

		//	RESUME PLAYBACK
		//	already playing
		if (connection.player.state.status == 'playing') {
			if (replyString) replyString += '\n';
			replyString += `currently playing ${interaction.guild.queue[0].info.videoDetails.title}`;
		//	nothing playing and something in queue
		} else if (connection.player.state.status == 'idle' && interaction.guild.queue.length > 0) {
			const stream = ytdl(interaction.guild.queue[0].link, { filter: 'audioonly' });
			const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
			connection.player.play(resource);
			if (replyString) replyString += '\n';
			replyString += `now playing ${interaction.guild.queue[0].info.videoDetails.title}`;
		//	paused
		} else if (connection.player.state.status == 'paused') {
			connection.player.unpause();
			if (replyString) replyString += '\n';
			replyString += `resuming ${interaction.guild.queue[0].info.videoDetails.title}`;
		}

		if (!replyString) replyString = 'nothing happened! try adding a song via a youtube url';
		return interaction.editReply ({ content: replyString, ephemeral: true });
	},
};