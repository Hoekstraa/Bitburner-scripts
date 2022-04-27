/** @param {NS} ns */
export async function main(ns) {

  const netmap = [...nmap(ns, "home")];
  //console.log(netmap)

  const nodes = Array.from(netmap).map((key, _) => ({ id: key[0], label: key[0] }));
  console.log(JSON.stringify(nodes));

  const edges = Array.from(netmap).map((key, _) => key[1].connections.map((node, _) => ({ from: key[0], to: node }))).flat();

  console.log(JSON.stringify(edges));

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>

  <!-- Basic Page Needs
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta charset="utf-8">
  <title>Zoë's grapher page</title>
  <meta name="description" content="">
  <meta name="author" content="Zoë Hoekstra">

  <!-- Favicon
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link rel="icon" type="image/png" href="images/favicon.png">

</head>
<body>

<!-- Primary Page Layout
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
<div style="width: 100%; height:98vh;" id="network"></div>

<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
<script src="https://visjs.github.io/vis-network/standalone/umd/vis-network.min.js"> </script>
<script>

// create an array with nodes
/*
var nodes = [
  { id: 1, label: "Node 1", font: { background: "red" } },
  { id: 2, label: "Node 2", font: { background: "white" } },
  { id: 3, label: "Node 3", font: { background: "cyan" } },
  { id: 4, label: "Node 4", font: { background: "lime" } },
  { id: 5, label: "Node 5", font: { background: "pink" } },
];
*/

let nodes = ${JSON.stringify(nodes)};

// create an array with edges
/*
var edges = [
  { from: 1, to: 2, label: "label1", font: { background: "#ff0000" } },
  { from: 1, to: 3, label: "label2", font: { background: "yellow" } },
  { from: 2, to: 4, label: "label3", font: { background: "lime" } },
  { from: 2, to: 5, label: "label3", font: { background: "pink" } },
];
*/

let edges = ${JSON.stringify(edges)};

// create a network
var container = document.getElementById("network");
var data = {
  nodes: nodes,
  edges: edges,
};
/*var options = {
  nodes: { font: { strokeWidth: 0 } },
  edges: { font: { strokeWidth: 0 } },
};*/

var options = {
  layout: {
    hierarchical: {
      direction: "Up-Down",
    },
  },
};

var network = new vis.Network(container, data, options);

let params = new URLSearchParams(location.search);

console.log(atob(params.get('nmap')))

</script>

</html>

`

  var dynamicJS = "var win = window.open('', 'title', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=1000,left=200,top=70'); win.document.write(`${html}`);";
  var func = new Function('html', dynamicJS);
  var result = func(html);
  console.log(result);

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

