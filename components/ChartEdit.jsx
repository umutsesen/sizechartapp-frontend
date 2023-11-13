import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Frame,
  Page,
  Layout,
  LegacyCard,
  TextField,
  LegacyStack,
  Banner,
  List,
  Text,
  Toast,
  Modal,
  Checkbox,
  VerticalStack,
} from "@shopify/polaris";
import { updateSizeChart, deleteSizeChart } from "../apis/sizeCharts";
import ToggleButton from "react-toggle-button";
import SizeDataGrid from "./SizeDataGrid";
import ProductMatcher from "./ProductMatcher";
import { capitalizeFirtsLetter } from "../variables/constants";
import { useTranslation } from "react-i18next";

import SizeMeButton from './sizemeComponents/Button';

const ChartEdit = ({
  setIsChartEdit,
  chart,
  shopOrigin,
  fetch,
}) => {
  const { t } = useTranslation();
  // sizeRange ve measurementRange tablodan çıkarılıyor
  const [sizeRange, setSizeRange] = useState(
    chart.sizes.map((item) => item.size)
  );
  console.log(chart.sizes, "chart.sizes")
  const [measurements, setMeasurements] = useState(
    Object.keys(chart.sizes[0])
      .filter((item) => item !== "size")
      .map((item1) => capitalizeFirtsLetter(item1))
  );

  const [table, setTable] = useState(chart.sizes);

  const [loading, setLoading] = useState(false);
  const [defaultInfo, setDefaultInfo] = useState([]);

  const gridDataRef = useRef();

  const [hasFormChanged, setHasFormChanged] = useState(false);

  const [chartName, setChartName] = useState(chart.name);
  const handleChartNameChange = useCallback(
    (newValue) => setChartName(newValue),
    []
  );

  const [chartStatus, setChartStatus] = useState(
    chart.status === "Published" ? true : false
  );
  const [updatedChartStatus, setUpdatedChartStatus] = useState();

  const [toggle, setToggle] = useState(
    chart.status === "Published" ? true : false
  );
  const handleToggle = useCallback((value) => setToggle((value = !value)));

  const [successOrError, setSuccessOrError] = useState(null);
  const toastMarkup = successOrError ? (
    <Toast
      content={successOrError.message}
      error={!successOrError.success}
      onDismiss={() => setSuccessOrError(null)}
    />
  ) : null;

  const sizeRangeList = [
    {
      label: "3XL",
      checked: sizeRange.includes("3XL"),
    },
    {
      label: "XXL",
      checked: sizeRange.includes("XXL"),
    },
    {
      label: "XL",
      checked: sizeRange.includes("XL"),
    },
    {
      label: "L",
      checked: sizeRange.includes("L"),
    },
    {
      label: "M",
      checked: sizeRange.includes("M"),
    },
    {
      label: "S",
      checked: sizeRange.includes("S"),
    },
    {
      label: "XS",
      checked: sizeRange.includes("XS"),
    },
    {
      label: "XXS",
      checked: sizeRange.includes("XXS"),
    },
  ];

  const [sizeCheck, setSizeCheck] = useState(
    sizeRangeList.map((item) => item.checked)
  );
  const handleSizeCheckChange = (position) => {
    console.log("59DSADSA");
    const updatedSizeCheck = sizeCheck.map((item, index) => {
      return index === position ? !item : item;
    });

    if (!sizeCheck[position]) {
      setSizeRange([...sizeRange, sizeRangeList[position].label]);

      const obj = {};
      measurements.forEach((item) => {
        obj[item.toLowerCase()] = null;
      });

      setTable([
        ...table,
        { size: sizeRangeList[position].label.toUpperCase(), ...obj },
      ]);
    } else {
      setSizeRange(
        sizeRange.filter((item) => item !== sizeRangeList[position].label)
      );

      setTable(
        table.filter(
          (item) =>
            item.size.toLowerCase() !==
            sizeRangeList[position].label.toLowerCase()
        )
      );
    }

    setSizeCheck(updatedSizeCheck);
  };

  const measurementList = [
    {
      label: "Chest",
      checked: measurements.includes("Chest"),
    },
    {
      label: "Shoulder",
      checked: measurements.includes("Shoulder"),
    },
    {
      label: "Sleevelength",
      checked: measurements.includes("Sleevelength"),
    },
    {
      label: "Length",
      checked: measurements.includes("Length"),
    },
    {
      label: "Bottomwidth",
      checked: measurements.includes("Bottomwidth"),
    },
    {
      label: "Waist",
      checked: measurements.includes("Waist"),
    },
    {
      label: "Hip",
      checked: measurements.includes("Hip"),
    },
    {
      label: "Inseam",
      checked: measurements.includes("Inseam"),
    },
    {
      label: "Outseam",
      checked: measurements.includes("Outseam"),
    },
  ];

  const [measurementCheck, setMeasurementCheck] = useState(
    measurementList.map((item) => item.checked)
  );
  console.log(defaultInfo, "3333", chart);
  const handleMeasurementCheckChange = (position) => {
    if (
      chart.productGroup === "upper" &&
      (measurementList[position].label === t("SizechartEditPage.2") ||
        measurementList[position].label === t("SizechartEditPage.0"))
    )
      return;
    if (
      chart.productGroup === "lower" &&
      (measurementList[position].label === t("SizechartEditPage.2") ||
        measurementList[position].label === t("SizechartEditPage.3"))
    )
      return;

    const updatedMeasurementCheck = measurementCheck.map((item, index) => {
      return index === position ? !item : item;
    });

    if (!measurementCheck[position]) {
      setMeasurements([...measurements, measurementList[position].label]);

      const obj = {};
      obj[measurementList[position].label.toLowerCase()] = null;
      setTable(table.map((item) => ({ ...item, ...obj })));
    } else {
      setMeasurements(
        measurements.filter((item) => item !== measurementList[position].label)
      );

      table.map(
        (item) => delete item[measurementList[position].label.toLowerCase()]
      );
    }

    setMeasurementCheck(updatedMeasurementCheck);
  };

  //useEffect - has form changed?

  useEffect(() => {
    if (chartName !== chart.name || chartStatus !== toggle)
      setHasFormChanged(true);
    else setHasFormChanged(false);
  }, [chartName, toggle, chartStatus]);

  // Delete modal open close state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState();

  const handleDeleteModalChange = useCallback(
    () => setIsDeleteModalOpen(!isDeleteModalOpen),
    [isDeleteModalOpen]
  );
  console.log(defaultInfo, updatedChartStatus, "Fe");

  return (
    <Frame>
      <Page
      title="Edit Size Chart"
        backAction={{ onAction: () => setIsChartEdit(false) }}
        primaryAction={{
          content: t("SizechartEditPage.6"),
          disabled: !hasFormChanged,
          onAction: async () => {
            const values = gridDataRef.current.gridData();
            console.log(values, "values", defaultInfo, "3123default")
            const status = toggle ? "Published" : "Unpublished";

            try {
              const res = await updateSizeChart(
                fetch,
                chartName,
                values,
                status,
                chart._id,
                defaultInfo
              );
              console.log(res);
              setSuccessOrError({
                message: t("SizechartEditPage.9"),
                success: true,
              });
              console.log(res, "res");
              setUpdatedChartStatus(
                res.updatedChart.status !== chart.status &&
                  res.updatedChart.status
              );
              console.log(updatedChartStatus, "3333");
              setChartStatus(
                res.updatedChart.status === "Published" ? true : false
              );
              console.log(chartStatus, "1d");
            
            
            } catch (err) {
              console.log(err);
              setSuccessOrError({
                message: t(`Errors.${err.message}`),
                success: false,
              });
            }
          },
        }}
      >
        {chart.status === "Published" ? (
          updatedChartStatus && (
            <>
              <Banner
                title={
                  updatedChartStatus !== "Unpublished"
                    ? t("SizechartEditPage.10")
                    : t("SizechartEditPage.11")
                }
                status={
                  updatedChartStatus !== "Unpublished" ? "success" : "warning"
                }
              ></Banner>
              <br></br>
            </>
          )
        ) : (
          <>
            <Banner
              title={
                updatedChartStatus === "Published"
                  ? t("SizechartEditPage.121")
                  : t("SizechartEditPage.11")
              }
              status={
                updatedChartStatus === "Published" ? "success" : "warning"
              }
            ></Banner>
            <br></br>
          </>
        )}
        <LegacyCard>
          <LegacyCard.Section >
            <LegacyStack distribution="leading" alignment="center" horizontal>
              <TextField
                value={chartName}
                onChange={handleChartNameChange}
                autoComplete="off"
                maxLength={15}
              />

              <LegacyStack>
                <ToggleButton
                  inactiveLabel={t("SizechartEditPage.29")}
                  activeLabel={t("SizechartEditPage.28")}
                  value={toggle}
                  onToggle={handleToggle}
                />
                {chartStatus ? (
                  <Text size="small" fontWeight="semibold" color="success">
                    {t("SizechartEditPage.7")}
                  </Text>
                ) : (
                  <Text size="small" fontWeight="semibold"  color="critical">
                    {t("SizechartEditPage.8")}
                  </Text>
                )}
              </LegacyStack>
            </LegacyStack>
          </LegacyCard.Section>
          <LegacyCard.Section>
            <LegacyStack>
              <SizeMeButton className="hoverInactiveButton">
                {t("SizechartEditPage.14")}:{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {chart.condition === "free"
                    ? t("SizechartEditPage.27")
                    : chart.condition}
                </span>
              </SizeMeButton>
              <SizeMeButton className="hoverInactiveButton">
                {t("SizechartEditPage.15")}:{" "}
                <span style={{ textTransform: "capitalize" }}>
                  {chart.gender.toLowerCase() === "man" 
                    ? t("SizechartEditPage.25")
                    : t("SizechartEditPage.26")}{" "}
                </span>
              </SizeMeButton>
              <SizeMeButton  onClick={handleDeleteModalChange}>
              {t("SizechartEditPage.16")}
              </SizeMeButton>
             
            </LegacyStack>
          </LegacyCard.Section>
        </LegacyCard>
       <br></br>
        <Layout>
          
          <Layout.Section
            id={t("SizechartEditPage.23")}
            title={t("SizechartEditPage.23")}
           
          >
             <LegacyCard>
              
                <LegacyCard.Section>
                  
                    <VerticalStack gap="4">

                  
                    <LegacyStack gap="2">
                      {sizeRangeList.map((item, index) => (
                        <Checkbox
                          key={index}
                          label={item.label}
                          checked={sizeCheck[index]}
                          onChange={() => handleSizeCheckChange(index)}
                        />
                      ))}
                    </LegacyStack>
                    <LegacyStack  gap="2">
                      {measurementList.map((item, index) => (
                        <Checkbox
                          key={index}
                          label={t(`SizechartEditPage.${item.label}`)}
                          checked={measurementCheck[index]}
                          onChange={() => handleMeasurementCheckChange(index)}
                          disabled={true}
                        />
                      ))}
                    </LegacyStack>

                    </VerticalStack>
                    <hr />
                    <div style={{height: '400px'}}>
                   
                    <SizeDataGrid
                      table={table}
                      sizeRange={sizeRange}
                      measurements={measurements}
                      setTable={setTable}
                      setHasFormChanged={setHasFormChanged}
                      ref={gridDataRef}
                    />
                    
                    </div>
                  
                </LegacyCard.Section>
              </LegacyCard>
      
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section
            id="storeDetails"
            title={t("SizechartEditPage.24")}
         
          >
            <ProductMatcher
              fetch={fetch}
           
              setDefaultInfo={setDefaultInfo}
              chartId={chart._id}
              setHasFormChanged={setHasFormChanged}
                        shopOrigin={shopOrigin}
              
            />
          </Layout.Section>
        </Layout>
        <br></br>
        {toastMarkup}
      </Page>
      <Modal
        titleHidden
        // activator={deleteSizeChartModalActivator}
        open={isDeleteModalOpen}
        onClose={handleDeleteModalChange}
        primaryAction={{
          content: t("SizechartEditPage.18"),
          onAction: handleDeleteModalChange,
        }}
        secondaryActions={{
          content: t("SizechartEditPage.19"),
          onAction: async () => {
            try {
              await deleteSizeChart(fetch, chart._id);
              setIsChartEdit(false);
            } catch (err) {
              setSuccessOrError({
                message: err.message,
                success: false,
              });
            }
          },
        }}
      >
        <Modal.Section>
          <Text>
        
                {t("SizechartEditPage.20")}
             
          </Text>
        </Modal.Section>
      </Modal>
    </Frame>
  );
};

export default ChartEdit;
