exports.run =  async (message, delay, config, prefix, Discord) => {
    var reactions = ["1⃣", "2⃣", "3⃣", "🎲"];
    let promise = new Promise((resolve) => {
        setTimeout(() => resolve("done!"), 2000)
    });

    var embedhelpsimple = new Discord.RichEmbed()
    .setTitle("**Commands**\n")
    .addField(" - Basic (1)", `help, info, ping, calcvote, balance/credits, bank, transfer, daily`)
    .addField(" - Games (2)", `guess, slot, crash, blackjack`)
    .addField(" - Support (3)", `Info about support server and how to support developer`)
    .addField(" - More", `Use Reactions ${reactions[0]}, ${reactions[1]} and ${reactions[2]}; ${reactions[3]} is for admins`) 
    .setColor(0x23bd7b)

    var embedhelpmember = new Discord.RichEmbed()
    .setTitle("**List of Commands**\n")
    .addField(" - help", `Displays this message (Correct usage: ${prefix}help)`)
    .addField(" - info", `Tells info about the bot (Correct usage: ${prefix}info)`)
    .addField(" - ping", `Tests your ping (Correct usage: ${prefix}ping)`)
    .addField(" - calcvote", `Calculate amount for |+shop buy 4 #| (Correct usage: ${prefix}calcvote [amount])`) 
    .addField(" - balance/credits", `Displays your credits (Correct usage: ${prefix}balance or ${prefix}credits, or ${prefix}balance @user or ${prefix}credits @user)`) 
    .addField(" - top", `Shows the top users with the most credits (Correct usage: ${prefix}top or ${prefix}top [#<51])`)
    .addField(" - bank", `Display, withdraw or deposit credits in your bank (Correct usage: ${prefix}bank or ${prefix}bank [(withdraw)/(w)] [amount] or ${prefix}bank [(deposit)/(d)] [amount])`)
    .addField(" - transfer", `Transfer your credits to a user (Correct usage: ${prefix}transfer @user [amount])`)
    .addField(" - daily", `(Correct usage: ${prefix}daily)`)  
    //.addField(" - vote", ` (Correct usage: ${prefix}vote)`)   
    .setColor(0xFFA500)
    .setFooter("Have fun")

    var embedhelpgames = new Discord.RichEmbed()
    .setTitle("**List of Games**\n") 
    .addField(" - guess", `Guess the number or whether its even/odd (Correct usage: ${prefix}guess [amount] [odds/optional])`)  
    .addField(" - slot", `Test your luck (Correct usage: ${prefix}slot [amount])`) 
    .addField(" - crash", `More risk, more reward (Correct usage: ${prefix}crash [amount])`)
    .addField(" - blackjack", `Card game between you and AI (Correct usage: ${prefix}blackjack [amount])`)  
    .addField(" - coinflip", `Flip the coin (Correct usage: ${prefix}coinflip [amount])`) 
    .setColor(0x00FF00)
    .setFooter("Amount is in credits")

    var embedheladmin = new Discord.RichEmbed()
    .setTitle("**List of Admin Commands**\n")
    .addField(" - give", `(Correct usage: ${prefix}give @user [amount])`) 
    .addField(" - reset", `(Correct usage: ${prefix}reset @user [amount])`)
    .setColor(0x0000FF)
    
    var embedsupport = new Discord.RichEmbed()
    .setTitle("**Support**\n")
    .addField(" - Owner-Entropy#9919", "If there are any pressing questions, contact me; I will do my best to resolve the issue") // contact me
    .addField(" - Version", "v2") // Version
    .setColor(0x00A7D1)
    .setFooter("DM me or join my the bot's support server if a problem occurs and provide proof")

    var end = new Discord.RichEmbed()
    .setTitle("**Session Ended**\n")
    .addField(" - Help", `use ${prefix}help`)
    .addField(" - Support Server", `https://discord.gg/2mqEKzH`)
    .addField(" - Invite Bot", `Not released till v3`)
    .setColor(0xF0A001)

    var m = await message.channel.send(embedhelpsimple);
    m.react(reactions[0])
    m.react(reactions[1])
    m.react(reactions[2])
    await promise; //timerfail
    if (message.author.id == config.owner || message.member.roles.get(config.admin)) m.react(reactions[3])
    .catch(console.error);
    

    var filter = (reaction, user) => {
        return [reactions[0], reactions[1], reactions[2], reactions[3]].includes(reaction.emoji.name) && user.id === message.author.id;
    };        
    var rCollector = m.createReactionCollector(filter, { max: 10, time: 30000, errors: ['time'] });
    rCollector.on('collect', collected => {
        if (collected.emoji.name === reactions[0]) {
            collected.remove(message.author.id);
            m.edit(embedhelpmember);
        }else if (collected.emoji.name === reactions[1]) {
            collected.remove(message.author.id);
            m.edit(embedhelpgames);
        }else if (collected.emoji.name === reactions[2]) {
            collected.remove(message.author.id);
            m.edit(embedsupport);
        }else if (collected.emoji.name === reactions[3] && (message.author.id == config.owner || message.member.roles.get(config.admin))) {
            collected.remove(message.author.id);
            m.edit(embedheladmin);
        }
    });
    rCollector.on('end', () => {
        m.edit(end);
        m.edit(end); //makes sure end is used
        m.edit(end);
    });
    




}