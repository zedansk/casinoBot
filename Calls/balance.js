exports.run =  async (message, args, enotation, db, sender, Discord) => {
    var mentioned = args[0];
    //console.log(args[0]);
    if (mentioned != undefined){
        if (!(mentioned.substring(1, 2) == '@')) return message.reply("Please mention the player")
        if ((mentioned.substring(2, 3) == '!')) mentioned = "<@" + mentioned.substring(3, mentioned.length)

        if (!db.get(`${mentioned}`)) db.set(`${mentioned}`, {}); //creates a json file for their user if one does not already exist
        if (db.get(`${mentioned}.balance`) == 0) db.add(`${mentioned}.balance`, 0)
        else if (!db.get(`${mentioned}.balance`)) db.add(`${mentioned}.balance`, 1000)

        var balM = db.get(`${mentioned}.balance`)
        balM = `**${enotation.commas(balM)}**`;
        var bankM = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${mentioned}`)
        .setColor("#0xF1C40F")
        .addField("Balance", balM)
        // .addField("Time", message.createdAt)
        message.channel.send(bankM);
    }else{
        var balNM = db.get(`${sender}.balance`)
        balNM = `**${enotation.commas(balNM)}**`;
        var bankNM = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${message.author}`)
        .setColor("#0xF1C40F")
        .addField("Balance", balNM)
        //.addField("Time", message.createdAt)
        message.channel.send(bankNM);
    }
}