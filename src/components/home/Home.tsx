import Header from "../shared/Header"
import { Maniiifest } from "maniiifest";

type HomeProps = {
  collection: Maniiifest | undefined;
};



const Home: React.FC<HomeProps> = ({ collection }) => {
  return (
    <>
      <Header collection={collection}/>
      Home content
    </>
  )
}

export default Home