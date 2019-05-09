exports.run =  async (db, args, config, client, prefix, enotation, message, Discord) => {
        var ranks;
        if (args[0] && parseInt(args[0])>50){
            return message.reply(`${prefix}top can not display over 50 spots`)
        }else if (args[0] && parseInt(args[0])<=50){
            ranks = [];
            var setLength = parseInt(args[0]);
            for (var i = 1; i<setLength+1; i++){
            ranks.push("**"+i+":** ");
            }
        }else{
            ranks = ["**1:** ", "**2:** ", "**3:** ", "**4:** ", "**5:** ", "**6:** ", "**7:** ", "**8:** ", "**9:** ", "**10:** "];
        }
        
        var top = new Array();
        var userN = new Array();

        client.users.forEach(async (user)=> {
            if (!user.bot) top.push(db.get(`<@${user.id}>.balance`)+ db.get(`<@${user.id}>.bank`))
            //ignores bots
        });

        client.users.forEach(async (user)=> {
            if (!user.bot) userN.push(`${user.username}`)
            //ignores bots
        });

        // console.log(top)
        // console.log(userN)

        for (var t = 0; t < ranks.length; t++){
            var place  = Number.NEGATIVE_INFINITY;
            for (var i = 0;i < top.length; i++){
                var holder;
                if (top[i] > place){
                    holder = i;
                    place = top[i];
                }
            }

            ranks[t] += userN[holder];
            ranks[t] += " ";
            ranks[t] += `**${enotation.commas(top[holder])}**`;
            top.splice(holder, 1);
            userN.splice(holder, 1);
        }
        //console.log(ranks)

        //const attachment = client.guilds.get(config.supportServer).iconURL //guild
        const attachment = client.users.get(config.botID).avatarURL; //avatar of bot
        var embed = new Discord.RichEmbed()
        .setAuthor(`Leaderboard!`, attachment)
        .setDescription(ranks)
        .setColor("RANDOM")
        message.channel.send({embed}).catch(console.error)
}

