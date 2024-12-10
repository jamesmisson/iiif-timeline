import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Maniiifest } from "maniiifest";
import TimelineMain from "./components/timeline/TimelineMain";
import FetchIIIF from "./FetchIIIF";
import fixtures from "./Fixtures";
import "./loader.css"


function AppThree() {
  const [collectionUrl, setCollectionUrl] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>("");

  const handleUrlSubmit = (submittedUrl: string): void => {
    setCollectionUrl(submittedUrl);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call the parent's callback function and pass the inputUrl to it
    handleUrlSubmit(inputUrl);
    // Optionally, you can reset the input value after submission
    setInputUrl('');
  };

  const result = useQuery<Maniiifest>({
    queryKey: ["iiif", collectionUrl],
    queryFn: () => FetchIIIF(collectionUrl as string),
    enabled: !!collectionUrl,
    refetchOnWindowFocus: false,
  });

  return (
    <div id="topcontainer">
        <main className="timeline">
      {result.isSuccess ? (
        <TimelineMain collectionUrl={collectionUrl} collection={result.data} />
      ) : (
        <div id="loader">
          <h1>Load IIIF Collection to Timeline...</h1>
          <p>or select from the test collections below.</p>
          <p>This is a proof of concept/testing environment. Suggestions for features are welcome!</p>
          <p>It currently only works with v3 IIIF Collections with Navdates</p>
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
        </div>
      )}
      </main>
    </div>
  );
}

export default AppThree;
