const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, EmbedBuilder, Locale } = require("discord.js");
const { UserStarModel } = require("../../../Mongoose/Models");
const { localize } = require("../../../BotModules/LocalizationModule");
const StarRankings = require("../../../Resources/starRankings.js");


/**
 * Calculate the Star Rank and returns its name
 * 
 * @param {Number} starCount 
 * @param {Locale} locale 
 * 
 * @return {String} Rank's Name
 */
function calculateRank(starCount, locale)
{
    if ( starCount > StarRankings.BRONZE && starCount < StarRankings.SILVER ) { return localize(locale, 'STAR_RANK_BRONZE'); }
    else if ( starCount > StarRankings.SILVER && starCount < StarRankings.GOLD ) { return localize(locale, 'STAR_RANK_SILVER'); }
    else if ( starCount > StarRankings.GOLD && starCount < StarRankings.DIAMOND ) { return localize(locale, 'STAR_RANK_GOLD'); }
    else if ( starCount > StarRankings.DIAMOND && starCount < StarRankings.PLATINUM ) { return localize(locale, 'STAR_RANK_DIAMOND'); }
    else if ( starCount > StarRankings.PLATINUM && starCount < StarRankings.STARDUST ) { return localize(locale, 'STAR_RANK_PLATINUM'); }
    else { return localize(locale, 'STAR_RANK_STARDUST'); }
}



/**
 * Returns the amount needed for the next Star Rank
 * 
 * @param {Number} starCount 
 * 
 * @return {Number} Number of Stars needed for next Rank, or -1 for "Already at highest Rank"
 */
function getNextRankRequirement(starCount)
{
    if ( starCount < StarRankings.BRONZE ) { return StarRankings.BRONZE; }
    else if ( starCount > StarRankings.BRONZE && starCount < StarRankings.SILVER ) { return StarRankings.SILVER; }
    else if ( starCount > StarRankings.SILVER && starCount < StarRankings.GOLD ) { return StarRankings.Gold; }
    else if ( starCount > StarRankings.GOLD && starCount < StarRankings.DIAMOND ) { return StarRankings.DIAMOND; }
    else if ( starCount > StarRankings.DIAMOND && starCount < StarRankings.PLATINUM ) { return StarRankings.PLATINUM; }
    else if ( starCount > StarRankings.PLATINUM && starCount < StarRankings.STARDUST ) { return StarRankings.STARDUST; }
    else { return -1; }
}



/**
 * Returns the colour (in HEX) for that Rank
 * 
 * @param {Number} starCount 
 * 
 * @return {String} Rank's Colour in HEX
 */
function getRankColor(starCount)
{
    if ( starCount > StarRankings.BRONZE && starCount < StarRankings.SILVER ) { return '#B08D57'; }
    else if ( starCount > StarRankings.SILVER && starCount < StarRankings.GOLD ) { return '#C0C0C0'; }
    else if ( starCount > StarRankings.GOLD && starCount < StarRankings.DIAMOND ) { return '#FFD700'; }
    else if ( starCount > StarRankings.DIAMOND && starCount < StarRankings.PLATINUM ) { return '#B9F2FF'; }
    else if ( starCount > StarRankings.PLATINUM && starCount < StarRankings.STARDUST ) { return '#E5E4E2'; }
    else { return '#8B56F2'; }
}



module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "rank",

    // Command's Description
    Description: `View your current Star Rank`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `View your current Star Rank`,
        'en-US': `View your current Star Rank`
    },

    // Command's Category
    Category: "GENERAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

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
        // Grab User's Star Count
        let fetchedStarData = await UserStarModel.findOne({ receivingUserId: interaction.user.id });

        if ( fetchedStarData == null )
        {
            await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'RANK_COMMAND_ERROR_NO_DATA_AVALIABLE') });
            return;
        }
        else
        {
            let rankEmbed = new EmbedBuilder().setTitle(localize(interaction.locale, 'RANK_COMMAND_EMBED_TITLE', interaction.user.displayName));
            if ( fetchedStarData.starCount < StarRankings.BRONZE )
            {
                rankEmbed.setDescription(localize(interaction.locale, 'RANK_COMMAND_EMBED_DESCRIPTION_UNRANKED'))
                .addFields({ name: localize(interaction.locale, 'RANK_COMMAND_EMBED_PROGRESS_FIELD_TITLE', localize(interaction.locale, 'STAR_RANK_BRONZE')), value: `${Math.floor(fetchedStarData.starCount / StarRankings.BRONZE)}%` });
            }
            else if ( fetchedStarData.starCount > StarRankings.STARDUST )
            {
                rankEmbed.setDescription(localize(interaction.locale, 'RANK_COMMAND_EMBED_DESCRIPTION_MAX_RANK', localize(interaction.locale, 'STAR_RANK_STARDUST'))).setColor('#8B56F2');
            }
            else
            {
                rankEmbed.setDescription(localize(interaction.locale, 'RANK_COMMAND_EMBED_DESCRIPTION_RANK_INFO', calculateRank(fetchedStarData.starCount, interaction.locale)))
                .setColor(getRankColor(fetchedStarData.starCount))
                .addFields({ name: localize(interaction.locale, 'RANK_COMMAND_EMBED_PROGRESS_FIELD_TITLE', calculateRank(fetchedStarData.starCount, interaction.locale)), value: `${Math.floor(fetchedStarData.starCount / getNextRankRequirement(fetchedStarData.starCount))}%` });
            }

            await interaction.reply({ ephemeral: true, embeds: [rankEmbed] });
            return;
        }
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
