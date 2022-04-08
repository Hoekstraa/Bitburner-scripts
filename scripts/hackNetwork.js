/** @param {NS} ns */
export async function main(ns) {
       mapNetwork(ns, breakIn) 
}

function breakIn(ns, server)
{
    ns.tprint(server)

    try {ns.brutessh(server)} catch{}
    try {ns.ftpcrack(server)} catch{}
    try {ns.relaysmtp(server)} catch{}
    try {ns.sqlinject(server)} catch{}
    try {ns.httpworm(server)} catch{}
    try {ns.nuke(server)} catch{}
    try {ns.installBackdoor(server)} catch {}
}

function mapNetwork(ns, func){
    const network = new Map(JSON.parse(ns.read("/data/nmap.txt")))

    function map(func, currentServer = "home"){
        const connectedServers = network.get(currentServer)
        for(const server of connectedServers)
        {
            func(ns, server)
            map(func, server)
        }
    }

    map(func)
}
