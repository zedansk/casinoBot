exports.run =  async (db, enotation, args, message, delay, sender, Discord, prefix) => {
    var maxCrash = 10;
    var profit = 0;

    var info = new Discord.RichEmbed()
    .setDescription(`Crash Info for: ${sender}`)
    .setColor("#0x4a525b")
    .addField("Info",`Game of luck and timing`)
    .addField("Goal",`Stop before the randomly generated number`)
    .addField("Usage",`${prefix}crash [amount]`)
    .addField("Stop", `use stop, s, ${prefix}stop or ${prefix}s to stop`)

    var allin = enotation.scientificToDecimal(db.get(`${sender}.balance`));
    if (!args[0]){
        return message.channel.send(info);
    }else if (args[0] == "allin"){
        var amount = allin;
        profit = "allin"
    }else if (args[0].substring(args[0].length-1, args[0].length) == 'm'){
        var amount = parseInt(args[0], 10) * 1000000;
    }else if (args[0].substring(args[0].length-1, args[0].length) == 'k'){
        var amount = parseInt(args[0], 10) * 1000;
    }else{
        var amount = enotation.scientificToDecimal(args[0]);
    } 

    amount = parseInt(amount, 10);
    var original = db.get(`${sender}.balance`);

    if (amount < 0) return message.reply("Please give a positive amount")
    if (!amount || amount == 0) return message.reply("Please give an amount or check your balance")
    if (amount > db.get(`${sender}.balance`)) return message.reply("Not enough credits")
    db.add(`${sender}.balance`, -amount)

    var rand = (Math.random() * maxCrash);
    rand = rand.toFixed(1);
    console.log(rand)

    var local = 1;
    const m = await message.channel.send(`Begin crash; Use stop, s, ${prefix}stop or ${prefix}s to stop`);
    while (local < rand){
        
        var game = new Discord.RichEmbed()
        .setDescription(`Crash user: ${sender}`)
        .setColor("#0xF1C40F")
        .addField("Multiplier", `${(Math.round(local *10)/10)}x`)
        .addField("Profit", `**${enotation.commas(Math.round(amount * local *10)/10)}**`)
        .setFooter(`use stop, s, ${prefix}stop or ${prefix}s to stop`)
        await m.edit(game);

        var stop = message.author.lastMessage.content.toLowerCase();
        if (stop == `${prefix}s` || stop == `${prefix}stop` || stop == 'stop' || stop == 's'){
            amount = Math.round(amount * local *10)/10;
            db.add(`${sender}.balance`, amount)
            var balM = db.get(`${sender}.balance`)
            profit = `**${enotation.commas(balM-original)}**`
            balM = `**${enotation.commas(balM)}**`;

            var Wgame = new Discord.RichEmbed() //win
            .setDescription(`Crash user: ${sender}`)
            .setColor("#0x00FF00")
            .addField("Stopped at", `${local}x`)
            .addField("Profit", profit)
            .addField("Balance", balM)            
            m.edit(Wgame);
            break;
        }else{
            local += 0.2;
            local = Math.round(local*10)/10;
            await delay(1000);
        }
    }
    if (local>=rand){

    var balM = db.get(`${sender}.balance`)
    profit = `**${enotation.commas(balM-original)}**`
    balM = `**${enotation.commas(balM)}**`;

    var Lgame = new Discord.RichEmbed() //lose
    .setDescription(`Crash user: ${sender}`)
    .setColor("#0xFF0000")
    .addField("Crashed at", `${local}x`)
    .addField("Loss", profit)
    .addField("Balance", balM)
    .setFooter(`Better luck next time`)
    m.edit(Lgame);
    }
}