exports.run =  async (db, enotation, message, args, config, Discord) => {

    if(!message.member.roles.get(config.admin) && (message.author.id != config.owner)) return message.reply("Access Denied");

    let mentioned = args[0];
    if (mentioned == undefined || !(mentioned.substring(1, 2) == '@')) return message.reply("Please mention the player")
    if ((mentioned.substring(2, 3) == '!')) mentioned = "<@" + mentioned.substring(3, mentioned.length)
    if (!db.get(`${mentioned}`)) db.set(`${mentioned}`, {}); //creates a json file for their user if one does not already exist
    if (db.get(`${mentioned}.balance`) == 0) db.add(`${mentioned}.balance`, 0)
    else if (!db.get(`${mentioned}.balance`)) db.add(`${mentioned}.balance`, 1000)

    var zeroBal = -db.get(`${mentioned}.balance`)
    var zeroBank = -db.get(`${mentioned}.bank`)
    db.add(`${mentioned}.balance`, zeroBal)
    db.add(`${mentioned}.bank`, zeroBank)

    var balM = db.get(`${mentioned}.balance`)
    var bankM = db.get(`${mentioned}.bank`)

    balM = `**${enotation.commas(balM)}**`;
    bankM = `**${enotation.commas(bankM)}**`;

    var bank = new Discord.RichEmbed()
        .setDescription(`Account Holder: ${mentioned}`)
        .setColor("#0xF1C40F")
        .addField("Balance", balM)
        .addField("Bank", bankM)
        // .addField("Time", message.createdAt)
    message.channel.send(bank);
}