const getAllProducts = async (
  { fetch },
  length = 0,
  searchQuery,
  viewChoice = "allProducts"
) => {
  try {
    console.log(length, searchQuery, viewChoice);
    if (viewChoice === "allProducts") {
      console.log(`12333333333333333333333`);
      if (searchQuery) {
        const getProducts = await fetch(
          `/api/store/getProducts?skip=${length}&limit=10&search=${searchQuery}&products=all`
        )
          .then((response) => response.json())
          .then((data) => data);
        return getProducts;
      } else {
        const getProducts = await fetch(
          `/api/store/getProducts?skip=${length}&limit=10&products=all`
        )
          .then((response) => response.json())
          .then((data) => data);
        return getProducts;
      }
    } else {
      console.log("9999999999999999999");
      if (searchQuery) {
        const getProducts = await fetch(
          `/api/store/getProducts?skip=${length}&limit=10&search=${searchQuery}&products=withoutSize`
        )
          .then((response) => response.json())
          .then((data) => data);
        return getProducts;
      } else {
        const getProducts = await fetch(
          `/api/store/getProducts?skip=${length}&limit=10&products=withoutSize`
        )
          .then((response) => response.json())
          .then((data) => data);
        return getProducts;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const getSingleProduct = async ({ fetch }, productId) => {
  try {
    const getProducts = await fetch(`/api/store/getSingleProduct?id=${productId}`);
    const clearProduct = await getProducts.json();
    return clearProduct;
  } catch (err) {
    console.log(err);
  }
};
export { getAllProducts, getSingleProduct };
