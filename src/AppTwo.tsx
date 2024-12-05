import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { Maniiifest } from "maniiifest";
import Loader from "./loader/Loader";
// import Gallery from "./components/gallery/Gallery";
import TimelineMain from "./components/timeline/TimelineMain";
// import Table from "./components/table/Table";
import Sidebar from "./components/shared/Sidebar";
import FetchIIIF from "./FetchIIIF";

function AppTwo() {
  const [currentPage, setCurrentPage] = useState<string>("Home");
  const [collectionUrl, setCollectionUrl] = useState<string | null>(null);

  const result = useQuery<Maniiifest>({
    queryKey: ["iiif", collectionUrl],
    queryFn: () => FetchIIIF(collectionUrl as string),
    enabled: !!collectionUrl,
    refetchOnWindowFocus: false,
  });

  const handleUrlSubmit = (submittedUrl: string): void => {
    setCollectionUrl(submittedUrl);
  };

  //Navigation

  
  const handleMenuClick = (menu: string) => {
    setCurrentPage(menu);
  };

  const renderContent = () => {
    switch (currentPage) {
      case "Home":
        return (
          <>
            <div>
              <h1>App 2</h1>
              <h2>Maniiifest and TanStack Query version</h2>
              <p>Load a IIIF Collection via a URL, or select from the test fixtures</p>
              <p>NB for testing and demo purposes, manifests without a NavDate are currently assigned a random incorrect date.</p>
              <p>Manifests without navdates current crash the timeline</p>
            </div>
            <Loader isLoading={result.isLoading} error={result.error} data={result.data} onSubmitUrl={handleUrlSubmit} />
          </>
        )
      // return <Home title={title} collectionSize={collectionSize}/>;;
      // case "Table":
      //   return <Table collection={data} />;
      // case "Gallery":
        // return <Gallery collection={result.data} />;
      case "Timeline":
        if (result.isSuccess) {
          return <TimelineMain collectionUrl={collectionUrl} collection={result.data} />
        } else{
          return <div>no data</div>
        }
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

export default AppTwo;
