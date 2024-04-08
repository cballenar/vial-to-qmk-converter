# Vial to QMK Converter

Converts a .vil file exported by Vial to QMK json file.

## Usage

Clone the repository, copy the .vil file to the root of the repository and run:

```sh
deno task convert sample.json
```

It will generate a keymap.json file in the root and also print the json to the console.

---

Not much to see yet. This is currently only helpful to convert content from separate layers into one. It will ignore tap dance, macros, and everything other than layers. It's also setup for a 3x6 split keyboard.
