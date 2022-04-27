/** @param {NS} ns */
export async function main(ns) {
        const destination = ns.args[0]
        if(ns.args.length == 0) {
            ns.tprint("Give a destination as the first argument.")
            ns.exit()
        }
        const network = nmap(ns, "home")
        
        /**
         * Return a list of nodes to connect to in order to reach destination
         */
        function chaseOrigin(ns, network, destination, networkPath = []) {
            if(destination == "home") return networkPath
            else return chaseOrigin(
                ns,
                network,
                network.get(destination).origin,
                [destination, ...networkPath]
            )
        }

        const x = chaseOrigin(ns, network, destination)
        .map(str => `connect ${str}; `)
        .reduce( (str1, str2) => str1.concat(str2), "")
        
        ns.tprint("INFO ", x)
        navigator.clipboard.writeText(x)
}

function getServerData(ns, server, origin){
    let s = {}
    s.connections = ns.scan(server).filter(server => server != origin)
    s.origin = origin
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

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
}
