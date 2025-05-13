import {
  CollectionNormalized,
  ManifestNormalized,
  AnnotationPageNormalized,
  AnnotationNormalized,
  CanvasNormalized,
} from "@iiif/presentation-3-normalized";
import type {
  ContentResource,
  IIIFExternalWebResource,
} from "@iiif/presentation-3";
import { Vault, getValue } from "@iiif/helpers";
import {
  createThumbnailHelper,
} from "@iiif/helpers/thumbnail";
import { TimelineItem } from "@/types/TimelineItem";


function convertXSDDateTime(xsdDateTime: string): string {
    const date = new Date(xsdDateTime);
  
    // Get the year, month, and day from the Date object
    const year = String(date.getFullYear()).padStart(4, "0"); // Ensure 4-digit year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so +1
    const day = String(date.getDate()).padStart(2, "0"); // Pad single digit day with leading zero
  
    // Return the date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  }

  export async function createTimelineItems(
    collection: CollectionNormalized,
    vault: Vault
  ): Promise<TimelineItem[]> {
    const timelineItems = await Promise.all(
      collection.items.map(async (item, index) => {
        const rawItem = item as any;
        const id = item.id;
        const label = getValue(rawItem.label) || "Untitled";
  
        let date: string;
        let thumbnailUri: string | undefined = "";
        let manifest: ManifestNormalized | undefined;
  
        if (rawItem.navDate) {
          date = rawItem.navDate;
          console.log('found navdate on collection level')
        } else if (item.type === "Manifest") {
          try {
            manifest = await vault.loadManifest(id);
            if (manifest?.navDate) {
              date = manifest.navDate;
              console.log('navdate found on manifest level')
            } else {
              console.log('no navdate found, placeholder provided')
              date = "placeholder";
              // continue; // Optional: skip if no navDate
            }
          } catch (err) {
            console.warn(`Failed to load manifest ${id}:`, err);
            return null;
          }
        } else {
          //this means item type is a collection
          console.log('item is a collection, placeholder date given')
          date = "placeholder"
        }

        //THUMBNAILS
        //this probably slows this whole function down a fair bit. we might want to think about displaying the timeline without thumbnails first, then
        // having the thumbnails load in the background with vault when the UI is ready.
        // that way a collection with navdates on the collection level should load super quick.
  
        if (rawItem.thumbnail) {
          thumbnailUri = rawItem.thumbnail[0].id;
          console.log('found thumbnail on collection level')
        } else {
          const thumbnailHelper = createThumbnailHelper(vault);
          const t = await thumbnailHelper.getBestThumbnailAtSize(manifest, {
            width: 256,
            height: 256,
          });
  
          if (t.best?.id) {
            console.log('found thumbnail using thumbnailHelper')
            thumbnailUri = t.best.id;
          } else {
            if (manifest === undefined) {
              manifest = await vault.loadManifest(id);
            }
            if (manifest) {
              const canvas0 = vault.get<CanvasNormalized>(manifest.items[0]);
              const images = vault
                .get<AnnotationPageNormalized>(canvas0.items)
                .flatMap((ap) => vault.get<AnnotationNormalized>(ap.items))
                .flatMap((a) => vault.get<ContentResource>(a.body.map((b) => b.id)))
                .flatMap((r) => {
                  if ((r as any).type === "Choice") {
                    return vault.get<ContentResource>(
                      (r as any).items.filter(
                        (i: any) => i.type === "ContentResource"
                      )
                    );
                  } else {
                    return [r];
                  }
                })
                .filter(
                  (r: ContentResource): r is IIIFExternalWebResource =>
                    r.type === "Image"
                );
  
              thumbnailUri = images[0]?.id;
              console.log("thumbnail created from first canvas");

            }
          }
        }
  
        return {
          id,
          start: convertXSDDateTime(date),
          content: label,
          title: thumbnailUri,
          className: "item_" + (index + 1).toString(),
        } as TimelineItem;
      })
    );

    //TODO: PUT IN CHRONOLOGICAL ORDER?
  
    // Filter out any null results from failed manifest loads
    return timelineItems.filter((item): item is TimelineItem => item !== null);
  }
  
