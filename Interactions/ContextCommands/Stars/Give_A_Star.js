const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction, UserFlags, Locale } = require("discord.js");
const { localize } = require("../../../BotModules/LocalizationModule");
const { TimerModel, UserStarModel } = require("../../../Mongoose/Models");
const { LogError } = require("../../../BotModules/LoggingModule");
const { calculateStarCooldownEnd } = require("../../../BotModules/TimerModule");
const { compareRanks } = require("../../../BotModules/RankModule");
const StarRankings = require("../../../Resources/starRankings.js");



/**
 * Calculate the Star Rank and returns its name
 * 
 * @param {Number} starCount 
 * @param {Locale} locale 
 * 
 * @return {String} Rank's Name
 */
function getRankDisplayName(starCount, locale)
{
    if ( starCount > StarRankings.BRONZE && starCount < StarRankings.SILVER ) { return localize(locale, 'STAR_RANK_BRONZE'); }
    else if ( starCount > StarRankings.SILVER && starCount < StarRankings.GOLD ) { return localize(locale, 'STAR_RANK_SILVER'); }
    else if ( starCount > StarRankings.GOLD && starCount < StarRankings.DIAMOND ) { return localize(locale, 'STAR_RANK_GOLD'); }
    else if ( starCount > StarRankings.DIAMOND && starCount < StarRankings.PLATINUM ) { return localize(locale, 'STAR_RANK_DIAMOND'); }
    else if ( starCount > StarRankings.PLATINUM && starCount < StarRankings.STARDUST ) { return localize(locale, 'STAR_RANK_PLATINUM'); }
    else { return localize(locale, 'STAR_RANK_STARDUST'); }
}



module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "Give A Star",

    // Command's Description
    Description: `Gives the User a Star`,

    // Command's Category
    Category: "GENERAL",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.User,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 30,

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "ALL",



    /**
     * Returns data needed for registering Context Command onto Discord's API
     * @returns {ApplicationCommandData}
     */
    registerData()
    {
        /** @type {ApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = "";
        Data.type = this.CommandType;
        Data.integration_types = [ 1 ]; // 0 for GUILD_INSTALL, 1 for USER_INSTALL, can include both but must have at least one of them included
        Data.contexts = [ 0, 2 ]; // 0 for GUILD, 1 for BOT_DM (DMs with the Bot), 2 for PRIVATE_CHANNEL (DMs/GDMs that don't include Bot). Must include at least one, PRIVATE_CHANNEL can only be used if integrationTypes includes USER_INSTALL

        return Data;
    },



    /**
     * Executes the Context Command
     * @param {ContextMenuCommandInteraction} interaction 
     */
    async execute(interaction)
    {
        // First, ensure not used on a Bot, on self, or on System
        const TargetUser = interaction.options.getUser("user", true);

        if ( TargetUser.bot ) { await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'GIVESTAR_COMMAND_ERROR_BOTS_UNSUPPORTED') }); return; }
        if ( TargetUser.system ) { await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'GIVESTAR_COMMAND_ERROR_SYSTEM_UNSUPPORTED') }); return; }
        if ( TargetUser.id === interaction.user.id ) { await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'GIVESTAR_COMMAND_ERROR_SELF_UNSUPPORTED') }); return; }
        if ( (TargetUser.flags.has(UserFlags.Quarantined)) || (TargetUser.flags.has(UserFlags.Spammer)) ) { await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'GIVESTAR_COMMAND_ERROR_SPAMMERS_UNSUPPORTED') }); return; }


        // Now, check for cooldown
        if ( await TimerModel.exists({ receivingUserId: TargetUser.id, givingUserId: interaction.user.id, timerType: "GIVING" }) != null )
        {
            // Is Cooldown Expiry in the future?
            let fetchedCooldown = await TimerModel.findOne({ receivingUserId: TargetUser.id, givingUserId: interaction.user.id, timerType: "GIVING" });
            let now = Date.now();

            if ( fetchedCooldown.timerExpires > now ) { await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'GIVESTAR_COMMAND_ERROR_COOLDOWN', TargetUser.displayName) }); return; }
        }


        // Give the User a Star!
        let fetchedStarData = await UserStarModel.findOne({ receivingUserId: TargetUser.id });
        if ( fetchedStarData == null )
        {
            // This is the first ever Star recivingUser has been given
            await UserStarModel.create({ receivingUserId: TargetUser.id, starCount: 1 })
            .then(async (newDocument) => {
                // ACK to User
                await interaction.reply({ content: localize(interaction.locale, 'GIVESTAR_COMMAND_SUCCESS_STANDARD', interaction.user.displayName, TargetUser.displayName) });

                // Create Cooldown
                await TimerModel.create({ receivingUserId: TargetUser.id, givingUserId: interaction.user.id, timerType: "GIVING", timerExpires: calculateStarCooldownEnd() })
                .then(async newDocument => {
                    setInterval(async () => { await newDocument.deleteOne(); }, 8.64e+7); // 24 hours
                })
                .catch(async err => {
                    await LogError(err);
                });

                return;
            })
            .catch(async err => {
                await LogError(err);
                await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'GIVESTAR_COMMAND_ERROR_GENERIC', TargetUser.displayName) });
                return;
            });
        }
        else
        {
            // Not the first time recivingUser has got a Star
            fetchedStarData.starCount += 1;

            // Check for rank-up
            let hasRankChanged = compareRanks(fetchedStarData.starCount - 1, fetchedStarData.starCount);

            await fetchedStarData.save()
            .then(async (newDocument) => {
                // ACK to User
                if ( hasRankChanged === 'NO_CHANGE' ) { await interaction.reply({ content: localize(interaction.locale, 'GIVESTAR_COMMAND_SUCCESS_STANDARD', interaction.user.displayName, TargetUser.displayName) }); }
                else { await interaction.reply({ content: `${localize(interaction.locale, 'GIVESTAR_COMMAND_SUCCESS_STANDARD', interaction.user.displayName, TargetUser.displayName)}\n\n${localize(interaction.guildLocale, 'USER_STAR_RANK_UP', TargetUser.displayName, getRankDisplayName(fetchedStarData.starCount, interaction.guildLocale))}` }); }

                // Create Cooldown
                await TimerModel.create({ receivingUserId: TargetUser.id, givingUserId: interaction.user.id, timerType: "GIVING", timerExpires: calculateStarCooldownEnd() })
                .then(async newDocument => {
                    setInterval(async () => { await newDocument.deleteOne(); }, 8.64e+7); // 24 hours
                })
                .catch(async err => {
                    await LogError(err);
                });

                return;
            })
            .catch(async err => {
                await LogError(err);
                await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'GIVESTAR_COMMAND_ERROR_GENERIC', TargetUser.displayName) });
                return;
            });
        }

        return;
    }
}
