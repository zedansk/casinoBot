exports.run =  async (db, delay, enotation, args, message, sender, Discord, prefix) => {

    var color = "#0xF1C40F";
    var heads = "http://www.virtualcointoss.com/img/quarter_front.png";
    var tails = "http://www.virtualcointoss.com/img/quarter_back.png";

    var allin = enotation.scientificToDecimal(db.get(`${sender}.balance`));
    var info = new Discord.RichEmbed()
    .setDescription(`Coinflip Info for: ${sender}`)
    .setColor("#0x4a525b")
    .addField("Info",`Game of luck`)
    .addField("Goal",`Guess whether the coin lands on heads or tails`)
    .addField("Usage",`${prefix}flip [amount] or ${prefix}coinflip [amount]`)

    var allin = enotation.scientificToDecimal(db.get(`${sender}.balance`));
    if (!args[0]){
        return message.channel.send(info);
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
    var original = db.get(`${sender}.balance`);

    if (amount < 0) return message.reply("Please give a positive amount")
    if (!amount || amount == 0) return message.reply("Please give an amount or check your balance")
    if (amount > db.get(`${sender}.balance`)) return message.reply("Not enough credits")
    db.add(`${sender}.balance`, -amount)

    
    var game = new Discord.RichEmbed()
    .setDescription(`Account Holder: ${sender}`)
    .setColor(color)
    .setFooter(`use heads or tails`)
    var counter = 1;
    var win;

    var rand = Math.round(Math.random() + 1);
    console.log(rand)

    var m = await message.channel.send(game);
    while (true){
        // waits for heard or tails
        var cHeads = message.author.lastMessage.content.toLowerCase().includes(`heads`);
        var cTails = message.author.lastMessage.content.toLowerCase().includes(`tails`); 

        if (cHeads){
            console.log(cHeads)

            color = "#0xFF0000";
            if (rand == 1){
                color = "#0x00FF00";
                db.add(`${sender}.balance`, 2 * amount)
            }
            break;
        }else if (cTails){
            console.log(cTails)

            color = "#0xFF0000";
            if (rand == 2){
                color = "#0x00FF00";
                db.add(`${sender}.balance`, 2 * amount)
            }
            
            break;
        } 

        await delay(1000);
        counter++;

    }

    //assurance
    if(rand == 1){
        choice = heads;
    }else if(rand == 2){
        choice = tails;
    }

    //calculates profit
    var balM = db.get(`${sender}.balance`)
    profit = `**${enotation.commas(balM-original)}**`
    //balM = `**${enotation.commas(balM)}**`;

    //last edit
    game = new Discord.RichEmbed()
    .setDescription(`Account Holder: ${sender}`)
    .setColor(color)
    .setThumbnail(choice)
    .addField("Profit", profit)
    m.edit(game)


}