/** @format */

const { Events, Collection } = require('discord.js');
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
module.exports = (client) => {
	client.commands = new Collection();
	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	const commands = [];
	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
				commands.push(command.data.toJSON());
				console.log(`[CMDHANDLE] Loaded commmand ${command.data.name} at ${filePath}`);
			} else {
				console.log(`[CMDHANDLE][WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	});

	// @ts-ignore
	const rest = new REST().setToken(process.env.TEST_TOKEN);
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
			const data = await rest.put(Routes.applicationGuildCommands(process.env.TEST_APP_ID, process.env.TEST_GUILD_ID), { body: commands });
			// @ts-ignore
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	})();
};
