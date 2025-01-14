import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateDialog({ open }) {
  return (
    <Dialog open={open}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Timeline</DialogTitle>
          <DialogDescription>
            Load a IIIF Collection, or view the demo
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="collection" className="text-right">
              Collection URL
            </Label>
            <Input
              id="collection"
              placeholder="Collection"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Timeline</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateDialog


{/* <div id="loader">
<h1>IIIF Timeline testing</h1>
<p>Upload a IIIF Collection or select from the test fixtures below.</p>
<p>This is a proof of concept. Suggestions for features are welcome.</p>
<p>It currently only works with v3 IIIF Collections with Navdates. Collections without Navdates will be given a random date for test purposes.</p>
<form onSubmit={handleSubmit}>
  <input
    type="text"
    value={inputUrl}
    onChange={(e) => setInputUrl(e.target.value)}
    placeholder="Enter IIIF URL"
  />
  <button type="submit">Load</button>
</form>
<div>
  <p>Test fixtures</p>
  <ul>
    {fixtures.map((fixture, index) => (
      <li key={index}>
        <button onClick={() => handleUrlSubmit(fixture)}>
          {fixture}
        </button>
      </li>
    ))}
  </ul>
</div>
</div> */}