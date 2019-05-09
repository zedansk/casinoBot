exports.run =  async (db, enotation, message, sender, args, maxT, Discord) => {

    let mentioned = args[0];
    if (mentioned == undefined || !(mentioned.substring(1, 2) == '@')) return message.reply("Please mention the player")
    if ((mentioned.substring(2, 3) == '!')) mentioned = "<@" + mentioned.substring(3, mentioned.length)
    if (!db.get(`${mentioned}`)) db.set(`${mentioned}`, {}); //creates a json file for their user if one does not already exist
    if (db.get(`${mentioned}.balance`) == 0) db.add(`${mentioned}.balance`, 0)
    else if (!db.get(`${mentioned}.balance`)) db.add(`${mentioned}.balance`, 1000)

    if (args[1].substring(args[1].length-1, args[1].length) == 'm'){
        var amount = parseInt(args[1], 10) * 1000000;
    }else if (args[1].substring(args[1].length-1, args[1].length) == 'k'){
        var amount = parseInt(args[1], 10) * 1000;
    }else{
        var amount = enotation.scientificToDecimal(args[1]);
    }    
    
    amount = parseInt(amount, 10);
    if (!amount || amount == 0) return message.reply("Please give an amount")
    if (amount<0) return message.reply("Please give a positive amount")
    if (amount>maxT) return message.reply("Decrease amount to less than " + maxT)
    if (amount > db.get(`${sender}.balance`)) return message.reply("Not enough credits")

    db.add(`${sender}.balance`, -amount)
    db.add(`${mentioned}.balance`, amount)

    var balM = db.get(`${mentioned}.balance`)
    balM = `**${enotation.commas(balM)}**`;

    var bank = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${mentioned}`)
        .setColor("#0xF1C40F")
        .addField("Balance", balM)
        // .addField("Time", message.createdAt)
    message.channel.send(bank);
}
