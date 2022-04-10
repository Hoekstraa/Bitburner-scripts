/** @param {NS} ns */
export async function main(ns) {
    ns.write("/data/nmapv2.txt", JSON.stringify([...nmap(ns, "home")]), "w")
}

function getServerData(ns, server, origin){
    let s = ns.getServer(server)
    s.connections = ns.scan(server).filter(server => server != origin)
    return s
}

function nmap(ns, server, origin = ""){
    // Scan surroundings (relative depth lvl 0)
    const localMap = new Map([[server, getServerData(ns, server, origin)]])
    // Scan surroundings of all servers in the direct surroundings (relative depth lvl 1)
    const deeperMap = localMap.get(server).connections
                              .map(s => nmap(ns, s, server))
                              .reduce((a,b) => unionMap(a,b), new Map())
    // Put results of both together, return.
    return unionMap(deeperMap, localMap)
}

function unionMap(mapA, mapB)
{
    return new Map([...mapA, ...mapB]) 
}

