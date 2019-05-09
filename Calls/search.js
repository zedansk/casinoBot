exports.run =  async (db, enotation, message, sender, Discord) => {

    var bal = db.get(`${sender}.balance`)+db.get(`${sender}.bank`)
    if (bal >= 100) return message.reply("You have 100 credits or more")
    var search = Math.round(Math.random() * 100);
    db.add(`${sender}.balance`, search)

    var balM = db.get(`${sender}.balance`)
    balM = `**${enotation.commas(balM)}**`;

    var bank = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${sender}`)
        .setColor("#0xF1C40F")
        .addField("Balance", balM)
        // .addField("Time", message.createdAt)
    message.channel.send(bank);
}