import React from 'react'
import { Maniiifest } from 'maniiifest'
import { getFirstString } from '../utils';

type DisplayLoadedProps = {
    data: Maniiifest | undefined;
  };

const DisplayLoaded: React.FC<DisplayLoadedProps> = ({ data }) => {
  return (
    <div>
      {data && (
        <div>
          <div className="loadedCollectionInfo">
            <p>Collection loaded:</p>
            <p>{getFirstString(data.getCollectionLabel())}</p>
            <p><a href={data.getCollectionId() || ''}  target="_blank">{data.getCollectionId()}</a></p>
          </div>
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default DisplayLoaded
