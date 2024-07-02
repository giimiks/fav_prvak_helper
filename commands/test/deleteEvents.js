/** @format */

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('delevents').setDescription('Ukáže harmonogram roku a zapíše jej do kalendáře v discordu').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		interaction.guild.scheduledEvents.cache.each((event) => {
			event.delete();
		});
	},
};
