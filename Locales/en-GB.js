module.exports = {
    // ******* GENERIC STUFF
    ERROR_GENERIC: `An error has occurred.`,
    ERROR_WITH_PREVIEW: `An error has occurred. A preview of the raw error is as follows:\n\`\`\`{{0}}\`\`\``,



    // ******* GENERIC SLASH COMMAND STUFF
    SLASH_COMMAND_ERROR_GENERIC: `Sorry, but there was a problem trying to run this Slash Command...`,
    SLASH_COMMAND_ERROR_GUILDS_UNSUPPORTED: `Sorry, but this Slash Command can only be used in Direct Messages (DMs) with me.`,
    SLASH_COMMAND_ERROR_DMS_UNSUPPORTED: `Sorry, but this Slash Command cannot be used within Direct Messages (DMs) or Group DMs.`,
    SLASH_COMMAND_ERROR_ONLY_TEXT_CHANNELS: `Sorry, but this Slash Command can only be used inside of Server Text Channels.`,
    SLASH_COMMAND_ERROR_DISCORD_OUTAGE: `Sorry, but this Command is unusable while there's a Discord Outage affecting your Server. You can check [Discord's Outage Page](https://discordstatus.com) for extra details.`,

    SLASH_COMMAND_ERROR_COOLDOWN_SECONDS: `Please wait {{0}} more seconds before using this Slash Command again.`,
    SLASH_COMMAND_ERROR_COOLDOWN_MINUTES: `Please wait {{0}} more minutes before using this Slash Command again.`,
    SLASH_COMMAND_ERROR_COOLDOWN_HOURS: `Please wait {{0}} more hours before using this Slash Command again.`,
    SLASH_COMMAND_ERROR_COOLDOWN_DAYS: `Please wait {{0}} more days before using this Slash Command again.`,
    SLASH_COMMAND_ERROR_COOLDOWN_MONTHS: `Please wait {{0}} more months before using this Slash Command again.`,



    // ******* GENERIC CONTEXT COMMAND STUFF
    CONTEXT_COMMAND_ERROR_GENERIC: `Sorry, an error occurred while trying to run this Context Command...`,
    CONTEXT_COMMAND_ERROR_DMS_UNSUPPORTED: `Sorry, but this Context Command cannot be used within Direct Messages (DMs) or Group DMs.`,
    CONTEXT_COMMAND_ERROR_SYSTEM_AND_BOT_MESSAGES_UNSUPPORTED: `Sorry, but this Context Command cannot be used on a System or Bot Message.`,
    CONTEXT_COMMAND_ERROR_GUILDS_UNSUPPORTED: `Sorry, but this Context Command can only be used in Direct Messages (DMs) with me.`,
    CONTEXT_COMMAND_ERROR_DMS_UNSUPPORTED: `Sorry, but this Context Command cannot be used within Direct Messages (DMs) or Group DMs.`,

    CONTEXT_COMMAND_ERROR_COOLDOWN_SECONDS: `Please wait {{0}} more seconds before using this Context Command again.`,
    CONTEXT_COMMAND_ERROR_COOLDOWN_MINUTES: `Please wait {{0}} more minutes before using this Context Command again.`,
    CONTEXT_COMMAND_ERROR_COOLDOWN_HOURS: `Please wait {{0}} more hours before using this Context Command again.`,
    CONTEXT_COMMAND_ERROR_COOLDOWN_DAYS: `Please wait {{0}} more days before using this Context Command again.`,
    CONTEXT_COMMAND_ERROR_COOLDOWN_MONTHS: `Please wait {{0}} more months before using this Context Command again.`,



    // ******* GENERIC BUTTON STUFF
    BUTTON_ERROR_GENERIC: `An error occurred while trying to process that Button press...`,

    BUTTON_ERROR_COOLDOWN_SECONDS: `Please wait {{0}} more seconds before using this Button again.`,
    BUTTON_ERROR_COOLDOWN_MINUTES: `Please wait {{0}} more minutes before using this Button again.`,
    BUTTON_ERROR_COOLDOWN_HOURS: `Please wait {{0}} more hours before using this Button again.`,
    BUTTON_ERROR_COOLDOWN_DAYS: `Please wait {{0}} more days before using this Button again.`,
    BUTTON_ERROR_COOLDOWN_MONTHS: `Please wait {{0}} more months before using this Button again.`,



    // ******* GENERIC SELECT MENU STUFF
    SELECT_MENU_ERROR_GENERIC: `An error occurred while trying to process that Select Menu choice...`,

    SELECT_MENU_ERROR_COOLDOWN_SECONDS: `Please wait {{0}} more seconds before using this Select Menu again.`,
    SELECT_MENU_ERROR_COOLDOWN_MINUTES: `Please wait {{0}} more minutes before using this Select Menu again.`,
    SELECT_MENU_ERROR_COOLDOWN_HOURS: `Please wait {{0}} more hours before using this Select Menu again.`,
    SELECT_MENU_ERROR_COOLDOWN_DAYS: `Please wait {{0}} more days before using this Select Menu again.`,
    SELECT_MENU_ERROR_COOLDOWN_MONTHS: `Please wait {{0}} more months before using this Select Menu again.`,



    // ******* GENERIC MODAL STUFF
    MODAL_ERROR_GENERIC: `An error occurred while trying to process that Modal submission...`,



    // ******* GENERIC AUTOCOMPLETE STUFF
    AUTOCOMPLETE_ERROR_GENERIC: `Error: Unable to process. Please contact this Bot's developer!`,



    // ******* GENERIC USERSTARS STUFF
    TRUE_UPPERCASE: `TRUE`,
    FALSE_UPPERCASE: `FALSE`,
    TRUE: `True`,
    FALSE: `False`,

    ENABLE: `Enable`,
    DISABLE: `Disable`,

    STAR_RANK_BRONZE: `Bronze`,
    STAR_RANK_SILVER: `Silver`,
    STAR_RANK_GOLD: `Gold`,
    STAR_RANK_DIAMOND: `Diamond`,
    STAR_RANK_PLATINUM: `Platinum`,
    STAR_RANK_STARDUST: `Stardust`,

    USER_STAR_RANK_UP: `**{{0}}** has ranked up to **{{1}}** Star Rank!`,
    USER_STAR_RANK_DOWN: `**{{0}}** has ranked down to **{{1}}** Star Rank.`, // Doubt this will be used, but just in case!



    // ******* GIVING STARS
    GIVESTAR_COMMAND_SUCCESS_STANDARD: `**{{0}}** has given a :star: Star to **{{1}}**!`,
    GIVESTAR_COMMAND_SUCCESS_YOU_TRIED: `**{{0}}** has given a :star: "You Tried" Star to **{{1}}**!`,
    GIVESTAR_COMMAND_SUCCESS_GLOWING: `**{{0}}** has given a :sparkles: Glowing Star to **{{1}}**!`,
    GIVESTAR_COMMAND_SUCCESS_SPARKLING: `**{{0}}** has given a :star2: Sparkling Star to **{{1}}**!`,

    GIVESTAR_COMMAND_ERROR_BOTS_UNSUPPORTED: `You cannot give a Star to a Bot.`,
    GIVESTAR_COMMAND_ERROR_SELF_UNSUPPORTED: `You cannot give yourself a Star. Try giving one to another User instead.`,
    GIVESTAR_COMMAND_ERROR_SYSTEM_UNSUPPORTED: `You cannot give Discord's System User a Star.`,
    GIVESTAR_COMMAND_ERROR_SPAMMERS_UNSUPPORTED: `You cannot give a Star to a User that has either one of Discord's "Likely Spammer" or "Quarantined" flags.`,
    GIVESTAR_COMMAND_ERROR_COOLDOWN: `You cannot give the same User multiple Stars in the same short timespan. Please wait a day before you can give **{{0}}** another Star again.`,
    GIVESTAR_COMMAND_ERROR_GENERIC: `An error occurred while trying to give **{{0}}** a Star. Please try again later.`,



    // ******* REVOKING STARS
    REVOKESTAR_COMMAND_SUCCESS: `You have revoked one Star from **{{0}}**!`,

    REVOKESTAR_COMMAND_ERROR_BOTS_UNSUPPORTED: `You cannot revoke a Star from a Bot.`,
    REVOKESTAR_COMMAND_ERROR_SELF_UNSUPPORTED: `You cannot revoke a Star from yourself.`,
    REVOKESTAR_COMMAND_ERROR_SYSTEM_UNSUPPORTED: `You cannot revoke a Star from Discord's System User.`,
    REVOKESTAR_COMMAND_ERROR_COOLDOWN: `You cannot revoke multiple Stars from the same User in the same short timespan.`,
    REVOKESTAR_COMMAND_ERROR_NO_STARS_TO_REVOKE: `You have no recently given Stars for **{{0}}** that you can revoke.\n\nYou can only revoke Stars you have recently given in the last 24 hours.`,
    REVOKESTAR_COMMAND_ERROR_GENERIC: `An error occurred while trying to revoke a Star from **{{0}}**. Please try again later.`,



    // ******* RANK COMMAND
    RANK_COMMAND_EMBED_TITLE: `{{0}} - Star Rank Card`,
    RANK_COMMAND_EMBED_DESCRIPTION_RANK_INFO: `You currently have the **{{0}}** Star Rank.`,
    RANK_COMMAND_EMBED_DESCRIPTION_UNRANKED: `You are currently unranked.`,
    RANK_COMMAND_EMBED_DESCRIPTION_MAX_RANK: `You currently have the highest Star Rank - **{{0}}**!`,
    RANK_COMMAND_EMBED_PROGRESS_FIELD_TITLE: `Progress to {{0}} Rank`,

    RANK_COMMAND_ERROR_NO_DATA_AVALIABLE: `You have not received any Stars from other Users yet.`,



    // ******* INVITE COMMAND
    INVITE_COMMAND_DESCRIPTION: `Here's the invite link to add UserStars as a User App!\n*(You can copy the link from the button if you want to share it)*`,
    INVITE_COMMAND_BUTTON_LABEL: `Add UserStars`,



    // ******* SUPPORT COMMAND
    SUPPORT_COMMAND_DESCRIPTION: `Here's the link to UserStars' Support Server - "Twilight Domain"!`,
    SUPPORT_COMMAND_SERVER_BUTTON_LABEL: `Join UserStars' Support Server`,
};
