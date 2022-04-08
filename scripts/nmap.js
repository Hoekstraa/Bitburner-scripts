/** @param {NS} ns */
export async function main(ns) {
    ns.write("/data/nmap.txt", JSON.stringify([...nmap(ns, "home")]), "w")
}

function nmap(ns, server, origin = ""){
    // Scan surroundings (relative depth lvl 0)
    const localMap = new Map([[server, ns.scan(server).filter(server => server != origin)]])
    // Scan surroundings of all servers in the direct surroundings (relative depth lvl 1)
    const deeperMap = localMap.get(server)
                              .map(s => nmap(ns, s, server))
                              .reduce((a,b) => unionMap(a,b), new Map())
    // Put results of both together, return.
    return unionMap(deeperMap, localMap)
}

function unionMap(mapA, mapB)
{
    return new Map([...mapA, ...mapB]) 
}
