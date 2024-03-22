const { ChatInputCommandInteraction, ChatInputApplicationCommandData, ApplicationCommandType, AutocompleteInteraction, ApplicationCommandOptionType, User, UserFlags } = require("discord.js");
const { localize } = require("../../../BotModules/LocalizationModule");
const { TimerModel, UserStarModel } = require("../../../Mongoose/Models");
const { calculateStarCooldownEnd } = require("../../../BotModules/TimerModule");

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "star",

    // Command's Description
    Description: `Give or Revoke Stars for other Users`,

    // Command's Localised Descriptions
    LocalisedDescriptions: {
        'en-GB': `Give or Revoke Stars for other Users`,
        'en-US': `Give or Revoke Stars for other Users`
    },

    // Command's Category
    Category: "GENERAL",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 60,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "give": 60,
        "revoke": 60
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "ALL",

    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "give": "ALL",
        "revoke": "ALL"
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
        Data.options = [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "give",
                description: "Give a Star to another User",
                description_localizations: {
                    'en-GB': "Give a Star to another User",
                    'en-US': "Give a Star to another User"
                },
                options: [
                    {
                        type: ApplicationCommandOptionType.User,
                        name: "user",
                        description: "User to give a Star to",
                        description_localizations: {
                            'en-GB': "User to give a Star to",
                            'en-US': "User to give a Star to"
                        },
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "revoke",
                description: "Revoke a Star from another User",
                description_localizations: {
                    'en-GB': "Revoke a Star from another User",
                    'en-US': "Revoke a Star from another User"
                },
                options: [
                    {
                        type: ApplicationCommandOptionType.User,
                        name: "user",
                        description: "User to revoke a Star from",
                        description_localizations: {
                            'en-GB': "User to revoke a Star from",
                            'en-US': "User to revoke a Star from"
                        },
                        required: true
                    }
                ]
            }
        ];

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction)
    {
        // Grab User inputted, and action based off Subcommand used
        const TargetUser = interaction.options.getUser("user", true);
        const Subcommand = interaction.options.getSubcommand(true);

        if ( Subcommand === "give" ) { await GiveStar(interaction, TargetUser); }
        else { await RevokeStar(interaction, TargetUser); }

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










/**
 * Gives a Star to the TargetUser
 * @param {ChatInputCommandInteraction} interaction 
 * @param {User} TargetUser 
 */
async function GiveStar(interaction, TargetUser)
{
    // First, ensure not used on a Bot, on self, or on System
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
        await UserStarModel.create({ receivingUserId: TargetUser.id, givingUserIds: [ interaction.user.id ] })
        .then(async (newDocument) => {
            // ACK to User
            await interaction.reply({ content: localize(interaction.locale, 'GIVESTAR_COMMAND_SUCCESS', interaction.user.displayName, TargetUser.displayName) });

            // Create Cooldown
            await TimerModel.create({ receivingUserId: TargetUser.id, givingUserId: interaction.user.id, timerType: "GIVING", timerExpires: calculateStarCooldownEnd() })
            .then(async newDocument => {
                setInterval(async () => { await newDocument.deleteOne(); }, 2.592e+8);
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
        fetchedStarData.givingUserIds.push(interaction.user.id);

        await fetchedStarData.save()
        .then(async (newDocument) => {
            // ACK to User
            await interaction.reply({ content: localize(interaction.locale, 'GIVESTAR_COMMAND_SUCCESS', interaction.user.displayName, TargetUser.displayName) });

            // Create Cooldown
            await TimerModel.create({ receivingUserId: TargetUser.id, givingUserId: interaction.user.id, timerType: "GIVING", timerExpires: calculateStarCooldownEnd() })
            .then(async newDocument => {
                setInterval(async () => { await newDocument.deleteOne(); }, 2.592e+8);
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









/**
 * Revokes a Star from the TargetUser
 * @param {ChatInputCommandInteraction} interaction 
 * @param {User} TargetUser 
 */
async function RevokeStar(interaction, TargetUser)
{
    // First, ensure not used on a Bot, on self, or on System
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
            await TimerModel.create({ receivingUserId: TargetUser.id, givingUserId: interaction.user.id, timerType: "REVOKING", timerExpires: calculateStarCooldownEnd() })
            .then(async newDocument => {
                setInterval(async () => { await newDocument.deleteOne(); }, 2.592e+8);
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
