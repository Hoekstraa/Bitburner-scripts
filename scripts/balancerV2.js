/** @param {NS} ns */
export async function main(ns) {
    const targServer = ns.args[0]
    const execServer = ns.args[1]
    const securityMin = ns.getServerMinSecurityLevel(targServer) + 5
    const moneyMin = ns.getServerMaxMoney(targServer) * 0.75

    await ns.scp("/scripts/weaken.js", execServer)
    await ns.scp("/scripts/grow.js", execServer)
    await ns.scp("/scripts/hack.js", execServer)

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
    ns.exec("/scripts/weaken.js", execServer, weakenThreadCount, targServer)
}
function grow(ns, execServer, targServer) {
    const growThreadCount = calcGrowThreadsNeeded(ns, execServer, targServer)
    ns.exec("/scripts/grow.js", execServer, growThreadCount, targServer)
}
function hack(ns, execServer, targServer) {
    const maxThreadsAvailable = (ns.getServerMaxRam(execServer) - ns.getServerUsedRam(execServer)) / ns.getScriptRam("/scripts/weaken.js")
    const threads = Math.min(20, maxThreadsAvailable)
    ns.exec("/scripts/hack.js", execServer, threads, targServer)
}

function calcWeakenThreadsNeeded(ns, securityMin, execServer, targServer) {
    const securityCurr = ns.getServerSecurityLevel(targServer)
    const maxThreadsAvailable = (ns.getServerMaxRam(execServer) - ns.getServerUsedRam(execServer)) / ns.getScriptRam("/scripts/weaken.js")
    
    let threadsNeeded = 0
    while (ns.weakenAnalyze(threadsNeeded) <= securityCurr - securityMin)
        threadsNeeded++

    return Math.min(threadsNeeded, maxThreadsAvailable)
}

function calcGrowThreadsNeeded(ns, execServer, targServer) {
    const maxMoney = ns.getServerMaxMoney(targServer)
    const currMoney = ns.getServerMoneyAvailable(targServer)
    const threadsNeeded = ns.growthAnalyze(targServer, Math.ceil(maxMoney / (currMoney == 0? 1: currMoney)))
    const maxThreadsAvailable = (ns.getServerMaxRam(execServer) - ns.getServerUsedRam(execServer)) / ns.getScriptRam("/scripts/grow.js")

    return Math.min(threadsNeeded, maxThreadsAvailable)
}
