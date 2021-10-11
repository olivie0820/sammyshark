module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const { commandName } = interaction;

		if (!interaction.client.commands.has(commandName)) return;

		try {
			await interaction.client.commands.get(commandName).execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!', ephemeral: true });
		}
	},
};