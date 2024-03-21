const { TimerModel } = require("../Mongoose/Models.js");
const { LogError } = require("./LoggingModule");


module.exports = {
    /**
     * Fetches and restarts all Timers stored on DB while Bot is booting up
     */
    async restartTimersOnStartup()
    {
        // Fetch Timers & current UNIX timestamp
        let fetchedTimers = await TimerModel.find();
        const now = Date.now();

        // If no timers, abort early
        if ( fetchedTimers.length < 1 ) { return; }

        // Loop through all the timers
        fetchedTimers.forEach(async timerObj => {
            // Check if expiry is BEFORE now.
            //  If yes, run the callback
            //  If no, restart its setInterval()
            
            if ( timerObj.timerExpires < now )
            {
                // Expired timer, remove it!
                await timerObj.deleteOne();
            }
            else
            {
                // Grab time left
                let timeLeft = timerObj.timerExpires - now;

                // Pending timer, setInternal() again
                try { setInterval(async () => { await timerObj.deleteOne(); }, timeLeft); }
                catch (err) { await LogError(err); }
            }

        });

        return;
    },



    /**
     * Calculates the UNIX timestamp for Star Cooldowns
     */
    calculateStarCooldown()
    {
        const now = Date.now();
        return now + 2.592e+8;
    }
}
