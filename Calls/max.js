exports.run =  async (db, message, args, enotation, config, maxBal, Discord) => {

    // if(!message.member.roles.get(config.administrator) && (message.author.id != config.owner)) return message.reply("Access Denied");
    if((message.author.id != config.owner)) return message.reply("Access Denied");

    let mentioned = args[0];
    if (mentioned == undefined || !(mentioned.substring(1, 2) == '@')) return message.reply("Please mention the player")
    if ((mentioned.substring(2, 3) == '!')) mentioned = "<@" + mentioned.substring(3, mentioned.length)
    if (!db.get(`${mentioned}`)) db.set(`${mentioned}`, {}); //creates a json file for their user if one does not already exist
    if (db.get(`${mentioned}.balance`) == 0) db.add(`${mentioned}.balance`, 0)
    else if (!db.get(`${mentioned}.balance`)) db.add(`${mentioned}.balance`, 1000)

    var needed = ((maxBal - db.get(`${mentioned}.balance`))/10)
    db.add(`${mentioned}.balance`, needed)
    
    var balM = db.get(`${mentioned}.balance`)
    balM = `**${enotation.commas(balM)}**`;

    var bank = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${mentioned}`)
        .setColor("#0xF1C40F")
        .addField("Balance", balM)
        // .addField("Time", message.createdAt)
        .addField("Warning", `You have reached the max amount ${mentioned}; going much further will break your credits`)
    message.channel.send(bank);
}