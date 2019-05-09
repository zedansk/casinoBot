exports.run =  async (db, delay, deck, enotation, args, message, sender, Discord, prefix) => {
    var winM = 2;
    var wintwentyone = 5;

    var allin = enotation.scientificToDecimal(db.get(`${sender}.balance`));
    var info = new Discord.RichEmbed()
    .setDescription(`Blackjack Info for: ${sender}`)
    .setColor("#0x4a525b")
    .addField("Info",`Game of skill and luck`)
    .addField("Goal",`Achieve a value of 21`)
    .addField("Usage",`${prefix}blackjack [amount]`)

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
    var original = amount;

    if (amount < 0) return message.reply("Please give a positive amount")
    if (!amount || amount == 0) return message.reply("Please give an amount or check your balance")
    if (amount > db.get(`${sender}.balance`)) return message.reply("Not enough credits")
    db.add(`${sender}.balance`, -amount)

    var newDeck = deck.shuffleDeck();
    var AIa = [`${newDeck[0][0]}`, `${newDeck[0][1]}`];
    var AIv = newDeck[1][0] + newDeck[1][1];
    var usera = [`${newDeck[0][25]}`, `${newDeck[0][26]}`];
    var userv = newDeck[1][25] + newDeck[1][26];
    var color = "#0xF1C40F";
        
    var cards = new Discord.RichEmbed()
    .setDescription(`Account Holder: ${sender}`)
    .setColor(color)
    .addField("AI", `${AIa}`)
    .addField("AI", `${AIv}`)
    .addField("User", `${usera}`)
    .addField("User", `${userv}`)
    .setFooter(`use hit or ${prefix}hit, and stand or ${prefix}stand`)

    var m = await message.channel.send(cards);
    var aiuse = 2;
    var useruse = 27;
    var game = "ongoing";
    //changes past games, dont delete this comment
    const filter = a => (a.author.lastMessage.content.toLowerCase().includes("hit" || `${prefix}hit`) || a.author.lastMessage.content.toLowerCase().includes("stand" || `${prefix}stand`)) && a.author.id === sender.id;
    const collector = message.channel.createMessageCollector( filter, {time: 60000 });
    collector.on('collect', async (a) => {
    if (a == "stand" || a ==`${prefix}stand` || a == "Stand" || a ==`${prefix}Stand`){
        while (true){
            
            AIa[AIa.length] = newDeck[0][aiuse];
            AIv += newDeck[1][aiuse];
            aiuse++;

            cards = new Discord.RichEmbed()
            .setDescription(`Account Holder: ${sender}`)
            .setColor(color)
            .addField("AI", `${AIa}`)
            .addField("AI", `${AIv}`)
            .addField("User", `${usera}`)
            .addField("User", `${userv}`)
            m.edit(cards);

            if (AIv>=18){
                game = "stood";
                collector.stop();
                break;
            }
        }
    }

    if (a == "hit" || a == `${prefix}hit` || a == "Hit" || a == `${prefix}Hit`){

        usera[usera.length] = newDeck[0][useruse];
        userv += newDeck[1][useruse];
        useruse++;

        cards = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor(color)
        .addField("AI", `${AIa}`)
        .addField("AI", `${AIv}`)
        .addField("User", `${usera}`)
        .addField("User", `${userv}`)
        .setFooter(`use hit or ${prefix}hit, and stand or ${prefix}stand`)
        m.edit(cards);

        if (userv>21){
            game = "lost";
            collector.stop();
        }
        
    }
    });

    collector.on('end', () => {
        //win/lose/tie statement
    if (game == "stood"){
        if (AIv<userv && userv<=21 && AIv <=21){
            game = "won"
        }else if(AIv>userv && userv<=21 && AIv <=21){
            game = "lost"
        }else if(AIv==userv  && userv<=21 && AIv <=21){
            game = "tie"
        }
    }

    if (game == "won"){
        color = "#0x00FF00";
        if (userv==21){
            amount *= wintwentyone;
        }else{
            amount *= winM;
        }

        db.add(`${sender}.balance`, amount)
        result = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor(color)
        .setTitle("**You Won**")
        .addField("AI", `${AIa}`)
        .addField("AI", `${AIv}`)
        .addField("User", `${usera}`)
        .addField("User", `${userv}`)
        .addField("Profit", `${amount}`)
        return m.edit(result)

    }else if (game == "lost"){
        color = "#0xFF0000";
        result = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor(color)
        .setTitle("**You Lost**")
        .addField("AI", `${AIa}`)
        .addField("AI", `${AIv}`)
        .addField("User", `${usera}`)
        .addField("User", `${userv}`)
        .addField("Loss", `${amount}`)
        return m.edit(result)

    }else if (game == "tie"){
        db.add(`${sender}.balance`, amount)
        var balM = db.get(`${sender}.balance`)
        balM = `**${enotation.commas(balM)}**`;

        result = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor(color)
        .setTitle("**You Tied**")
        .addField("AI", `${AIa}`)
        .addField("AI", `${AIv}`)
        .addField("User", `${usera}`)
        .addField("User", `${userv}`)
        .addField("Tie", `User and Ai both got ${AIv}`)
        return m.edit(result)
    }});
    
}