interface VilConfig {
  version: number;
  uid: number;
  layout: any[][];
}

const keyboardConfig = {
  split: true,
  thumbCluster: true,
  rows: 3,
  cols: 6,
  keyboard: "beekeeb/piantor_pro",
  layout: "LAYOUT_split_3x6_3",
  keymap: "beekeeb_piantor_pro_layout_split_3x6_3",
};

// Parse file as JSON
async function parseFile(filepath: string): Promise<VilConfig> {
  const contents = await Deno.readTextFile(filepath);
  const json = JSON.parse(contents);
  return json;
}

function parseLayer(layer: any[][]) {
  const newLayer = [];
  const rows = keyboardConfig.thumbCluster
    ? keyboardConfig.rows + 1
    : keyboardConfig.rows;
  for (let i = 0; i < rows; i++) {
    newLayer.push(...layer[i]);
    if (keyboardConfig.split) {
      newLayer.push(...layer[i + rows].reverse());
    }
  }
  const filteredLayer = newLayer.filter((item) => item !== -1);
  return filteredLayer;
}

// get layers from JSON
function parseLayers(config: VilConfig) {
  const layers = config.layout;
  const newLayers = [];
  for (const layer of layers) {
    newLayers.push(parseLayer(layer));
  }
  return newLayers;
}

// build qmk keymap
function buildKeymap(layers: any[][]) {
  return {
    "version": "1",
    "keyboard": keyboardConfig.keyboard,
    "layout": keyboardConfig.layout,
    "keymap": keyboardConfig.keymap,
    "layers": layers,
    "author": "",
  };
}

// check if argument is given, error if not
if (import.meta.main) {
  if (Deno.args.length === 0) {
    console.log("Please enter a name as an argument.");
    Deno.exit(1);
  }
  const filepath = Deno.args[0];
  const json = await parseFile(filepath);
  const layers = parseLayers(json);
  const keymap = buildKeymap(layers);
  console.log(JSON.stringify(keymap));
  Deno.writeTextFile("keymap.json", JSON.stringify(keymap));
}
