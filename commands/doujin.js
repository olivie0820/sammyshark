const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const nhentai = require ('nhentai-js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('doujin')
		.setDescription('generate a preview of an nhentai doujin from numbers')
		.addIntegerOption(option =>
			option.setName('id')
				.setDescription('the numerical id of the doujin')
				.setRequired(true)),
	async execute(interaction) {
		const id = interaction.options.getInteger('id');

		if (!nhentai.exists (id.toString())) {
			return interaction.reply('sorry, no doujin exits for that code');
		}

		const doujin = await nhentai.getDoujin(id.toString());

		const embed = new MessageEmbed()
			.setColor ('#ED2553')
			.setAuthor ('nhentai.net', 'https://i.imgur.com/uLAimaY.png', 'https://nhentai.net')
			.setTitle (doujin.title)
			.setURL (doujin.link)
			.setDescription (`*${doujin.nativeTitle}*`)
			.setThumbnail (doujin.thumbnails[0])
			.setFooter (`Pages: ${doujin.details.pages} | Uploaded: ${doujin.details.uploaded}`);

		interaction.reply({ embeds: [embed] });
	},
};