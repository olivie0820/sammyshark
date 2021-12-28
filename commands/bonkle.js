const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bonkle')
		.setDescription('i want roodaka to step on me'),
	execute(interaction) {
		interaction.reply('Gathered friends... Listen again to our legend... of the BIONICLE.\nIn the time before time; the Great Spirit descended from the heavens carrying we, the ones called the Matoran, to this paradise. We were separate and without purpose. So the Great Spirit illuminated us with the three virtues: Unity, Duty, and Destiny.\nWe embraced these gifts, and in gratitude we named our island home Mata Nui... after the Great Spirit himself.\nBut our happiness was not to last, for Mata Nui’s brother, the Makuta, was jealous of these honors and betrayed him: casting a spell over Mata Nui, who fell into a deep slumber...\nThe Makuta was free to unleash his shadows.\nAnd unleash them, he did…');
	},
};