exports.run =  async (db, enotation, sender, message, args, maxT, config, Discord) => {
    //if (message.author.id != config.owner && message.author.id != config.admin1 && message.author.id != config.admin2 && message.author.id != config.admin3 && message.author.id != config.admin4) return message.reply("Access Denied"); 
    if(!message.member.roles.get(config.admin) && (message.author.id != config.owner)) return message.reply("Access Denied");
    //maxT = Math;

    let mentioned = args[0];
    if (mentioned == undefined || !(mentioned.substring(1, 2) == '@')) return message.reply("Please mention the player")
    if ((mentioned.substring(2, 3) == '!')) mentioned = "<@" + mentioned.substring(3, mentioned.length)
    if (!db.get(`${mentioned}`)) db.set(`${mentioned}`, {}); //creates a json file for their user if one does not already exist
    if (db.get(`${mentioned}.balance`) == 0) db.add(`${mentioned}.balance`, 0)
    else if (!db.get(`${mentioned}.balance`)) db.add(`${mentioned}.balance`, 1000)

    if (!args[0]){
        return message.reply("Please mention the amount")
    }else if (args[1].substring(args[1].length-1, args[1].length) == 'm'){
        var amount = parseInt(args[1], 10) * 1000000;
    }else if (args[1].substring(args[1].length-1, args[1].length) == 'k'){
        var amount = parseInt(args[1], 10) * 1000;
    }else{
        var amount = enotation.scientificToDecimal(args[1]);
    }    

    amount = parseInt(amount);
    if (!amount || amount == 0) return message.reply("Please give an amount")
    if (amount>maxT && (message.author.id != config.owner) && (message.author.id != config.showmanRoyit)) return message.reply("Decrease amount to less than " + maxT)
    if (amount<-maxT && (message.author.id != config.owner)) return message.reply("Increase amount to more than -" + maxT)

    db.add(`${mentioned}.balance`, amount)
    var balM = db.get(`${mentioned}.balance`)
    balM = `**${enotation.commas(balM)}**`;

    var bank = new Discord.RichEmbed()
        .setDescription(`${sender} gave **${enotation.commas(amount)}** to ${mentioned}`)
        .setColor("#0xF1C40F")
        .addField("Balance", balM)
        // .addField("Time", message.createdAt)
    message.channel.send(bank);
}