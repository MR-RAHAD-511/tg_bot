module.exports = {
  config: {
    name: "uid",
    aliases: ["getid", "userid"],
    tags: ["info"],
    description: "Retrieve your or mentioned user's ID",
    prefix: true,
    permission: 0,
  },
  start: async ({ event, api, adminBatton }) => {
    const messageDetails = event.msg;
    let targetUser;

    
    if (messageDetails.reply_to_message) {
      targetUser = messageDetails.reply_to_message.from;  
    } else {
      targetUser = messageDetails.from;  
    }

    
    const mentionDetails = messageDetails.entities || [];
    let targetUserId = targetUser.id;

    mentionDetails.forEach(mention => {
      if (mention.type === 'mention') {
        const mentionText = messageDetails.text.substring(mention.offset, mention.offset + mention.length);
        const mentionName = mentionText.slice(1);

        
        const mentionedUserInText = messageDetails.entities.find(entity => entity.type === 'text_mention' && entity.user.username === mentionName);

        if (mentionedUserInText) {
          targetUserId = mentionedUserInText.user.id;
        }
      }
    });

    
    const targetUserName = targetUser.username || targetUser.first_name || targetUser.last_name || "Unknown";

    
    const chatId = messageDetails.chat.id;
    let userIdMessage = `🆔 Hey ${targetUserName}, your User ID is: ${targetUserId}`;

    
   // userIdMessage = userIdMessage.replace(/([`\*_\[\]\(\)~\>\#\+\-\=\|\{\}\.\!])/g, '\\$1');

    
    api.sendMessage(chatId, userIdMessage, adminBatton, {
      reply_to_message_id: messageDetails.message_id, 
    });
  }
};
