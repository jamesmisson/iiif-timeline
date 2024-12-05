import axios from 'axios';
import { Maniiifest } from "maniiifest";
 

const FetchIIIF = async (url: string) => {
  const response = await axios.get(url);
  const data = new Maniiifest(response.data);
  return data
}

export default FetchIIIF