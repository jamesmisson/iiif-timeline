import axios from 'axios';
import { Maniiifest } from "maniiifest";
import { TimelineItem } from '../../types/TimelineItem';
import { maniiifestToTimelineItem } from './dataConverter';
 

const FetchTimelineItem = async (url: string, index: number): Promise<TimelineItem> => {
  const response = await axios.get(url);
  const data = new Maniiifest(response.data);
  const timelineItem = maniiifestToTimelineItem(data, index)
  console.log('new timeline item:')
  console.log(timelineItem)
  return timelineItem
}

export default FetchTimelineItem
