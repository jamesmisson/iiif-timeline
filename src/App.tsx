import React, { useState, useEffect } from "react";
import { Maniiifest } from "maniiifest";
import { getFirstString } from "./utils";

// import Home from './components/home/Home';
import Gallery from "./components/gallery/Gallery";
import Timeline from "./components/timeline/Timeline";
import Table from "./components/table/Table";

import Sidebar from "./components/shared/Sidebar";
import axios from "axios";

import fixtures from './Fixtures'

function App() {
  const [url, setUrl] = useState<string>('');
  const [collection, setCollection] = useState<Maniiifest | undefined>();
  const [manifests, setManifests] = useState<Maniiifest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  const loadCollection = async (selectedUrl: string) => {
    setLoading(true);
    setError(null); // Clear any previous error
    try {
      const response = await axios.get(selectedUrl);
      const data = new Maniiifest(response.data);
      const specType = data.getSpecificationType();
      if (specType === "Manifest") {
        throw new Error(`This is a ${specType}, not a Collection`);
      } else if (specType === "Collection") {
        setCollection(data)
        const newManifests = []
        for (const manifest of data.iterateCollectionManifest()) {
          const newManifest = new Maniiifest(manifest)
          newManifests.push(newManifest)
          setManifests(newManifests)
          }
      } else {
        throw new Error(`Unknown specification type: ${specType}`);
        }
    } catch (error) {
      console.error(`Error fetching or parsing data from ${url}:`, error);
    } finally {
      setLoading(false);
    }
      };

  const DisplayLoaded = () => {
    if (loading) {
      return <div><p>Loading...</p></div>
    }
    if (error) {
      return <div className="error">Error: {error}</div>;
    }
    if (collection) {
      return (
        <div className="loadedCollectionInfo">
          <p>Collection loaded:</p>
          <p>{getFirstString(collection.getCollectionLabel())}</p>
          <p><a href={collection.getCollectionId() || ''}  target="_blank">{collection.getCollectionId()}</a></p>
        </div>
      );
    }
    // If there's no error or collection, show a default message
    return <div>No Collection loaded.</div>;
  };


  const DataLoader: React.FC = () => {
    // Handle the form submission
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      loadCollection(inputValue);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Collection URL: 
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <button type="submit">Load</button>
        <br/>
      </form>

    );
  };

  const FixtureSelection = () => {
    const handleClick = (selectedUrl) => {
      setUrl(selectedUrl);
      loadCollection(selectedUrl);
    };
    return (
      <div>
        <ul>
          {fixtures.map((fixture, index) => (
            <li key={index}>
              <button onClick={() => handleClick(fixture)}>{fixture}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };



  //Navigation

  const [currentPage, setCurrentPage] = useState<string>("Home");
  const handleMenuClick = (menu: string) => {
    setCurrentPage(menu);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Home":
        return (
          <>
            <div>
              <p>Load a IIIF Collection via a URL, or select from the test fixtures</p>
              <p>NB for testing and demo purposes, manifests without a NavDate are currently assigned a random incorrect date.</p>
            </div>
            <DataLoader />
            <div style={{height:"20px"}}></div>
            <FixtureSelection />
            <DisplayLoaded />
            {/* <UrlMenu fixtures={fixtures} /> */}
          </>
        )
      // return <Home title={title} collectionSize={collectionSize}/>;;
      case "Table":
        return <Table collection={collection} />;
      case "Gallery":
        return <Gallery collection={collection} />;
      case "Timeline":
        return <Timeline collection={collection} />;
      default:
        return <h1>Welcome to the Home Page</h1>;
    }
  };

  return (
    <div id="topcontainer">
      <Sidebar onMenuClick={handleMenuClick} activeItem={currentPage} />
      <main className={currentPage}>{renderContent()}</main>
    </div>
  );
}

export default App;
