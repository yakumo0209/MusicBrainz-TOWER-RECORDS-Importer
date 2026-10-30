# MusicBrainz: TOWER RECORDS ONLINE Importer

A Tampermonkey userscript that imports release information and tracklists from [TOWER RECORDS ONLINE](https://tower.jp/) into the [MusicBrainz Release Editor](https://musicbrainz.org/release/add).

This script helps simplify the process of creating MusicBrainz release entries using product information from TOWER RECORDS ONLINE.

## Features

The script extracts the following information from TOWER RECORDS ONLINE product pages:

### Release information

- Release title
- Artist
- Release date
- Country (Japan)
- Release status (Official)
- Label
- Catalog number
- Barcode

### Tracklist

- Mediums (CD, DVD-Video, Blu-ray, etc.)
- Track titles
- Track artist credits
- Track lengths

Tracklists are separated by medium, preserving the structure of multi-disc releases.

Track lengths are converted into milliseconds for MusicBrainz.

### Source information

- Adds the TOWER RECORDS ONLINE product page URL to the release's URL relationships.
- Adds an edit note containing the source URL and importer information.

## Requirements

- A desktop web browser
- [Tampermonkey](https://www.tampermonkey.net/)
- A MusicBrainz account for submitting edits

## Installation

1. Open the userscript file in this repository.
2. Click the **Raw** button on GitHub.
3. Tampermonkey should display an installation prompt.
4. Review the script and click **Install**.

## How to use

### Step 1. Open a product page

Visit a product page on [TOWER RECORDS ONLINE](https://tower.jp/).

The script runs automatically after the page finishes loading.

### Step 2. Click the import button

An orange **Import to MB** button appears in the bottom-right corner of the page.

Click the button to open the MusicBrainz Release Editor in a new tab with the extracted information.

### Step 3. Review the release information

Check the imported information in MusicBrainz:

- Release title and artist
- Release date and country
- Label and catalog number
- Barcode
- Medium formats
- Track titles and artist credits
- Track lengths

Please verify the information against the original product page and make any necessary corrections.

### Step 4. Submit the release

Once you have checked and corrected the information, submit the release through MusicBrainz.

The script does not automatically submit the release.

## Format conversion

The script converts some TOWER RECORDS ONLINE media format names into MusicBrainz formats.

| TOWER RECORDS ONLINE | MusicBrainz |
|---|---|
| CDシングル | CD |
| CDアルバム | CD |
| DVD | DVD-Video |
| Blu-ray Disc | Blu-ray |
| 書籍 | *Not imported* |
| グッズ | *Not imported* |

Other formats are passed through as retrieved from the product page.

## Important notes

- The script relies on the page structure and structured data (JSON-LD) provided by TOWER RECORDS ONLINE. Changes to the website may affect its functionality.
- Some information may not be available on every product page.
- Please verify all imported information before submitting a release.
- Track artist credits are initially set to the release artist. Adjust them when individual tracks have different credits.
- Medium formats and tracklists should be checked carefully, especially for releases containing multiple types of media.
- Please follow the [MusicBrainz Style Guidelines](https://musicbrainz.org/doc/Style) when creating release entries.

## Contributing

Bug reports, suggestions, and improvements are welcome!

If you find a problem or have an idea for improvement, please open an issue in this repository.

## Links

- [TOWER RECORDS ONLINE](https://tower.jp/)
- [MusicBrainz](https://musicbrainz.org/)
- [MusicBrainz Release Editor](https://musicbrainz.org/release/add)
- [MusicBrainz Style Guidelines](https://musicbrainz.org/doc/Style)
- [Tampermonkey](https://www.tampermonkey.net/)

## Author

Created by [yakumo0209](https://github.com/yakumo0209).
