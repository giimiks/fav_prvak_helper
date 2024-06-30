/** @format */

const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const commandHandler = require('./commandHandler.js');
const dotenv = require('dotenv');
dotenv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

commandHandler(client);

client.login(process.env.TEST_TOKEN);
