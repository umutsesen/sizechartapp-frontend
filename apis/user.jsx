const saveUserApiKey = async ({ fetch }) => {
  try {
    const apiResults = await fetch("/api/storeData/saveStoreData");
  
    const res = await apiResults.json();
    return res;
  } catch (err) {}
};
const saveUserProducts = async ({ fetch }) => {
  try {
    const apiResults = await fetch("/api/storeData/saveStoreProducts");
    const res = await apiResults.json();
    console.log(apiResults, res);
    return res;
  } catch (err) {}
};

export { saveUserApiKey, saveUserProducts };
