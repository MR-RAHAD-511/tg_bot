

module.exports = {
  config: {
    name: "userinfo",
    credits: "Nayan",
    prefix: true,
    permission: 0,
    aliases: ["uinfo"],
    description: "See your info or information of the replied/mentioned user",
    tags: ["info"],
  },
  start: async ({ api, event }) => {
    const chatId = event.msg.chat.id;
    let userIdToGetInfo;

    
    if (event.msg.reply_to_message) {
      userIdToGetInfo = event.msg.reply_to_message.from.id;
    } else {
      const match = event.body.match(/@(\w+)/);
      if (match && match[1]) {
        const username = match[1];
        try {
          const members = await api.getChatAdministrators(chatId);
          const member = members.find((m) => m.user.username === username);

          if (member) {
            userIdToGetInfo = member.user.id;
          } else {
            await api.sendMessage(chatId, `Error: User @${username} not found.`);
            return;
          }
        } catch (error) {
          await api.sendMessage(chatId, `Error: Unable to find user @${username}.`);
          return;
        }
      } else {
        userIdToGetInfo = event.msg.from.id; 
      }
    }

    try {
      const chatMember = await api.getChatMember(chatId, userIdToGetInfo);

      
      const d = await global.userInfo(`${chatMember.user.username}`);

      let userInfo = `<b>👤 User Information:</b>\n`;
      userInfo += `<b>ID:</b> <i>${chatMember.user.id}</i>\n`;
      userInfo += `<b>Username:</b> <i>@${chatMember.user.username || "N/A"}</i>\n`;
      userInfo += `<b>First Name:</b> <i>${chatMember.user.first_name || "N/A"}</i>\n`;
      userInfo += `<b>Last Name:</b> <i>${chatMember.user.last_name || "N/A"}</i>\n`;
      userInfo += `<b>Bio:</b> <i>${d.bio || "N/A"}</i>\n`;
      userInfo += `<b>Status:</b> <i>${chatMember.status}</i>\n`;

      if (d.image) {
        
        await api.sendPhoto(chatId, d.image, {
          caption: userInfo,
          parse_mode: "HTML",
        });
      } else {
        
        await api.sendMessage(chatId, userInfo, { parse_mode: "HTML" });
      }
    } catch (error) {
      console.error(error);
      await api.sendMessage(chatId, `Error: Unable to retrieve user information.`);
    }
  },
};
