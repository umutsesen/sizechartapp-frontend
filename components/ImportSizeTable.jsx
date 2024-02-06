import React, { useState, useEffect, useRef } from "react";
import {
  ResourceList,
  ResourceItem,
  Button,
  TextContainer,
 Text,
  VerticalStack,
  LegacyCard,
} from "@shopify/polaris";
import {
  downloadFile,
  parseTable,
  toObjectOfArraysLowerKeys,
} from "../variables/constants";
import { saveMultipleSizeCharts } from "../apis/sizeCharts";
import * as xlsx from "xlsx";

const exportCSVString =
  "Size,Chest,Waist,Hip\nS,72,46,37\nM,75,51,40\nL,77,56,42\nXL,80,61,43\nXXL,83,64,46";

const ImportSizeTable = ({
  setModalIsOpen,
  setOpenSlidePanel,
  setSizeRange,
  setMeasurements,
  setUpperOrLower,
  setTable,
  fetch,
  isNewChart,
  setIsNewChart,
  setSuccessOrError,
  t,
}) => {
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);

  const fileInputRef = useRef();
  const xlsxInputRef = useRef();

  const processCSV = (str, delim = ",") => {
    console.log(str);
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const newArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {});
      return eachObject;
    });

    setCsvArray(newArray);
  };

  useEffect(() => {
    const file = csvFile;
    const reader = new FileReader();

    if (file) {
      reader.onload = function (e) {
        const text = e.target.result;
        processCSV(text);
      };

      reader.readAsText(file);
    }
  }, [csvFile]);

  useEffect(() => {
    if (csvArray.length) {
      const table = toObjectOfArraysLowerKeys(csvArray);
      const { sizeRange, measurements } = parseTable(table);
      setSizeRange(sizeRange);
      setMeasurements(measurements);
      setTable(table);
      setUpperOrLower("upper");
      setModalIsOpen(false);
      setOpenSlidePanel(true);
    }
  }, [csvArray]);

  const readXlsxFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        if (workbook.SheetNames.length < 2) {
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = xlsx.utils.sheet_to_json(worksheet);
          processXlsx(json);
        } else {
          const sheetName1 = workbook.SheetNames[0];
          const sheetName2 = workbook.SheetNames[1];
          const worksheet1 = workbook.Sheets[sheetName1];
          const worksheet2 = workbook.Sheets[sheetName2];
          const json1 = xlsx.utils.sheet_to_json(worksheet1);
          const json2 = xlsx.utils.sheet_to_json(worksheet2);

          const json = [...json1, ...json2];

          processXlsx(json);
        }
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const processXlsx = (json) => {
    console.log(json);
    const tables = [];
    let sizes = [];
    json.forEach((item, index) => {
      const { XXS, XS, S, M, L, XL, XXL, XXXL } = item;
      if (item.GENDER !== undefined) {
        sizes = [];
        delete item.XXS;
        delete item.XS;
        delete item.S;
        delete item.M;
        delete item.L;
        delete item.XL;
        delete item.XXL;
        delete item.XXXL;

        if (XXS) {
          let obj = { size: "XXS" };
          obj[item["SIZE CHART"].toLowerCase()] = XXS;
          sizes.push(obj);
        }
        if (XS) {
          let obj = { size: "XS" };
          obj[item["SIZE CHART"].toLowerCase()] = XS;
          sizes.push(obj);
        }
        if (S) {
          let obj = { size: "S" };
          obj[item["SIZE CHART"].toLowerCase()] = S;
          sizes.push(obj);
        }
        if (M) {
          let obj = { size: "M" };
          obj[item["SIZE CHART"].toLowerCase()] = M;
          sizes.push(obj);
        }
        if (L) {
          let obj = { size: "L" };
          obj[item["SIZE CHART"].toLowerCase()] = L;
          sizes.push(obj);
        }
        if (XL) {
          let obj = { size: "XL" };
          obj[item["SIZE CHART"].toLowerCase()] = XL;
          sizes.push(obj);
        }
        if (XXL) {
          let obj = { size: "XXL" };
          obj[item["SIZE CHART"].toLowerCase()] = XXL;
          sizes.push(obj);
        }
        if (XXXL) {
          let obj = { size: "3XL" };
          obj[item["SIZE CHART"].toLowerCase()] = XXXL;
          sizes.push(obj);
        }

        delete item["SIZE CHART"];
        tables.push(item);
      } else {
        delete item.XXS;
        delete item.XS;
        delete item.S;
        delete item.M;
        delete item.L;
        delete item.XL;
        delete item.XXL;
        delete item.XXXL;

        if (XXS) {
          let obj = {};
          obj[item["SIZE CHART"].toLowerCase()] = XXS;
          const sizesIndex = sizes.findIndex((item) => item.size === "XXS");
          sizes[sizesIndex] = { ...sizes[sizesIndex], ...obj };
        }
        if (XS) {
          let obj = {};
          obj[item["SIZE CHART"].toLowerCase()] = XS;
          const sizesIndex = sizes.findIndex((item) => item.size === "XS");
          sizes[sizesIndex] = { ...sizes[sizesIndex], ...obj };
        }
        if (S) {
          let obj = {};
          obj[item["SIZE CHART"].toLowerCase()] = S;
          const sizesIndex = sizes.findIndex((item) => item.size === "S");
          sizes[sizesIndex] = { ...sizes[sizesIndex], ...obj };
        }
        if (M) {
          let obj = {};
          obj[item["SIZE CHART"].toLowerCase()] = M;
          const sizesIndex = sizes.findIndex((item) => item.size === "M");
          sizes[sizesIndex] = { ...sizes[sizesIndex], ...obj };
        }
        if (L) {
          let obj = {};
          obj[item["SIZE CHART"].toLowerCase()] = L;
          const sizesIndex = sizes.findIndex((item) => item.size === "L");
          sizes[sizesIndex] = { ...sizes[sizesIndex], ...obj };
        }
        if (XL) {
          let obj = {};
          obj[item["SIZE CHART"].toLowerCase()] = XL;
          const sizesIndex = sizes.findIndex((item) => item.size === "XL");
          sizes[sizesIndex] = { ...sizes[sizesIndex], ...obj };
        }
        if (XXL) {
          let obj = {};
          obj[item["SIZE CHART"].toLowerCase()] = XXL;
          const sizesIndex = sizes.findIndex((item) => item.size === "XXL");
          sizes[sizesIndex] = { ...sizes[sizesIndex], ...obj };
        }
        if (XXXL) {
          let obj = {};
          obj[item["SIZE CHART"].toLowerCase()] = XXXL;
          const sizesIndex = sizes.findIndex((item) => item.size === "3XL");
          sizes[sizesIndex] = { ...sizes[sizesIndex], ...obj };
        }

        if (
          json[index + 1]?.GENDER !== undefined ||
          index === json.length - 1
        ) {
          tables[tables.length - 1] = {
            ...tables[tables.length - 1],
            sizes,
          };

          delete item["SIZE CHART"];
        }
      }
    });
    saveTables(tables);
  };

  const saveTables = async (tables) => {
    try {
      await saveMultipleSizeCharts(fetch, tables);
      setModalIsOpen(false);
      setIsNewChart(!isNewChart);
    } catch (err) {
      console.log(err.message);
      setSuccessOrError({
        message: t(`Errors.${err.message}`),
        success: false,
      });
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        style={{ display: "none" }}
        type={"file"}
        accept=".csv"
        id="csvFile"
        onChange={(e) => setCsvFile(e.target.files[0])}
      />
      <input
        ref={xlsxInputRef}
        style={{ display: "none" }}
        type={"file"}
        id="xlsxFile"
        onChange={readXlsxFile}
      />
      <ResourceList
        items={[
          {
            id: 1,
            title: t("DashboardPage.26"),
            subtitle: t("DashboardPage.27"),
            job: "import table",
            exportButton: true,
            fileType: "xlsx",
            img: "https://customerssizeandme.s3.eu-central-1.amazonaws.com/xlsx-file-format-extension.png",
          },
        ]}
        renderItem={(item) => {
          const { id, title, subtitle, exportButton, job, fileType, img } =
            item;
          const media = (
            <LegacyCard>
              <img width={70} height={70} src={img} />
            </LegacyCard>
          );

          const shortcutActions = exportButton
            ? [
                {
                  content: `${t("DashboardPage.28")}`,
                  onAction: () => {
                    if (fileType === "csv") {
                      downloadFile(
                        "exampleSizeChart",
                        new Blob([exportCSVString], {
                          type: "text/csv;charset=utf-8;",
                        })
                      );
                    } else {
                      const downloadLink = document.createElement("a");
                      downloadLink.download = "exampleSizeChart";
                      downloadLink.href =
                        "https://customerssizeandme.s3.eu-central-1.amazonaws.com/ExampleSizeChartXLSX.xlsx";
                      downloadLink.target = "blank";
                      downloadLink.click();
                    }
                  },
                },
              ]
            : null;

          return (
            <ResourceItem
              id={id}
              media={media}
              shortcutActions={shortcutActions}
              persistActions
              onClick={() => {
                if (job === "import table") {
                  if (fileType === "csv") {
                    fileInputRef.current.click();
                  } else if (fileType === "xlsx") {
                    xlsxInputRef.current.click();
                  }
                }
              }}
            >
              <VerticalStack>
                <Text size="small"  as="p">{title}</Text>
                <Text size="small" fontWeight="bold"  as="p">{subtitle}</Text>
              </VerticalStack>
            </ResourceItem>
          );
        }}
      />
    </>
  );
};

export default ImportSizeTable;
