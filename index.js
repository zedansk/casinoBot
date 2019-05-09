var Discord = require("discord.js");
var config = require("./Package/config.json");
var ms = require('ms')
var fs = require('fs');
var csv = require('fast-csv');
var sleep = require('sleep');
var moment = require('moment');
var db = require('quick.db');
var delay = require('delay');
var enotation = require('./Functions/enotation.js');
var deck = require('./Functions/cardDeck.js');


var client = new Discord.Client({forceFetchUsers: true});
var prefix = config.prefix;
var startBank = config.bankRoll;
var allUsers = config.allUsers;
var talkedRecently = new Set();
var gifts = new Set(); //gifts
var maxT = config.maxTransfer;
var maxBal = config.maxBalance
var csvStream;

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guild(s).`); 
    console.log(`Economy Launched...`); 
    client.user.setPresence({
        game: { 
            name: `${prefix}help | ${client.guilds.size} guilds`,
            type: 'WATCHING'
        },
        status: "online"
    })
});
  
client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`${prefix}help | ${guild.client.guilds.size} guilds`);
});
  
client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`${prefix}help | ${guild.client.guilds.size} guilds`);
});
  
client.on("guildMemberAdd", GuildMember => {
    console.log(`${GuildMember.user} joined`);
});

client.on("guildMemberRemove", GuildMember => {
    console.log(`${GuildMember.user} left`);
});

client.on("message", async message => {

    //no bots or non prefix
    if ((message.author.bot) || (message.content.indexOf(prefix) !== 0)) return;
    //returns those who talk recently
    if (message.content != "%s" && message.content != "%crash" && talkedRecently.has(message.author.id)) return message.reply(`Please wait 2 second`);
    // Adds the user to the set so that they can't talk for 1 second
    talkedRecently.add(message.author.id);
    setTimeout(() => {talkedRecently.delete(message.author.id);}, 2000);

    //Needs certain permissions
    if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;

    // Log chat to console for debugging/testing    
    console.log(`${(message.author.username)}: ${(message.content)}`);
    
    //Events
    //if (message.member.nickname != null) return message.reply("Reset your nickname")
    let sender = message.author;
 
    // Setting an object in the database:
    if (!db.get(`${sender}`)) db.set(`${sender}`, {}); //creates a file
    //balance
    if (db.get(`${sender}.balance`) == 0) db.add(`${sender}.balance`, 0)
    else if (!db.get(`${sender}.balance`)) db.add(`${sender}.balance`, startBank)
    //bank
    if (db.get(`${sender}.bank`) == 0) db.add(`${sender}.bank`, 0)
    else if (!db.get(`${sender}.bank`)) db.add(`${sender}.bank`, 0)
    //daily
    if (!db.get(`${sender}.cDaily`)) db.push(`${sender}.cDaily`, 'Not Collected')
    //max
    if (db.get(`${sender}.balance`) >= maxBal || db.get(`${sender}.balance`) == null) return message.reply(`DM Entropy#9919`);
    if (db.get(`${sender}.bank`) >= maxBal || db.get(`${sender}.bank`) == null) return message.reply(`DM Entropy#9919`);

    
    //args
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
   
    
    // commands
    if (command === "help") { // creates a command $help
        let help = require("./Calls/help.js");
        help.run(message, args, config, prefix, Discord);
    }

    //info
    if (command === "info") { // creates the command *info
        message.channel.send(`Hey! I am a the casino bot and I'm here to steal your time! You can do ${prefix}help to see my commands! If you have any problems with me, report it in support server and do not ping owner!`) // gives u info
    }

    //say
    if(command === "say") {
        if(!message.member.roles.get(config.admin) && (message.author.id != config.owner)) return message.reply("Access Denied");
        const sayMessage = args.join(" ");
        message.delete().catch(net=>{}); 
        message.channel.send(sayMessage);
    }

    //ping
    if(command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    } 

    //test
    if(command === "test") { //test
        
    }
    

    //calcvote
    if(command === "calcvote" || command === "calvote" || command === "votecalc" || command === "votecal") {
        let calcvote = require("./Calls/calcvote.js");
        calcvote.run(message, args);
    }

    //balance
    if (command === "balance" || command === "credits") {
        let balance = require("./Calls/balance.js");
        balance.run(message, args, enotation, db, sender, Discord);
    }

    //bank
    if (command === "bank" ){
        let bank = require("./Calls/bank.js");
        bank.run(db, prefix, enotation, message, sender, args, Discord);
    }

    //top
    if (command === "top" || command === "leaderboard"){
        let leaderboard = require("./Calls/leaderboard.js");
        leaderboard.run(db, args, config, client, prefix, enotation, message, Discord);
    }

    //search
    if (command === "search" || command === "steal") {
        let search = require("./Calls/search.js");
        search.run(db, enotation, message, sender, Discord);
    }

    //give
    if (command === "give") {
        let give = require("./Calls/give.js");
        give.run(db, enotation, sender, message, args, maxT, config, Discord);
    }

    //reset
    if (command === "reset") {
        let reset = require("./Calls/reset.js");
        reset.run(db, enotation, message, args, config, Discord);
    }

    //max
    if (command === "max") {
        let max = require("./Calls/max.js");
        max.run(db, message, args, enotation, config, maxBal, Discord);
    }

    // transfer
    if (command === "transfer") {
        let transfer = require("./Calls/transfer.js");
        transfer.run(db, enotation, message, sender, args, maxT, Discord);
    }

    // Example: Getting a daily reward
    if (command === "daily") {
        let daily = require("./Calls/daily.js");
        daily.run(db, enotation, delay, moment, message, sender, Discord);
    }

    // Example: Getting a vote reward
    if (command === "vote") {
        let vote = require("./Calls/vote.js");
        vote.run(message);
    }

    //GAMES

    //guess
    if (command === "guess") {
        let guess = require("./Games/guess.js");
        guess.run(db, prefix, enotation, args, message, sender, Discord);
    }
    //crash
    if (command === "crash") { // creates the command *info
        let crash = require("./Games/crash.js");
        crash.run(db, enotation, args, message, delay, sender, Discord, prefix);
    }
    //slot
    if (command === "slot") { // creates the command *info
        let slot = require("./Games/slot.js");
        slot.run(db, prefix, delay, args, enotation, message, sender, Discord);
    }
    //blackjack
    if (command === "blackjack") { // creates the command *info
        let blackjack = require("./Games/blackjack.js");
        blackjack.run(db, delay, deck, enotation, args, message, sender, Discord, prefix);
    }
    //snakes and ladders
    if (command === "flip" || command === "coinflip") { // creates the command *info
        let flip = require("./Games/coinflip.js");
        flip.run(db, delay, enotation, args, message, sender, Discord, prefix);
    }

    //Gifts
    //jaylen-creator of icon
    if(command === "jaylen") { //present
        if (message.author.id == "423188962325299215"){
        db.add(`${sender}.balance`, 1000000000)
        message.reply("Thank You")
        }
    }

    //gift for each member
    if(command === "gift") { //present
        const max32val = 2147483647;
        const gift = 2500000000;
        if (!gifts.has(message.author.id)){
            db.add(`${sender}.balance`, gift)
            message.reply(`collected gift of **${enotation.commas(gift)}**; check your balance`)
        } 
        if (gifts.has(message.author.id)) message.reply("Already collected your gift")
        gifts.add(message.author.id);
        setTimeout(() => {gifts.delete(message.author.id);}, max32val);
    }  

});
  
//error handles
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
client.on('debug', (e) => console.info(e));

//necessary 
client.login(config.token)