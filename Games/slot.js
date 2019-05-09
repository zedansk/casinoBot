exports.run =  async (db, prefix, delay, args, enotation, message, sender, Discord) => {
    var color = "#0xFF0000"
    var slots = [':french_bread:', ':dollar:', ':money_with_wings:', ':moneybag:', ':gem:', ':goat:'];

    var info = new Discord.RichEmbed()
    .setDescription(`Slot Info for: ${sender}`)
    .setColor("#0x4a525b")
    .addField("Info",`Game of chance`)
    .addField("Goal",`Get 2 of the same symbol, each have different multiplying values`)
    .addField("Values",`${prefix}slot values`)
    .addField("Usage",`${prefix}slot [amount]`)

    var infoSlots = new Discord.RichEmbed()
    .setDescription(`Slot Info for: ${sender}`)
    .setColor("#0xd6f50d")
    .addField(`${slots[0]}${slots[0]}`, "2x")
    .addField(`${slots[0]}:${slots[0]}:${slots[0]}`, "3x")
    .addField(`${slots[1]}${slots[1]}`, "4x")
    .addField(`${slots[1]}:${slots[1]}:${slots[1]}`, "5x")
    .addField(`${slots[2]}${slots[2]}`, "6x")
    .addField(`${slots[2]}:${slots[2]}:${slots[2]}`, "7x")
    .addField(`${slots[3]}${slots[3]}`, "8x")
    .addField(`${slots[3]}:${slots[3]}:${slots[3]}`, "9x")
    .addField(`${slots[4]}${slots[4]}`, "10x")
    .addField(`${slots[4]}:${slots[4]}:${slots[4]}`, "11x")
    .addField(`${slots[5]}:${slots[5]}:${slots[5]}`, "20x")

    var allin = enotation.scientificToDecimal(db.get(`${sender}.balance`));
    if (!args[0]){
        return message.channel.send(info);
    }else if (args[0] == "values"){
        return message.channel.send(infoSlots);
    }else if (args[0] == "allin"){
        var amount = allin;
    }else if (args[0].substring(args[0].length-1, args[0].length) == 'm'){
        var amount = parseInt(args[0], 10) * 1000000;
    }else if (args[0].substring(args[0].length-1, args[0].length) == 'k'){
        var amount = parseInt(args[0], 10) * 1000;
    }else{
        var amount = enotation.scientificToDecimal(args[0]);
    }    
    
    amount = parseInt(amount, 10);
    if (amount < 0) return message.reply("Please give a positive amount")
    if (!amount || amount == 0) return message.channel.send(info);
    if (amount > db.get(`${sender}.balance`)) return message.reply("Not enough credits")
    var original = db.get(`${sender}.balance`);
    db.add(`${sender}.balance`, -amount)

    var multiplier = 1;
    var gameStatement = `**${enotation.commas(amount)}**`;
    var gameHeader = "Loss"
    var slotChoice = [`${slots[Math.floor(Math.random() * (slots.length-1))]}`, `${slots[Math.floor(Math.random() * (slots.length-1))]}`, `${slots[Math.floor(Math.random() * (slots.length-1))]}`]
    var spin = `${slotChoice[0]}|${slotChoice[1]}|${slotChoice[2]}`
    

    //test animation
    const m = await message.channel.send(`Start spin`);
    for(var i = 0; i < slotChoice.length; i++){
        for(var j = 0; j < (Math.floor(Math.random() * slots.length)); j++){
            slotChoice[i] = slots[j];
            spin = `${slotChoice[0]}|${slotChoice[1]}|${slotChoice[2]}`
            var game = new Discord.RichEmbed()
            .setDescription(`Account Holder: ${sender}`)
            .setColor("#0xFFA500")
            .addField("Slot Machine", spin)
            await m.edit(game);
            await delay(50);
        }
    }

    if (slotChoice[0] === slotChoice[2] || slotChoice[1] === slotChoice[2] || slotChoice[0] === slotChoice[1]) {
        color = "#0x00FF00"
        if(slotChoice[0] == slots[0] || slotChoice[1] == slots[0] || slotChoice[2] == slots[0]){
            multiplier = 2;
            if (slotChoice[0] === slotChoice[1] && slotChoice[0] === slotChoice[2]) multiplier += 1;
            amount *= multiplier;
        }else if(slotChoice[0] == slots[1] || slotChoice[1] == slots[1] || slotChoice[2] == slots[1]){
            multiplier = 4;
            if (slotChoice[0] === slotChoice[1] && slotChoice[0] === slotChoice[2]) multiplier += 1;
            amount *= multiplier;
        }else if(slotChoice[0] == slots[2] || slotChoice[1] == slots[2] || slotChoice[2] == slots[2]){
            multiplier = 6;
            if (slotChoice[0] === slotChoice[1] && slotChoice[0] === slotChoice[2]) multiplier += 1;
            amount *= multiplier;
        }else if(slotChoice[0] == slots[3] || slotChoice[1] == slots[3] || slotChoice[2] == slots[3]){
            multiplier = 8;
            if (slotChoice[0] === slotChoice[1] && slotChoice[0] === slotChoice[2]) multiplier += 1;
            amount *= multiplier;
        }else if(slotChoice[0] == slots[4] || slotChoice[1] == slots[4] || slotChoice[2] == slots[4]){
            multiplier = 10;
            if (slotChoice[0] === slotChoice[1] && slotChoice[0] === slotChoice[2]) multiplier += 1;
            amount *= multiplier;
        }else if(slotChoice[0] == slots[5] && (slotChoice[0] === slotChoice[2] && slotChoice[0] === slotChoice[1])){
            multiplier = 20;
            amount *= multiplier;
        }
        db.add(`${sender}.balance`, amount)
        var local = db.get(`${sender}.balance`)
        gameHeader = "Profit"
    }
    var balM = db.get(`${sender}.balance`)
    profit = `**${enotation.commas(balM-original)}**`
    balM = `**${enotation.commas(balM)}**`;

    var bank = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor(color)
        .addField("Slot Machine", spin)
        .addField(gameHeader, profit)
        .addField("Balance", balM)
    m.edit(bank);
}
