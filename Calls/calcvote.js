exports.run =  async (message, args) => {
    // get the count, as an actual number.
    var count = parseInt(args[0], 10);
    var i = 2;
    var j = 3;
    if(!count){
    return message.reply("Please provide amount of votes");
    }else if (args[0].substring(1, 2) == 'e'){
    var before = args[0].substring(0, 1);
    var e = args[0].substring(2, args[0].length);
    return message.reply(`${(before*Math.pow(10,e))/150000}`); 
    }else if (args[0].substring(1, 2) == '.') {
    while (!(args[0].substring(i, j) == 'e')){
        i++;
        j++;
        if (j>1000 || i>1000) return message.reply(`${(count/150000)}`);
    }
    var newc = args[0].substring(0, 1) + '.' + (args[0].substring(2, j-1));
    var expon = args[0].substring(j, args[0].length);
    return message.reply(`${(newc*Math.pow(10,expon))/150000}`);
    }else{
    return message.reply(`${(count/150000)}`); 
    }
}