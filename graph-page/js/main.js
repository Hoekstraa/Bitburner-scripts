// create an array with nodes
var nodes = [
  { id: 1, label: "Node 1", font: { background: "red" } },
  { id: 2, label: "Node 2", font: { background: "white" } },
  { id: 3, label: "Node 3", font: { background: "cyan" } },
  { id: 4, label: "Node 4", font: { background: "lime" } },
  { id: 5, label: "Node 5", font: { background: "pink" } },
];

// create an array with edges
var edges = [
  { from: 1, to: 2, label: "label1", font: { background: "#ff0000" } },
  { from: 1, to: 3, label: "label2", font: { background: "yellow" } },
  { from: 2, to: 4, label: "label3", font: { background: "lime" } },
  { from: 2, to: 5, label: "label3", font: { background: "pink" } },
];

// create a network
var container = document.getElementById("network");
var data = {
  nodes: nodes,
  edges: edges,
};
var options = {
  nodes: { font: { strokeWidth: 0 } },
  edges: { font: { strokeWidth: 0 } },
};
var network = new vis.Network(container, data, options);

let params = new URLSearchParams(location.search);

console.log(atob(params.get('nmap')))

