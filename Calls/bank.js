exports.run =  async (db, prefix, enotation, message, sender, args, Discord) => {
    let wd = args[0];
    if (wd === "withdraw" || wd === "w"){
        wd = "withdraw";
        var allin = enotation.scientificToDecimal(db.get(`${sender}.bank`));
    }else if (wd === "deposit" || wd === "d"){
        wd = "deposit";
        var allin = enotation.scientificToDecimal(db.get(`${sender}.balance`));
    }else if (wd != NaN && wd != undefined){
        return message.reply(`Please specify whether you are making a deposit (d) or withdraw (w).`)
    }else{
        var balNM = db.get(`${sender}.balance`)
        balNM = `**${enotation.commas(balNM)}**`;
        var bankNM = db.get(`${sender}.bank`)
        bankNM = `**${enotation.commas(bankNM)}**`;
        var bank = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor("#0xF1C40F")
        .addField("Balance", balNM)
        .addField("Bank", bankNM)
        // .addField("Time", message.createdAt)
        return message.channel.send(bank);
    }
    
    var info = new Discord.RichEmbed()
    .setDescription(`Bank Info for: ${sender}`)
    .setColor("#0xd6f50d")
    .addField("Deposit", `${prefix}bank (deposit)/(d) [amount]`)
    .addField("Withdraw", `${prefix}bank (withdraw)/(w) [amount]`)

    if (!args[1]){
        return message.channel.send(info);
    }else if (args[1] == "allin"){
        var amount = allin;
    }else if (args[1].substring(args[1].length-1, args[1].length) == 'm'){
        var amount = parseInt(args[1], 10) * 1000000;
    }else if (args[1].substring(args[1].length-1, args[1].length) == 'k'){
        var amount = parseInt(args[1], 10) * 1000;
    }else{
        var amount = enotation.scientificToDecimal(args[1]);
    } 

    if (amount < 0) return message.reply("Please give a positive amount")
    if (!amount || amount == 0) return message.reply("Please give an amount")

    if (wd === "withdraw" || wd === "w"){
        if (amount > db.get(`${sender}.bank`)) return message.reply("Not enough credits in bank")
        db.add(`${sender}.bank`, -amount)
        db.add(`${sender}.balance`, amount)
    }else if (wd === "deposit" || wd === "d"){
        if (amount > db.get(`${sender}.balance`)) return message.reply("Not enough credits in balance")
        db.add(`${sender}.balance`, -amount)
        db.add(`${sender}.bank`, amount)
    }

    var balNM = db.get(`${sender}.balance`)
    balNM = `**${enotation.commas(balNM)}**`;
    var bankNM = db.get(`${sender}.bank`)
    bankNM = `**${enotation.commas(bankNM)}**`;
    var bank = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor("#0xF1C40F")
        .addField("Balance", balNM)
        .addField("Bank", bankNM)
        // .addField("Time", message.createdAt)
    message.channel.send(bank);
}