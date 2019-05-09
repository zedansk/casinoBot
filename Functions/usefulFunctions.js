
//copy mention code for commands that mention a user

/*let mentioned = args[0];
if (mentioned == undefined || !(mentioned.substring(1, 2) == '@')) return message.reply("Please mention the player")
if (!db.get(`${mentioned}`)) db.set(`${mentioned}`, {}); //creates a json file for their user if one does not already exist
if (db.get(`${mentioned}.balance`) == 0) db.add(`${mentioned}.balance`, 0)
else if (!db.get(`${mentioned}.balance`)) db.add(`${mentioned}.balance`, 1000))*/

//checks if its a number

// bool isNumber(string s) 
// { 
//     for (int i = 0; i < s.length(); i++) 
//         if (isdigit(s[i]) == false) 
//             return false; 
  
//     return true; 
// } 

// var allin = enotation.scientificToDecimal(db.get(`${sender}.balance`));
//     if (args[0] == "allin"){
//         var amount = allin;
//     }else if (args[0].substring(args[0].length-1, args[0].length) == 'm'){
//         var amount = parseInt(args[0], 10) * 1000000;
//     }else if (args[0].substring(args[0].length-1, args[0].length) == 'k'){
//         var amount = parseInt(args[0], 10) * 1000;
//     }else{
//         var amount = enotation.scientificToDecimal(args[0]);
//     }   