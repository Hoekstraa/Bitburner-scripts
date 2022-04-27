// example.ns
export async function main(ns) {
  const data = ns.flags(f);
  ns.tprint(data);
}

const f = [
  ['delay', 0], // a default number means this flag is a number
  ['server', 'foodnstuff'], //  a default string means this flag is a string
  ['exclude', []], // a default array means this flag is a default array of string
  ['help', false], // a default boolean means this flag is a boolean
];

export function autocomplete(data, args) {
  data.flags(f)
  return [...data.servers];
}
