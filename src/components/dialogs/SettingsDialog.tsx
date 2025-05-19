import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Define type for Timeline Options
type TimelineUserOptions = {
  align?: "auto" | "center" | "left" | "right";
  autoResize?: boolean;
  clickToUse?: boolean;
  configure?: boolean;
  dataAttributes?: string[] | "all";
  end?: Date | number | string;
  height?: number | string;
  horizontalScroll?: boolean;
  locale?: string;
  max?: Date | number | string;
  maxHeight?: number | string;
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
  type?: "box" | "point" | "range" | "background";
  verticalScroll?: boolean;
  width?: string | number;
  zoomable?: boolean;
  zoomFriction?: number;
  zoomKey?: "" | "altKey" | "ctrlKey" | "shiftKey" | "metaKey";
  zoomMax?: number;
  zoomMin?: number;
  groupHeightMode?: "auto" | "fixed" | "fitItems";
};

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
  options: TimelineUserOptions;
  onOptionsChange: (options: TimelineUserOptions) => void;
}

export function SettingsDialog({
    isOpen,
    onClose,
  options,
  onOptionsChange,
}: SettingsDialogProps) {
  const [localOptions, setLocalOptions] = useState<TimelineUserOptions>({
    ...options,
  });

  const handleBooleanChange =
    (key: keyof TimelineUserOptions) => (checked: boolean) => {
      setLocalOptions((prev) => ({ ...prev, [key]: checked }));
    };

//   const handleStringChange =
//     (key: keyof TimelineOptions) =>
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setLocalOptions((prev) => ({ ...prev, [key]: e.target.value }));
//     };

//   const handleNumberChange =
//     (key: keyof TimelineOptions) =>
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setLocalOptions((prev) => ({ ...prev, [key]: Number(e.target.value) }));
//     };

//   const handleSelectChange =
//     (key: keyof TimelineOptions) => (value: string) => {
//       setLocalOptions((prev) => ({ ...prev, [key]: value }));
//     };

//   const handleDateChange =
//     (key: keyof TimelineOptions) => (date: Date | undefined) => {
//       if (date) {
//         setLocalOptions((prev) => ({ ...prev, [key]: date }));
//       }
//     };

  const saveChanges = () => {
    onOptionsChange(localOptions);
  };

  return (
    <Dialog
    open={isOpen}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Timeline Settings</DialogTitle>
        </DialogHeader>
       
                   {/* <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="align">Alignment</Label>
                <Select
                  value={localOptions.align || "auto"}
                  onValueChange={handleSelectChange("align")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Auto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupHeightMode">Group Height Mode</Label>
              <Select
                value={localOptions.groupHeightMode || "auto"}
                onValueChange={handleSelectChange("groupHeightMode")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="fitItems">Fit Items</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* RTL */}
            {/* <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rtl">Right to Left</Label>
                <div className="text-sm text-muted-foreground">
                  Display timeline in RTL mode
                </div>
              </div>
              <Switch
                id="rtl"
                checked={!!localOptions.rtl}
                onCheckedChange={handleBooleanChange("rtl")}
              />
            </div> */}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Labels</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showMajorLabels">Show Major Labels</Label>
                  <Switch
                    id="showMajorLabels"
                    checked={localOptions.showMajorLabels !== false} // default true
                    onCheckedChange={handleBooleanChange("showMajorLabels")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showMinorLabels">Show Minor Labels</Label>
                  <Switch
                    id="showMinorLabels"
                    checked={localOptions.showMinorLabels !== false} // default true
                    onCheckedChange={handleBooleanChange("showMinorLabels")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showWeekScale">Show Week Scale</Label>
                  <Switch
                    id="showWeekScale"
                    checked={!!localOptions.showWeekScale} // default false
                    onCheckedChange={handleBooleanChange("showWeekScale")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="showCurrentTime">Show Current Time</Label>
                  <Switch
                    id="showCurrentTime"
                    checked={localOptions.showCurrentTime !== false} // default true
                    onCheckedChange={handleBooleanChange("showCurrentTime")}
                  />
                </div>
              </div>
            </div>

            {/* <div className="space-y-4">
              <h3 className="text-lg font-medium">Stacking</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stack">Stack Items</Label>
                    <p className="text-sm text-muted-foreground">
                      Stack items so they don't overlap
                    </p>
                  </div>
                  <Switch
                    id="stack"
                    checked={localOptions.stack !== false} // default true
                    onCheckedChange={handleBooleanChange("stack")}
                  />
                </div>
              </div>
            </div> */}

            <div className="flex items-center justify-between">
              <Label htmlFor="showTooltips">Show Tooltips</Label>
              <Switch
                id="showTooltips"
                checked={localOptions.showTooltips !== false} // default true
                onCheckedChange={handleBooleanChange("showTooltips")}
              />
            </div>

        <div className="flex justify-end gap-2 mt-4">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button onClick={saveChanges}>Save Changes</Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
