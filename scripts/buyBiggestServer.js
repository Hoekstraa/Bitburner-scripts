// Obligatory not my code
/** @param {NS} ns */
export async function main(ns) {
    ns.purchaseServer(ns.args[0], Array(30).fill().map((x,i)=>2**(i+1)).filter(x => x <= ns.getPurchasedServerMaxRam()).map(x => [x, ns.getPurchasedServerCost(x)]).filter(x => x[1] <= ns.getServerMoneyAvailable("home")).pop()[0]);
}
