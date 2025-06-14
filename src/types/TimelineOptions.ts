type FormatFunction = (date: Date, scale: string) => string;

export type TimelineOptions = {
  align?: "auto" | "center" | "left" | "right";
  autoResize?: boolean;
  clickToUse?: boolean;
  cluster?: object;
  configure?: boolean;
  dataAttributes?: string[] | "all";
  end?: Date | number | string;
  height?: number | string;
  horizontalScroll?: boolean;
  locale?: string;
  max?: Date | number | string;
  maxHeight?: number | string;
  margin?: number 
  min?: Date | number | string;
  minHeight?: number | string;
  moveable?: boolean;
  multiselect?: boolean;
  multiselectPerGroup?: boolean;
  orientation?: "top" | "bottom";
  preferZoom?: boolean;
  rtl?: boolean;
  selectable?: boolean;
  sequentialSelection?: boolean;
  showCurrentTime?: boolean;
  showMajorLabels?: boolean;
  showMinorLabels?: boolean;
  showWeekScale?: boolean;
  showTooltips?: boolean;
  stack?: boolean;
  stackSubgroups?: boolean;
  start?: Date | number | string;
  template?: (itemData, element, data) => string;
  type?: "box" | "point" | "range" | "background";
  verticalScroll?: boolean;
  width?: string | number;
  zoomable?: boolean;
  zoomFriction?: number;
  zoomKey?: "" | "altKey" | "ctrlKey" | "shiftKey" | "metaKey";
  zoomMax?: number;
  zoomMin?: number;
  groupHeightMode?: "auto" | "fixed" | "fitItems";
    format?: {
    majorLabels?: FormatFunction;
    minorLabels?: FormatFunction;
  };
};