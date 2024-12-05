import axios from 'axios';
import { Maniiifest } from "maniiifest";
import { TimelineItem } from '../../types/TimelineItem';
import { maniiifestToTimelineItem } from './dataConverter';
 

const FetchTimelineItem = async (url: string, index: number): Promise<TimelineItem> => {
  const response = await axios.get(url);
  const data = new Maniiifest(response.data);
  const timelineItem = maniiifestToTimelineItem(data, index)
  return timelineItem
}

export default FetchTimelineItem
