# MIX Packer

Creates Basic Classic MIX files from `.pack` directories.

Usage:

```bash
npm run mix-packer -- --inDir /path/to/game-assets --outDir /path/to/package --xccGameId 5 --nameFormat padded-crc32
```

Command-line options:

| Option                  | Alias | Default        | Description                                                                                                                          |
| ----------------------- | ----- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `--inDir <path>`        | `-i`  | —              | Source directory containing `.pack` directories and their files. Existing `.mix` files in this directory are removed before packing. |
| `--outDir <path>`       | `-o`  | —              | Destination directory for generated MIX files that are not inside a `.pack` directory.                                               |
| `--xccGameId <0-255>`   | —     | `5`            | Numeric XCC Game ID written to the embedded local database.                                                                          |
| `--nameFormat <format>` | —     | `padded-crc32` | Filename-ID algorithm used for MIX directory entries.                                                                                |
| `--no-lmd`              | —     | disabled       | Do not add `local mix database.dat` to generated MIX files.                                                                          |

Both `--inDir` and `--outDir` are required. Paths are resolved relative to the
current working directory.

The `--xccGameId` option writes the numeric XCC game ID value to the local
database embedded in every generated MIX file. It defaults to `5`, preserving
the previous behavior.

The `--nameFormat` option selects the filename-ID algorithm. It defaults to
`padded-crc32`.

Supported formats:

| `nameFormat`   | Usage                                                         |
| -------------- | ------------------------------------------------------------- |
| `rol1`         | Tiberian Dawn and Red Alert                                   |
| `padded-crc32` | Tiberian Sun, Red Alert 2, and Yuri's Revenge; default format |
| `rol3`         | Used by some `Setup.mix` files, including Tiberian Sun        |
| `ror6`         | Alternative ROR6 algorithm used by Lands of Lore III          |

For standard game MIX files, choose the format matching the game.
`rol3` and `ror6` are not tied to a standard XCC Game ID.

Known XCC Game ID values:

| Value | Game           |
| ----: | -------------- |
|     0 | Tiberian Dawn  |
|     1 | Red Alert      |
|     2 | Tiberian Sun   |
|     5 | Red Alert 2    |
|     6 | Yuri's Revenge |
