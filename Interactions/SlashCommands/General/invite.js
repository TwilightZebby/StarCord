const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { localize } = require("../../../BotModules/LocalizationModule");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "invite",

    // Command's Description
    Description: `Shows the invite link to add StarCord as a User App`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `Shows the invite link to add StarCord as a User App`,
        'en-US': `Shows the invite link to add StarCord as a User App`
    },

    // Command's Category
    Category: "GENERAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 15,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "example": 3
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "ALL",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "example": "GUILD"
    },



    /**
     * Returns data needed for registering Slash Command onto Discord's API
     * @returns {ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.description_localizations = this.LocalisedDescriptions;
        Data.type = ApplicationCommandType.ChatInput;
        Data.integration_types = [ 1 ]; // 0 for GUILD_INSTALL, 1 for USER_INSTALL, can include both but must have at least one of them included
        Data.contexts = [ 0, 2 ]; // 0 for GUILD, 1 for BOT_DM (DMs with the Bot), 2 for PRIVATE_CHANNEL (DMs/GDMs that don't include Bot). Must include at least one, PRIVATE_CHANNEL can only be used if integrationTypes includes USER_INSTALL

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction)
    {
        // Just make the link button and ACK
        const InviteButton = new ActionRowBuilder().setComponents([
            new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(localize(interaction.locale, 'INVITE_COMMAND_BUTTON_LABEL')).setURL("https://discord.com/oauth2/authorize?client_id=1220284125269856326&scope=applications.commands&integration_type=1")
        ]);

        await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'INVITE_COMMAND_DESCRIPTION'), components: [InviteButton] });
        
        return;
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {AutocompleteInteraction} interaction 
     */
    async autocomplete(interaction)
    {
        //.
    }
}
