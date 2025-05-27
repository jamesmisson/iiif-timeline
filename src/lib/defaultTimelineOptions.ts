import { minZoomValues } from "../lib/minZoomValues"
import { TimelineOptions } from "@/types/TimelineOptions";

const unit = "items"

export const defaultTimelineOptions: TimelineOptions = {
    autoResize: false,
    width: "100%",
    height: "100%",
    zoomMin: minZoomValues.YEAR,
    margin: 20,
    showTooltips: false,
    showMajorLabels: false,
    dataAttributes: ["id"],
    showCurrentTime: false,
    template: (itemData, element, data) => {
      if (data.isCluster) {
        const clusteredIds = data.items;
        element.setAttribute(
          "data-clustered-ids",
          clusteredIds.map((item) => item?.id).join(" ")
        );
        return `<div class="cluster-header">${data.items.length} ${unit}</div>`;
      } else {
        return `<div>${data.content}</div>`;
      }
    },
    cluster: {
      maxItems: 4,
      titleTemplate: "cluster {count} items",
      showStipes: true,
      fitOnDoubleClick: false,
    },
  }

