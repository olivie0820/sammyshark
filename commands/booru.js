const { SlashCommandBuilder } = require('@discordjs/builders');
const Booru = require('booru');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('booru')
		.setDescription('fetches images from a booru')
		.addStringOption(option =>
			option.setName('tags')
				.setDescription('space separated list of tags')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('site')
				.setDescription('the booru site to fetch from\ndefault - gelbooru')
				.addChoice('e621', 'e621.net')
				.addChoice('e926', 'e926.net')
				.addChoice('hypnohub', 'hypnohub.net')
				.addChoice('danbooru', 'danbooru.donmai.us')
				.addChoice('konac', 'konachan.com')
				.addChoice('konan', 'konachan.net')
				.addChoice('yandere', 'yande.re')
				.addChoice('gelbooru', 'gelbooru.com')
				.addChoice('rule34', 'rule34.xxx')
				.addChoice('safebooru', 'safebooru.org')
				.addChoice('tbib', 'tbib.org')
				.addChoice('xbooru', 'xbooru.com')
				.addChoice('paheal', 'rule34.paheal.net')
				.addChoice('derpibooru', 'derpibooru.org')
				.addChoice('realbooru', 'realbooru.com'))
		.addIntegerOption(option =>
			option.setName('numposts')
				.setDescription('number of posts to fetch\ndefault - 1')),

	async execute(interaction) {
		let numposts = interaction.options.getInteger('numposts');
		if (isNaN (numposts) || numposts < 1) numposts = 1;
		else if (numposts > 9) numposts = 9;

		let site = interaction.options.getString('site');
		if (!site) site = 'gelbooru.com';

		const tags = interaction.options.getString('tags').split(' ');

		const posts = await Booru.search(site, tags, { limit: numposts, random: true });

		await interaction.reply(posts[0].fileUrl);
		if (posts.length > 1) {
			posts.shift();
			for (const post of posts) {
				await interaction.followUp(post.fileUrl);
			}
		}
	},
};