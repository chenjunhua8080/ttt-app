/*自动补0*/
function addzero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

module.exports = {
    addzero: addzero
}