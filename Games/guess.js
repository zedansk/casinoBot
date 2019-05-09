exports.run =  async (db, prefix, enotation, args, message, sender, Discord) => {
    var win = false;
    var color = "#0xFF0000"

    var info = new Discord.RichEmbed()
    .setDescription(`Guess Info for: ${sender}`)
    .setColor("#0x4a525b")
    .addField("Info",`Game of luck`)
    .addField("Goal",`Guess the randomly generated number or whether it is even/odd`)
    .addField("Usage",`${prefix}guess [amount] [odd; defaults to 10]`)
    .addField("Respond",`0-odd (defaults to 10) or even/odd`)

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
    
    if (amount < 0) return message.reply("Please give a positive amount")
    if (!amount || amount == 0) return message.reply("Please give an amount")
    if (amount > db.get(`${sender}.balance`)) return message.reply("Not enough credits")
    db.add(`${sender}.balance`, -amount)

    let odds = enotation.scientificToDecimal(args[1]);
    odds = parseInt(odds, 10);
    if (odds < 10 || isNaN(odds)) odds = 10;
    var multiplier = Math.round(odds/2);

    var rand = Math.round(Math.random() * odds);

    var cards = new Discord.RichEmbed()
    .setDescription(`Account Holder: ${sender}`)
    .setColor("#0x231543")
    .addField("Description",`Pick a number between 0 and ${odds} or even/odd; You have 30 seconds`)

    var m = await message.channel.send(cards);

    console.log(`${sender.username}, the answer is ${rand}`)
    //reads wrong
    const filter = a => (a.author.lastMessage.content.includes("odd" || `${prefix}odd`) || a.author.lastMessage.content.includes("even" || `${prefix}even`) || !isNaN(a.author.lastMessage.content)) && a.author.id === sender.id;
    const collector = message.channel.createMessageCollector( filter, {time: 30000});
   
    collector.on('collect', async (a) => {

        if (!isNaN(a)){
        var gameStatement = `Sorry, you lost ${amount} credits, the number was ${rand}`;
        let choice = a;
   
        choice = enotation.scientificToDecimal(choice);
        choice = parseInt(choice, 10);
        if (choice == rand){
            win = true;
            color = "#0x00FF00"
        } 

        if (win == true){
            amount *= multiplier;
            db.add(`${sender}.balance`, amount)
            gameStatement = `Congrats, you won ${amount} credits, the number was ${rand}`;
        }

        var balG = db.get(`${sender}.balance`)
        balG = `**${enotation.commas(balG)}**`;
        
        var balanceE = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor(color)
        .addField("Balance", balG)
        .addField("Statement", gameStatement)
        message.channel.send(balanceE);
        collector.stop();

    }
    if (a == "odd" || a == `${prefix}odd` || a == "even" || a == `${prefix}even`){
        var resulteo = "ongoing";
        multiplier = 2;
        color = "#0xFF0000";
        var balG;
        var retS;
        var oddeven = "null"
        if (rand % 2 == 1) oddeven = "**Odd**"
        if (rand % 2 == 0) oddeven = "**Even**"

        if (a == "odd" || a ==`${prefix}odd`){
            if (rand % 2 == 1) resulteo = "win"
            else  resulteo = "lose"
        }else if (a == "even" || a ==`${prefix}even`){
            if (rand % 2 == 0) resulteo = "win" 
            else resulteo = "lose"
        }

        if (resulteo == "win"){
            color = "#0x00FF00"
            amount *= multiplier;
            db.add(`${sender}.balance`, amount)
            sAmount = `**${enotation.commas(amount)}**`

            balG = db.get(`${sender}.balance`)
            balG = `**${enotation.commas(balG)}**`;

            retS = new Discord.RichEmbed()
            .setDescription(`Account Holder: ${sender}`)
            .setColor(color)
            .addField("Answer", oddeven)
            .addField("Profit", sAmount)
            .addField("Balance", balG)

            return m.edit(retS)

        }else if(resulteo == "lose"){
            color = "#0xFF0000"

            balG = db.get(`${sender}.balance`)
            balG = `**${enotation.commas(balG)}**`;
            sAmount = `**${enotation.commas(amount)}**`

            retS = new Discord.RichEmbed()
            .setDescription(`Account Holder: ${sender}`)
            .setColor(color)
            .addField("Answer", oddeven)
            .addField("Loss", sAmount)
            .addField("Balance", balG)
            collector.stop();
            return m.edit(retS)
        }
    }});
    
    collector.on('end', () => {

    });
    
}