import Header from "../shared/Header"
import { Maniiifest } from "maniiifest";

type GalleryProps = {
  collection: Maniiifest | undefined;
};

const Gallery: React.FC<GalleryProps> = ({ collection }) => {
  return (
    <>
      <Header collection={collection}/>
      gallery content
    </>
  )
}

export default Gallery
