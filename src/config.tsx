interface AppConfig {
    uvUrl: string;
  }
  
  const config: AppConfig = {
    uvUrl: "./uv.html#?manifest="
    // if on local dev server this needs to be "./iiif-timeline/uv.html#?manifest=" to see UV
  };
  
  export default config;
  