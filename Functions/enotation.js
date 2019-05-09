module.exports = {
    scientificToDecimal: function (num) {
        //if the number is in scientific notation remove it
        if(/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
            var zero = '0',
                parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
                e = parts.pop(),//store the exponential part
                l = Math.abs(e), //get the number of zeros
                sign = e/l,
                coeff_array = parts[0].split('.');
            if(sign === -1) {
                coeff_array[0] = Math.abs(coeff_array[0]);
                num = '-'+zero + '.' + new Array(l).join(zero) + coeff_array.join('');
            }
            else {
                var dec = coeff_array[1];
                if(dec) l = l - dec.length;
                num = coeff_array.join('') + new Array(l+1).join(zero);
            }
        }
        
        return num;
    },

    decimalToScientific: function (x, f) {
        return Number.parseFloat(x).toExponential(f);
    },

    commas: function(num)
  {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
  }
};
/*
Usage: 
var converted = scientificToDecimal('2.594e40');
console.log(converted);
*/