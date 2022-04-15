/** @param {NS} ns */
export async function main(ns) {
       mapNetwork(ns, breakIn) 
}

function breakIn(ns, server)
{
    
    const contracts = ns.ls(server, ".cct")
    if(contracts.length > 0) {
        ns.tprint(`INFO--${server}--`)
        ns.tprint(ns.ls(server, ".cct"))
    }
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
