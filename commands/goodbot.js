const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('goodbot')
		.setDescription('>//////<'),
	execute(interaction) {
		interaction.reply('b-b-baka!!!\n>////////<');
	},
};