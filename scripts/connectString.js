/** @param {NS} ns */
export async function main(ns) {
        const destination = ns.args[0]
        if(ns.args.length == 0) {
            ns.tprint("Give a destination as the first argument.")
            ns.exit()
        }
        const network = new Map(JSON.parse(ns.read("/data/nmapv2.txt")))
        
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
        //ns.tprint(x)
        navigator.clipboard.writeText(x)
}

export function autocomplete(data, args) {
    return [...data.servers]; // This script autocompletes the list of servers.
}
