const { ApplicationCommandType, ApplicationCommandData, ContextMenuCommandInteraction, UserFlags } = require("discord.js");
const { localize } = require("../../../BotModules/LocalizationModule");
const { TimerModel, UserStarModel } = require("../../../Mongoose/Models");
const { LogError } = require("../../../BotModules/LoggingModule");
const { calculateStarCooldown } = require("../../../BotModules/TimerModule");

module.exports = {
    // Command's Name
    //     Can use sentence casing and spaces
    Name: "Revoke A Star",

    // Command's Description
    Description: `Revokes a Star from a User`,

    // Command's Category
    Category: "GENERAL",

    // Context Command Type
    //     One of either ApplicationCommandType.Message, ApplicationCommandType.User
    CommandType: ApplicationCommandType.User,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 60,

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

        if ( TargetUser.bot ) { await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'REVOKESTAR_COMMAND_ERROR_BOTS_UNSUPPORTED') }); return; }
        if ( TargetUser.system ) { await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'REVOKESTAR_COMMAND_ERROR_SYSTEM_UNSUPPORTED') }); return; }
        if ( TargetUser.id === interaction.user.id ) { await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'REVOKESTAR_COMMAND_ERROR_SELF_UNSUPPORTED') }); return; }


        // Now, check for cooldown
        if ( await TimerModel.exists({ receivingUserId: TargetUser.id, givingUserId: interaction.user.id, timerType: "REVOKING" }) == null )
        {
            // Is Cooldown Expiry in the future?
            let fetchedCooldown = await TimerModel.findOne({ receivingUserId: TargetUser.id, givingUserId: interaction.user.id, timerType: "REVOKING" });
            let now = Date.now();

            if ( fetchedCooldown.timerExpires > now ) { await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'REVOKESTAR_COMMAND_ERROR_COOLDOWN', TargetUser.displayName) }); return; }
        }


        // Revoke a Star!
        let fetchedStarData = await UserStarModel.findOne({ receivingUserId: TargetUser.id });

        if ( fetchedStarData == null )
        {
            // receivingUser has no Stars!
            await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'REVOKESTAR_COMMAND_ERROR_NO_STARS_TO_REVOKE', TargetUser.displayName) });
            return;
        }


        if ( fetchedStarData.givingUserIds.length < 1 )
        {
            // receivingUser has no Stars!
            await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'REVOKESTAR_COMMAND_ERROR_NO_STARS_TO_REVOKE', TargetUser.displayName) });
            return;
        }
        else
        {
            // receivingUser does have Stars, check in Array to see if givingUser has a Star to revoke
            if ( !fetchedStarData.givingUserIds.includes(interaction.user.id) )
            {
                await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'REVOKESTAR_COMMAND_ERROR_NO_STARS_TO_REVOKE', TargetUser.displayName) });
                return;
            }

            delete fetchedStarData.givingUserIds[fetchedStarData.givingUserIds.findIndex(item => item === interaction.user.id)];

            await fetchedStarData.save()
            .then(async (newDocument) => {
                // ACK to User
                await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'REVOKESTAR_COMMAND_SUCCESS', TargetUser.displayName) });

                // Create Cooldown
                await TimerModel.create({ receivingUserId: TargetUser.id, givingUserId: interaction.user.id, timerType: "REVOKING", timerExpires: calculateStarCooldown() })
                .then(async newDocument => {
                    setInterval(async () => { await newDocument.deleteOne(); }, calculateStarCooldown());
                })
                .catch(async err => {
                    await LogError(err);
                });

                return;
            })
            .catch(async err => {
                await LogError(err);
                await interaction.reply({ ephemeral: true, content: localize(interaction.locale, 'REVOKESTAR_COMMAND_ERROR_GENERIC', TargetUser.displayName) });
                return;
            });
        }

        return;
    }
}
