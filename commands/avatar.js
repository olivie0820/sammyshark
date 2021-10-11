const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('fetch and display a user\'s avatar')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('the user to fetch from (defaults to caller)')),
	async execute(interaction) {
		let image;
		let name;
		let color = '000000';

		//	in guild re: guild member
		if (interaction.inGuild() && interaction.options.getMember('user')) {
			image = interaction.options.getMember('user').user.displayAvatarURL({ size: 2048 });
			name = interaction.options.getMember('user').displayName;
			color = interaction.options.getMember('user').displayHexColor;
		//	re: non-guild member
		} else if (interaction.options.getUser('user')) {
			image = interaction.options.getUser('user').displayAvatarURL({ size: 2048 });
			name = interaction.options.getUser('user').tag;
		//	in guild re: self
		} else if (interaction.inGuild()) {
			image = interaction.member.user.displayAvatarURL({ size: 2048 });
			name = interaction.member.displayName;
			color = interaction.member.displayHexColor;
		//	not in guild re: self
		} else {
			image = interaction.user.displayAvatarURL({ size: 2048 });
			name = interaction.user.tag;
		}

		const embed = new MessageEmbed()
			.setTitle (name)
			.setImage (image)
			.setColor (color);
		await interaction.reply({ embeds: [embed] });
	},
};