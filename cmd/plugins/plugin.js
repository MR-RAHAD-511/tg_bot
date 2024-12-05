const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "plugin", 
    aliases: ["load"],
    prefix: true,
    permission: 2,
  },
  start: async ({ event, api, match, config, admin, isGroup, isAdmin, pluginsLoad, botInfo }) => {
    const { msg } = event;
    const chatId = msg.chat.id;
    const text = event.body;


    const commandParts = text.split(" ");
    const command = commandParts[0].toLowerCase();
    const pluginName = commandParts[1];

    if (!pluginName) {
      return await api.sendMessage(chatId, "Please specify a plugin name.");
    }

    switch (command) {
      case "load":

        try {
          await loadPlugin(pluginName, event, api, match, config, admin, isGroup, isAdmin, pluginsLoad, botInfo);
          await api.sendMessage(chatId, `Plugin "${pluginName}" has been loaded successfully.`);
        } catch (error) {
          await api.sendMessage(chatId, `Failed to load plugin "${pluginName}": ${error.message}`);
        }
        break;

      default:
        await api.sendMessage(chatId, "Invalid command. Use /plugin load <plugin>.");
        break;
    }
  },
};


async function loadPlugin(pluginName, event, api, match, config, admin, isGroup, isAdmin, pluginsLoad, botInfo) {
  const pluginPath = path.resolve(__dirname, `${pluginName}.js`);

  if (!fs.existsSync(pluginPath)) {
    throw new Error(`Plugin "${pluginName}" does not exist.`);
  }

  try {

    delete require.cache[require.resolve(pluginPath)];


    const plugin = require(pluginPath);


    if (plugin.start) {
      await plugin.start({ event, api, match, config, admin, isGroup, isAdmin, pluginsLoad, botInfo });
    }
    console.log(`Plugin "${pluginName}" loaded.`);
  } catch (error) {
    throw new Error(`Error loading plugin "${pluginName}": ${error.message}`);
  }
}
