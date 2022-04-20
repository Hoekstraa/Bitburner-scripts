/** @param {NS} ns */
export async function main(ns) {
    const targServer = ns.args[0]
    const execServer = ns.args[1]
    const securityMin = ns.getServerMinSecurityLevel(targServer) + 5
    const moneyMin = ns.getServerMaxMoney(targServer) * 0.75
    const buffer = 250

    await ns.scp("/scripts/batchWeaken.js", execServer)
    await ns.scp("/scripts/batchGrow.js", execServer)
    await ns.scp("/scripts/batchHack.js", execServer)


    // PREP
    await reset(ns, securityMin, moneyMin, buffer, targServer, execServer)

    // BATCHER
    while (true){

        const ramNeed = ns.getScriptRam("/scripts/batchGrow.js") +
                      ns.getScriptRam("/scripts/hackGrow.js") +
                      ns.getScriptRam("/scripts/batchGrow.js") * 2
        
        if (ramNeed > ns.getServerMaxRam(execServer)){
            ns.toast(`${ns.getScriptName()}`, "warning", 4000)
            await ns.sleep(20000)
        }

        //HWGW
        const weaken1StartDelay = 0
        const hackStartDelay    = ns.getWeakenTime(targServer) - buffer - ns.getHackTime(targServer)
        const weaken2StartDelay = buffer * 2 
        const growStartDelay    = ns.getWeakenTime(targServer) + buffer - ns.getGrowTime(targServer) 
        const endOfBatch = ns.getWeakenTime(targServer) + buffer * 2;

        weaken(ns, securityMin, execServer, targServer, weaken1StartDelay)
        hack(ns, execServer, targServer, hackStartDelay)
        weaken(ns, securityMin, execServer, targServer, weaken2StartDelay)
        grow(ns, execServer, targServer, growStartDelay)

        await ns.sleep(endOfBatch + buffer * 2)
    }
}

async function reset(ns, securityMin, moneyMin, buffer, targServer, execServer){
    while (true) {
        if (ns.getServerMoneyAvailable(targServer) < moneyMin) {
            grow(ns, execServer, targServer, 0)
            await ns.sleep(ns.getGrowTime(targServer))
        }
        else if (ns.getServerSecurityLevel(targServer) > securityMin) {
            weaken(ns, securityMin, execServer, targServer, 0)
            await ns.sleep(ns.getWeakenTime(targServer))
        }
        else
            break

        await ns.sleep(buffer)
    }
}

function weaken(ns, securityMin, execServer, targServer, delay) {
    const weakenThreadCount = calcWeakenThreadsNeeded(ns, securityMin, execServer, targServer)
    if(weakenThreadCount == 0) return(0);
    ns.exec("/scripts/batchWeaken.js", execServer, weakenThreadCount, targServer, delay)
}
function grow(ns, execServer, targServer, delay) {
    const growThreadCount = calcGrowThreadsNeeded(ns, execServer, targServer)
    if(growThreadCount == 0) return (0);
    ns.exec("/scripts/batchGrow.js", execServer, growThreadCount, targServer, delay)
}
function hack(ns, execServer, targServer,delay) {
    const maxThreadsAvailable = (ns.getServerMaxRam(execServer) - ns.getServerUsedRam(execServer)) / ns.getScriptRam("/scripts/batchHack.js")
    const threads = Math.min(20, maxThreadsAvailable)
    ns.exec("/scripts/batchHack.js", execServer, threads, targServer, delay)
}

function calcWeakenThreadsNeeded(ns, securityMin, execServer, targServer) {
    const securityCurr = ns.getServerSecurityLevel(targServer)
    const maxThreadsAvailable = (ns.getServerMaxRam(execServer) - ns.getServerUsedRam(execServer)) / ns.getScriptRam("/scripts/batchWeaken.js")
    
    let threadsNeeded = 0
    while (ns.weakenAnalyze(threadsNeeded) <= securityCurr - securityMin)
        threadsNeeded++

    return Math.min(threadsNeeded, maxThreadsAvailable)
}

function calcGrowThreadsNeeded(ns, execServer, targServer) {
    const maxMoney = ns.getServerMaxMoney(targServer)
    const currMoney = ns.getServerMoneyAvailable(targServer)
    const moneyDiff = Math.ceil(maxMoney / (currMoney == 0? 1 : currMoney))
    const threadsNeeded = ns.growthAnalyze(targServer, moneyDiff == 0? 1: moneyDiff)
    const maxThreadsAvailable = (ns.getServerMaxRam(execServer) - ns.getServerUsedRam(execServer)) / ns.getScriptRam("/scripts/batchGrow.js")

    return Math.min(threadsNeeded, maxThreadsAvailable)
}
