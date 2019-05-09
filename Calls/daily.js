exports.run =  async (db, enotation, delay, moment, message, sender, Discord) => {
     var dailyR = 5000;
     SdailyR = `**${enotation.commas(dailyR)}**`;
     await delay(1000);
     console.log(db.get(`${sender}.cDaily`))
    if(db.get(`${sender}.cDaily`) != moment().format('L')){
        db.delete(`${sender}.cDaily`)
        db.push(`${sender}.cDaily`, moment().format('L'))
        console.log(db.get(`${sender}.cDaily`))
        db.add(`${sender}.balance`, dailyR)

        var balNM = db.get(`${sender}.balance`)
        balNM = `**${enotation.commas(balNM)}**`;
        var bank = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor("#0xF1C40F")
        .addField("Daily added", SdailyR)
        .addField("Balance", balNM)
        .addField("Time", message.createdAt)
        message.channel.send(bank);
    }else{
        var bank = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor("#0xF1C40F")
        .addField("You have already collected your reward", "You can collect your next reward " + moment().endOf('day').fromNow())
        .addField("Time", message.createdAt)
        message.channel.send(bank);
    } 
}