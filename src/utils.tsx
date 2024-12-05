export const getFirstString = (obj) => {
    // Get all keys of the object
    const keys = Object.keys(obj);
    
    // Loop through the keys
    for (let key of keys) {
      // Check if the value is an array and contains at least one string
      if (Array.isArray(obj[key]) && obj[key].length > 0) {
        // Return the first string in the array
        return obj[key][0];
      }
    }
  
    // Return empty string if no string is found for now
    return '';
  };
  