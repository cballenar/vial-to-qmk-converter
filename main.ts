interface VilConfig {
  version: number;
  uid: number;
  layout: any[][];
}

// build qmk keymap
class KeymapBuilder {
  keyboardName;
  keyboardLayout;
  keyboardKeymap;
  vilFilePath;
  author;
  split: boolean;
  thumbKeys: number;
  rows: number;
  cols: number;

  constructor() {
    const keyboardName = prompt("Keyboard Name:", "beekeeb/piantor_pro");
    this.keyboardName = keyboardName;

    const keyboardLayout = prompt("Layout:", "LAYOUT_split_3x6_3");
    this.keyboardLayout = keyboardLayout;

    const keyboardKeymap = prompt(
      "Keymap:",
      "beekeeb_piantor_pro_layout_split_3x6_3",
    );
    this.keyboardKeymap = keyboardKeymap;

    const split = confirm("Split keyboard?");
    this.split = split;

    const thumbKeys = prompt("Number of thumb keys (per side if split):", "3");
    this.thumbKeys = Number(thumbKeys);

    const rows = prompt("Number of rows (excluding thumb rows):", "3");
    this.rows = Number(rows);

    const cols = prompt("Number of columns:", "6");
    this.cols = Number(cols);

    const vilFilePath = Deno.args.length !== 0
      ? Deno.args[0]
      : prompt("Vial File Path:", "sample.vil");
    this.vilFilePath = vilFilePath;

    const author = prompt("Author:", "cballenar");
    this.author = author;
  }

  get keymap() {
    return this.build();
  }

  // Parse file as JSON
  async parseFile(filepath: string): Promise<VilConfig> {
    const contents = await Deno.readTextFile(filepath);
    const json = JSON.parse(contents);
    return json;
  }

  parseLayer(layer: any[][]) {
    const newLayer = [];
    const rows = this.thumbKeys ? this.rows + 1 : this.rows;
    for (let i = 0; i < rows; i++) {
      newLayer.push(...layer[i]);
      if (this.split) {
        newLayer.push(...layer[i + rows].reverse());
      }
    }
    const filteredLayer = newLayer.filter((item) => item !== -1);
    return filteredLayer;
  }

  // get layers from JSON
  parseLayers(config: VilConfig) {
    const layers = config.layout;
    const newLayers = [];
    for (const layer of layers) {
      newLayers.push(this.parseLayer(layer));
    }
    return newLayers;
  }

  async build() {
    const json = await this.parseFile(this.vilFilePath);
    const layers = this.parseLayers(json);

    return {
      "version": "1",
      "keyboard": this.keyboardName,
      "layout": this.keyboardLayout,
      "keymap": this.keyboardKeymap,
      "layers": layers,
      "author": this.author,
    };
  }
}

// check if argument is given, error if not
if (import.meta.main) {
  const kb = new KeymapBuilder();
  const keymap = await kb.keymap;
  console.log(keymap);
  Deno.writeTextFile("keymap.json", JSON.stringify(keymap));
}
