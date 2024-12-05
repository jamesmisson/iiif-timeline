import Header from "../shared/Header"
import { Maniiifest } from "maniiifest";

type TableProps = {
  collection: Maniiifest | undefined;
};

const Table: React.FC<TableProps> = ({ collection }) => {
  return (
    <>
      <Header collection={collection}/>
      Table content
    </>
  )
}

export default Table
