const StarRankings = require("../Resources/starRankings.js");



/**
 * Calculate the Star Rank and returns its name
 * 
 * @param {Number} starCount 
 * 
 * @return {String} Rank's Name
 */
function calculateRank(starCount)
{
    if ( starCount > StarRankings.BRONZE && starCount < StarRankings.SILVER ) { return 'BRONZE'; }
    else if ( starCount > StarRankings.SILVER && starCount < StarRankings.GOLD ) { return 'SILVER'; }
    else if ( starCount > StarRankings.GOLD && starCount < StarRankings.DIAMOND ) { return 'GOLD'; }
    else if ( starCount > StarRankings.DIAMOND && starCount < StarRankings.PLATINUM ) { return 'DIAMOND'; }
    else if ( starCount > StarRankings.PLATINUM && starCount < StarRankings.STARDUST ) { return 'PLATINUM'; }
    else { return 'STARDUST'; }
}


module.exports = {

    /**
     * Compares the User's Ranks for their old & new Star counts, to see if they ranked up or not
     * 
     * @param {Number} oldStarCount 
     * @param {Number} newStarCount 
     * 
     * @return {'RANK_INCREASED'|'NO_CHANGE'}
     */
    compareRanks(oldStarCount, newStarCount)
    {
        // Grab what Ranks the two Star Counts are at
        let oldRank = calculateRank(oldStarCount);
        let newRank = calculateRank(newStarCount);

        // Compare!
        if ( oldRank === newRank ) { return 'NO_CHANGE'; }
        else { return 'RANK_INCREASED'; }
    }

}
