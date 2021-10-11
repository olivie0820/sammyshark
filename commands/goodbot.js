const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('goodbot')
		.setDescription('>//////<'),
	async execute(interaction) {
		await interaction.reply('b-b-baka!!!\n>////////<');
	},
};