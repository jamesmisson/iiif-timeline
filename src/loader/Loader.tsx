import React, { useState } from "react";
import DisplayLoaded from "./DisplayLoaded";
import Selector from "./Selector"
import { Maniiifest } from "maniiifest";

type LoaderProps = {
    isLoading: boolean,
    error: Error | null,
    data: Maniiifest | undefined;
    onSubmitUrl: any
  };

const Loader: React.FC<LoaderProps> = ({ isLoading, error, data, onSubmitUrl }) => {
    const [inputUrl, setInputUrl] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Call the parent's callback function and pass the inputUrl to it
        onSubmitUrl(inputUrl);
        // Optionally, you can reset the input value after submission
        setInputUrl('');
      };

  return (
    <>
        <div>
        <h1>IIIF Loader</h1>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter IIIF URL"
            />
            <button type="submit">Load</button>
        </form>
        </div>
        <Selector onSubmitUrl={onSubmitUrl} />
        <div>
            {isLoading && <div>Loading...</div>}
            {error instanceof Error && <div>Error: {error.message}</div>}
            {data && <DisplayLoaded data={data} />}
        </div>
    </>
  );
};

export default Loader;
