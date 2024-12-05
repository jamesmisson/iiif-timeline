import { Maniiifest } from "maniiifest";
import { TimelineItem } from "../../types/TimelineItem";
import { getFirstString } from "../../utils";

function convertXSDDateTime(xsdDateTime: string): string {
  // Create a Date object from the XSD dateTime string
  const date = new Date(xsdDateTime);

  // Get the year, month, and day from the Date object
  const year = String(date.getFullYear()).padStart(4, "0"); // Ensure 4-digit year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so +1
  const day = String(date.getDate()).padStart(2, "0"); // Pad single digit day with leading zero

  // Return the date in YYYY-MM-DD format
  return `${year}-${month}-${day}`;
}

//for testing purposes, function to get a random date when navdate
function getRandomYear() {
  const min = 1066;
  const max = 2000;

  // Generate a random number between 1066 and 2000 (inclusive)
  const randomYear = Math.floor(Math.random() * (max - min + 1)) + min;

  // Convert the number to a string
  return String(randomYear);
}

//main function
//takes in a Maniiifest and produces array of timeline Items in chron order

export function maniiifestToTimelineItem(
  manifest: Maniiifest,
  key: number
): TimelineItem {

      const thumbnailArray = Array.from(manifest.iterateManifestThumbnail());
      const firstThumbnail = thumbnailArray.length > 0 ? thumbnailArray[0] : null;
      let thumbnail_url;
      if (firstThumbnail) {
        thumbnail_url = firstThumbnail.id;
      } else {
        thumbnail_url = '';
      };
      
      const randomYear = getRandomYear();

      const timelineItem: TimelineItem = {
        id: manifest.getManifestId() || key.toString(),
        content: getFirstString(manifest.getManifestLabel()) || "",
        start: convertXSDDateTime(
          manifest.getManifestNavDate() || randomYear + "-00-00"
        ),
        className: "item_" + (key + 1).toString(),
        title: thumbnail_url
        };
      
      return timelineItem
}
