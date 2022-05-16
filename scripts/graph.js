/** @param {NS} ns */
export async function main(ns) {
  const netmap = [...nmap(ns, "home")];
  const nodes = Array.from(netmap).map((key, _) => ({ id: key[0], label: key[0] }));
  const edges = Array.from(netmap).map((key, _) => key[1].connections.map((node, _) => ({ from: key[0], to: node }))).flat();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Zoë's grapher page</title>
  <meta name="description" content="">
  <meta name="author" content="Zoë Hoekstra">
</head>
<body>
  <div style="width: 100%; height:98vh;" id="network"></div>
</body>

<script src="https://visjs.github.io/vis-network/standalone/umd/vis-network.min.js"> </script>
<script>

let nodes = ${JSON.stringify(nodes)};
let edges = ${JSON.stringify(edges)};

// create a network
let container = document.getElementById("network");
let data = {
  nodes: nodes,
  edges: edges,
};

var options = {
  layout: {
    hierarchical: {
      direction: "LR",
    },
  },
};

let network = new vis.Network(container, data, options);

let params = new URLSearchParams(location.search);

</script>
</html>
`
  const freewindow = globalThis["window"];
  const win = freewindow.open('', 'title', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=1000,left=200,top=70');
  win["document"].write(`${html}`);
}

function getServerData(ns, server, origin) {
  let s = ns.getServer(server)
  // Many scripts are dependent on this
  s.connections = ns.scan(server).filter(server => server != origin)
  // Might be handy for some scripts to have a lead back home
  s.origin = origin
  return s
}

function nmap(ns, server, origin = "") {
  // Scan surroundings (relative depth lvl 0)
  const localMap = new Map([[server, getServerData(ns, server, origin)]])
  // Scan surroundings of all servers in the direct surroundings (relative depth lvl 1)
  const deeperMap = localMap.get(server).connections
    .map(s => nmap(ns, s, server))
    .reduce((a, b) => new Map([...a, ...b]), new Map())
  // Put results of both together, return.
  return new Map([...deeperMap, ...localMap])
}
