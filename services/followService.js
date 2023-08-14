const Follow = require("../models/follow");

const followUserIds = async(identityUserId) => {

    try{
        // Find documents that I follow  
        let following = await Follow.find({"user": identityUserId})
            .select({"_id": 0, "followed": 1})

        // Find documents that follow me
        let followers = await Follow.find({"followed": identityUserId})
            .select({"_id": 0, "user": 1});

        // Extract users that I follow 
        let followingClean = [];

        following.forEach(follow => {
            followingClean.push(follow.followed);
        });

        // Extract users that follow me
        let followersClean = [];

        followers.forEach(follow => {
            followersClean.push(follow.user);
        });

        return {
            following: followingClean,
            followers: followersClean
        }
    }
    catch(error) {
        return {};
    }

    
}

const followThisUser = async(identityUserId, profileUserId) => {

}

module.exports = {
    followUserIds,
    followThisUser
}