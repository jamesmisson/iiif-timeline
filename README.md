# IIIF Timeline

**IIIF Timeline** allows you to visualize a IIIF collection over a zoomable timeline interface, and embed it into your website.

---

## Load a Collection

You can load your collection by pasting its URL in the input box visible on opening IIIF Timeline, and clicking **Load Collection**. You can also access this input box by clicking the folder icon in the footer.

Items in the collection must have a `navDate` property. You can read more about `navDate` in the [IIIF Presentation API 3.0 documentation](https://iiif.io/api/presentation/3.0/#navdate).

This [example collection](https://iiif.io/api/cookbook/recipe/0230-navdate/) from the IIIF Cookbook shows the bare minimum for use in IIIF Timeline. However, adding thumbnails to the items at the collection level, as shown below, will help them load faster:

<details>
<summary>Example JSON</summary>

```json
"items": [
  {
    "id": "https://data.idp.bl.uk/iiif/3/manifest/276EC271D29444459187C258A41A046F",
    "label": {
      "en": [
        "Saddharmapundarikasutra (Lotus Sutra), Chinese translation by Kumarajiva from Dunhuang."
      ]
    },
    "type": "Manifest",
    "thumbnail": [
      {
        "id": "https://data.idp.bl.uk/mediaLib/3/w/f/m9lcru086i4oj0tng5qwp6/mid_7180F5570660498A84AF3528CCA996F3.jpg",
        "type": "Image",
        "height": 349,
        "width": 600,
        "format": "image/jpeg"
      }
    ],
    "navDate": "0671-11-18T00:00:00+00:00"
  }
]
```

</details>

See the [examples folder](https://github.com/jamesmisson/iiif-timeline/tree/main/public) for more working collection examples.

To build a new collection, we recommend using the [IIIF Manifest Editor](https://manifest-editor.digirati.services/).

---

## Settings

You can adjust some settings by clicking the settings icon in the footer. These will be saved to your timeline and included in the embedded version. More settings are in the works.

---

## Embed

To embed the timeline, click the share icon in the footer and copy-paste the HTML snippet into your web page. You may want to adjust the width, height, and styling.

---

## Contribute

Pull requests, bug reports, and feature requests are encouraged. If there is a feature you would like to see added, please [open an issue](https://github.com/jamesmisson/iiif-timeline/issues) on GitHub.

---
