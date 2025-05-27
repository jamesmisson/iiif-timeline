"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TimelineOptions } from "@/types/TimelineOptions";





// settings to add
// units (change 'items' to e.g. 'books'). 
// center selected item
// show thumbnail on hover
// cluster items (and cluster max)





interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  options: TimelineOptions;
  // eslint-disable-next-line no-unused-vars
  onOptionsChange: (options: TimelineOptions) => void;
}

export function SettingsDialog({
  isOpen,
  onClose,
  options,
  onOptionsChange,
}: SettingsDialogProps) {
  const [newOptions, setNewOptions] = useState<TimelineOptions>({
    ...options,
  });

  // Reset local state when dialog opens or options change
  useEffect(() => {
    if (isOpen) {
      setNewOptions({ ...options });
    }
  }, [isOpen, options]);

  const handleBooleanChange =
    (key: keyof TimelineOptions) => (checked: boolean) => {
      setNewOptions((prev) => ({ ...prev, [key]: checked }));
    };

  const saveChanges = () => {
    onOptionsChange(newOptions);
    // onOptionsChange closes dialog
  };

  const handleCancel = () => {
    // reset to original options
    setNewOptions({ ...options });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Timeline Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Labels</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="showCurrentTime">Show Current Time</Label>
              <Switch
                id="showCurrentTime"
                checked={newOptions.showCurrentTime}
                onCheckedChange={handleBooleanChange("showCurrentTime")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="showMajorLabels">Show Major Labels</Label>
              <Switch
                id="showMajorLabels"
                checked={newOptions.showMajorLabels}
                onCheckedChange={handleBooleanChange("showMajorLabels")}
              />
            </div>
          
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;