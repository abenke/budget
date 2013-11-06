define(
[
"libs/accounting"
],
function(accounting) {
    return {
        money: function(amount, decimals) {
            return accounting.formatMoney.call(this, amount, '$', decimals);
        },
    };
});