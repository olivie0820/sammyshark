const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const ytdl = require('ytdl-core');
const {
	getVoiceConnection,
} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('display the current queue')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('optional url of youtube audio to add to queue')),

	async execute(interaction) {
		if (!interaction.inGuild) return interaction.reply ({ content: 'sorry, this command only works in a server', ephemeral: true });

		//	GET AUDIO
		if (interaction.options.getString('url') && await ytdl.validateURL (interaction.options.getString('url'))) {
			const info = await ytdl.getInfo(interaction.options.getString('url'));
			interaction.guild.queue.push({ link: interaction.options.getString('url'), info: info });
		}

		//	nothing in queue
		if (interaction.guild.queue.length == 0) {
			return interaction.reply ({ content: 'the queue is currently empty', ephemeral: true });
		}

		//	GENERATE EMBED
		const embed = new MessageEmbed()
			.setColor ('#FF0000')
			.setTitle ('Sammy\'s Setlist');

		//	FIRST SONG
		if (getVoiceConnection(interaction.guild.id)) {
			const status = getVoiceConnection(interaction.guild.id).player.state.status;
			if (status == 'playing') {
				embed.addField ('Now performing:', interaction.guild.queue[0].info.videoDetails.title, false);
			} else if (status == 'paused' || status == 'autopaused') {
				embed.addField ('Waiting to resume:', interaction.guild.queue[0].info.videoDetails.title, false);
			} else {
				embed.addField ('Waiting to begin:', interaction.guild.queue[0].info.videoDetails.title, false);
			}
		} else {
			embed.addField ('Waiting to perform:', interaction.guild.queue[0].info.videoDetails.title, false);
		}

		//	SECOND SONG
		if (interaction.guild.queue.length > 1) {
			embed.addField ('Up next:', interaction.guild.queue[1].info.videoDetails.title);
		}

		//	SONGS 3 - 10
		if (interaction.guild.queue.length > 2) {
			for (let i = 2; i < interaction.guild.queue.length; i++) {
				if (i == 10) break;
				embed.addField (`#${i + 1}:`, interaction.guild.queue[i].info.videoDetails.title, false);
			}
		}

		interaction.reply({ embeds: [embed] });
	},
};