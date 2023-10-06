export const getDefaultInformation = async ({ fetch }, sizeChartId) => {
  try {
    console.log("352432");
    const getProducts = await fetch(
      `/api/sizeChart/getDefaultInformation?id=${sizeChartId}`
    );
    const cleanData = await getProducts.json();
    console.log(cleanData, "DEFUALTINFO MATCHCHOICES, FFDSAFDSF");
    return cleanData.productMatchChoices;
  } catch (err) {
    console.log(err);
  }
};

//////////////////////////

export const saveSizeCharts = async (fetch, payload) => {
  try {
    const response = await fetch("/api/sizeChart/saveSizeCharts", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    console.log("Save size chart", data);
  } catch (err) {
    throw err;
  }
};

export const saveMultipleSizeCharts = async (fetch, tables) => {
  console.log(tables);
  try {
    const response = await fetch("/api/sizeChart/saveMultipleSizeCharts", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tables),
    });

    const data = await response.json();
    console.log("Save multiple size charts", data);
    if (!response.ok) throw new Error(data.error);
  } catch (err) {
    throw err;
  }
};

export const getUserSizeCharts = async (fetch, sortValue) => {
  try {
    console.log(fetch, "3213123123")
    const response = await fetch(`/api/sizeChart/getUserSizeChart/${sortValue}`);

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteUserSizeCharts = async (fetch, selectedItems) => {
  try {
    const response = await fetch("/api/sizeChart/deleteSelected", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sizeChartIds: selectedItems }),
    });

    console.log(response);

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
  } catch (err) {
    throw err;
  }
};

export const publishSelectedSizeCharts = async (fetch, selectedItems) => {
  try {
    const response = await fetch("/api/sizeChart/publishSelected", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sizeChartIds: selectedItems }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
  } catch (err) {
    throw err;
  }
};

export const unPublishSelectedSizeCharts = async (fetch, selectedItems) => {
  try {
    const response = await fetch("/api/sizeChart/unpublishSelected", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sizeChartIds: selectedItems }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
  } catch (err) {
    throw err;
  }
};

export const deleteSizeChart = async (fetch, chartId) => {
  try {
    const response = await fetch("/api/sizeChart/deleteSizeChart", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chartId }),
    });

    const data = response.json();
    if (!response.ok) throw new Error(data.error);
  } catch (err) {
    throw err;
  }
};

export const updateSizeChart = async (
  fetch,
  chartName,
  sizes,
  status,
  chartId,
  defaultInfo
) => {
  try {
    const response = await fetch("/api/sizeChart/updateSizeChart", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chartName, sizes, status, chartId, defaultInfo }),
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (err) {
    throw err;
  }
};
