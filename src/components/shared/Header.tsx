import './Header.css'
import { Maniiifest } from 'maniiifest';
import { getFirstString } from '../../utils';

type HeaderProps = {
    collection: Maniiifest | undefined;
  };

const Header: React.FC<HeaderProps>= ({ collection }) => {

  let title: string;
  let itemsArray;

  if (collection !== undefined) {
    title = getFirstString(collection.getCollectionLabel())
    itemsArray = [...collection.iterateCollectionManifest()]
  } else {
    title = "Collection"
    itemsArray = []
  }

  return (
    <header className="collectionHeader">
        <h1 className="collectionTitle">{title}</h1>
        {itemsArray.length && <p className="itemCount">{itemsArray.length} items</p>}
    </header>
  )
}

export default Header
