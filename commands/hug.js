const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Booru = require('booru');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription ('give a friend a hug')
		.addMentionableOption(option =>
			option.setName('friend')
				.setDescription('the friend you want to hug')
				.setRequired(true)),

	async execute(interaction) {
		const tags = ['rating:safe', 'hug', 'animated_gif', 'multiple_girls', '-1boy', '-multiple_boys', '-furry'];

		const posts = await Booru.search('gelbooru.com', tags, { limit: 1, random: true });

		const embed = new MessageEmbed()
			.setColor ('#C63B68')
			.setDescription (`${interaction.user.toString()} has hugged ${interaction.options.getMentionable('friend')}`)
			.setFooter ('powered by gelbooru')
			.setImage (posts[0].fileUrl);

		interaction.reply({ embeds: [embed] });
	},
};