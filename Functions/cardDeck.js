module.exports = {
    
    shuffleDeck: function () {
        var suit = [':hearts:', ':diamonds:', ':spades:', ':clubs:'];
        var values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
        
        // number of cards in a deck
        var N = 52;
        var temp = 0;
        var returnArray = [];
        returnArray[0] = new Array(N);
        returnArray[1] = new Array(N);

        var cardC = 0;

        for (var i = 0; i < suit.length; i++){
            for (var j = 0; j < values.length; j++){
                returnArray[0][cardC] = `${suit[i]}${values[j]}`;
                cardC++;
            }
        }

        for (var i= 0; i<returnArray[0].length; i++){
            var rPlace = Math.floor(returnArray[0].length*Math.random());
            temp = returnArray[0][i];
            returnArray[0][i]=returnArray[0][rPlace];
            returnArray[0][rPlace]=temp;
        }

        for (var i= 0; i<returnArray[1].length; i++){
            if (returnArray[0][i].includes(values[0])){
                returnArray[1][i] = 1;
            }else if (returnArray[0][i].includes(values[1])){
                returnArray[1][i] = 2;
            }else if (returnArray[0][i].includes(values[2])){
                returnArray[1][i] = 3;
            }else if (returnArray[0][i].includes(values[3])){
                returnArray[1][i] = 4;
            }else if (returnArray[0][i].includes(values[4])){
                returnArray[1][i] = 5;
            }else if (returnArray[0][i].includes(values[5])){
                returnArray[1][i] = 6;
            }else if (returnArray[0][i].includes(values[6])){
                returnArray[1][i] = 7;
            }else if (returnArray[0][i].includes(values[7])){
                returnArray[1][i] = 8;
            }else if (returnArray[0][i].includes(values[8])){
                returnArray[1][i] = 9;
            }else if (returnArray[0][i].includes(values[9])){
                returnArray[1][i] = 10;
            }else if (returnArray[0][i].includes(values[10])){
                returnArray[1][i] = 10;
            }else if (returnArray[0][i].includes(values[11])){
                returnArray[1][i] = 10;
            }else if (returnArray[0][i].includes(values[12])){
                returnArray[1][i] = 10;
            }
        }
        return returnArray;
    }
}