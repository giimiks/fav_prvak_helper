/** @format */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder().setName('harmonogram').setDescription('Ukáže harmonogram roku a zapíše jej do kalendáře v discordu'),
	async execute(interaction) {
		await axios.get(process.env.FAV_API).then((res) => {
			let data = res.data.harmonogramItem;
			//doslova lenost
			const embed = new EmbedBuilder().setColor(0xeb4034).setTitle(`Harmonogram Roku`);
			const embed2 = new EmbedBuilder().setColor(0xeb4034);
			for (let i = 0; i < data.length - 1; i++) {
				if (i < 25) {
					embed.addFields({ name: data[i].datumOd.value, value: data[i].popis, inline: true });
					let datum = data[i].datumOd.value.replaceAll('.', '-').split('-').reverse().join('-');
					interaction.guild.scheduledEvents.create({
						name: data[i].datumOd.value,
						description: data[i].popis,
						entityType: 3,
						scheduledStartTime: datum + ' 00:00:00',
						scheduledEndTime: datum + ' 23:59:59',
						privacyLevel: 2,
						entityMetadata: { location: 'FAV' },
					});
				} else {
					embed2.addFields({ name: data[i].datumOd.value, value: data[i].popis, inline: true });
					let datum = data[i].datumOd.value.replaceAll('.', '-').split('-').reverse().join('-');
					interaction.guild.scheduledEvents.create({
						name: data[i].datumOd.value,
						description: data[i].popis,
						entityType: 3,
						scheduledStartTime: datum + ' 00:00:00',
						scheduledEndTime: datum + ' 23:59:59',
						privacyLevel: 2,
						entityMetadata: { location: 'FAV' },
					});
				}
			}
			interaction.reply({ embeds: [embed, embed2] });
		});
	},
};
