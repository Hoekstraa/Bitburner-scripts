/** @param {NS} ns */
export async function main(ns) {
    const targServer = ns.args[0]
    const execServer = ns.args[1]
    const securityMin = ns.getServerMinSecurityLevel(targServer) + 5
    const moneyMin = ns.getServerMaxMoney(targServer) * 0.75

    await ns.scp("/scripts/batchWeaken.js", execServer)
    await ns.scp("/scripts/batchGrow.js", execServer)
    await ns.scp("/scripts/batchHack.js", execServer)

    while (true) {

        if (ns.getServerSecurityLevel(targServer) > securityMin) {
            weaken(ns, securityMin, execServer, targServer)
            await ns.sleep(ns.getWeakenTime(targServer))
        }
        else if (ns.getServerMoneyAvailable(targServer) < moneyMin) {
            grow(ns, execServer, targServer)
            await ns.sleep(ns.getGrowTime(targServer))
        }
        else {
            hack(ns, execServer, targServer)
            await ns.sleep(ns.getHackTime(targServer))
        }

        await ns.sleep(50)
    }
}

function weaken(ns, securityMin, execServer, targServer) {
    const weakenThreadCount = calcWeakenThreadsNeeded(ns, securityMin, execServer, targServer)
    ns.exec("/scripts/batchWeaken.js", execServer, weakenThreadCount, targServer, 0)
}
function grow(ns, execServer, targServer) {
    const growThreadCount = calcGrowThreadsNeeded(ns, execServer, targServer)
    ns.exec("/scripts/batchGrow.js", execServer, growThreadCount, targServer, 0)
}
function hack(ns, execServer, targServer) {
    ns.exec("/scripts/batchHack.js", execServer, 20, targServer, 0)
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
    const threadsNeeded = ns.growthAnalyze(targServer, Math.ceil(maxMoney / currMoney))
    const maxThreadsAvailable = (ns.getServerMaxRam(execServer) - ns.getServerUsedRam(execServer)) / ns.getScriptRam("/scripts/batchGrow.js")

    return Math.min(threadsNeeded, maxThreadsAvailable)
}
