import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Text,
  TextField,
  Checkbox,
  RadioButton,
  Button,
  HorizontalStack,
  VerticalStack
} from "@shopify/polaris";
import { Formik, Form } from "formik";
import axios from "axios";
import SizeDataGrid from "./SizeDataGrid";
import { capitalizeFirtsLetter } from "../variables/constants";
import { CSSTransition } from "react-transition-group";
import { saveSizeCharts } from "../apis/sizeCharts";

const CustomSlidePanel = ({
  setOpenSlidePanel,
  sizeRange,
  measurements,
  setMeasurements,
  setSizeRange,
  isNewChart,
  setIsNewChart,
  fetch,
  upperOrLower,
  table,
  setTable,
  setSuccessOrError,
  t,
  picturePreference 
}) => {
  
  const gridDataRef = useRef();

  const [selectedFile, setSelectedFile] = useState();
  const [isChild, setIsChild] = useState(false);
  const hiddenFileInput = useRef();

  const [selectGender, setSelectGender] = useState("woman");

  const handleSelectGenderChange = useCallback(
    (_checked, newValue) => setSelectGender(newValue),
    []
  );

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
  console.log(measurements, `MEASUREMENTSCUSTOMSLIDEPANELLLLLLLLLLLLLLLLLLLLL`)
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
  console.log(measurementList, `measurementListtt`)

  const handleMeasurementCheckChange = (position) => {
    console.log(position, "position")
    if (
      upperOrLower === "upper" &&
      (measurementList[position].label === "Shoulder" ||
        measurementList[position].label === "Chest"
        || measurementList[position].label === "Bottomwidth"
        || measurementList[position].label === "Sleevelength"
        || measurementList[position].label === "Length")
    )
      return;
    if (
      upperOrLower === "lower" &&
      (measurementList[position].label === "Waist" ||
        measurementList[position].label === "Hip" || measurementList[position].label === "Outseam"
        || measurementList[position].label === "Inseam")
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

  const [name, setName] = useState("");

  // TODO
  const handleFileInputChange = async (e) => {
    setSelectedFile(e.target.files[0]);
    const formData = new FormData();

    formData.append("file", selectedFile);

    try {
      /////////////////////////// FAST FIX
      /////////////////////////// FAST FIX
      /////////////////////////// FAST FIX
      /////////////////////////// FAST FIX
      /////////////////////////// FAST FIX
      /////////////////////////// FAST FIX
      /////////////////////////// FAST FIX
/*       await fetch("/tables/uploadTable", { body: formData, method: "POST" }); */
      /////////////////////////// FAST FIX
      /////////////////////////// FAST FIX
      /////////////////////////// FAST FIX
      /////////////////////////// FAST FIX
      /////////////////////////// FAST FIX
      // SEND AS FORM DATA NO API FOUND IN BACKEND
   /*    alert(t("DashboardPage.42")); */

      // TOAST I18N
    } catch (err) {
      alert(err);
    }
  };

  const saveTable = async () => {
    const values = gridDataRef.current.gridData();
    try {
      values.forEach((value) => {
        for (const key in value) {
          if (key !== "size") {
            if (!measurements.includes(capitalizeFirtsLetter(key))) {
              delete value[key];
            }
          } else {
            if (!sizeRange.includes(value[key])) {
              delete value[key];
            }
          }
        }
      });

      console.log(values);

      await saveSizeCharts(fetch, {
        sizes: values,
        chartName: name,
        gender: selectGender,
        productGroup: upperOrLower,
        picturePreference
      });

      setOpenSlidePanel(false);

      setIsNewChart(!isNewChart);
    } catch (err) {
      setSuccessOrError({
        message: t(`Errors.${err.message}`),
        success: false,
      });
    }
  };

  return (
    <div className="slidePanel">
      <div className="slidePanel-header">
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <VerticalStack >
            <Text as="h" fontWeight="bold" >{t("DashboardPage.34")}</Text>
            <Text variation="subdued">{t("DashboardPage.35")}</Text>
          </VerticalStack>
          <HorizontalStack gap="4">
          <Button
             secondary
              onClick={() => {
                setOpenSlidePanel(false);
              }}
            >
              {t("DashboardPage.40")}
            </Button>
          <Button
            primary
            onClick={() => {
              saveTable();
            
             
            }}
          >
            {t("DashboardPage.36")}
          </Button>
          </HorizontalStack >
        </div>
      </div>
      <div className="slidePanel-content">
        <VerticalStack gap="4">
          <HorizontalStack gap="4">
            <RadioButton
              label={t("DashboardPage.38")}
              checked={selectGender === "woman"}
              id="woman"
              name="gender"
              onChange={handleSelectGenderChange}
            />
            <RadioButton
              label={t("DashboardPage.37")}
              id="man"
              name="gender"
              checked={selectGender === "man"}
              onChange={handleSelectGenderChange}
            />
          </HorizontalStack>

          <HorizontalStack gap="5">
            {sizeRangeList.map((item, index) => (
              <Checkbox
                key={index}
                label={item.label}
                checked={sizeCheck[index]}
                onChange={() => handleSizeCheckChange(index)}
               
              />
            ))}
  </HorizontalStack>
  
          <HorizontalStack gap="5">
            {measurementList.map((item, index) => (
              <>
                <Checkbox
                  key={index}
                  label={t(`DashboardPage.${item.label}`)}
                  checked={measurementCheck[index]}
                  onChange={() => handleMeasurementCheckChange(index)}
                  disabled={true}
                />
             
              </>
            ))}
          </HorizontalStack>
          <HorizontalStack gap="5">
    <Checkbox 
    key="50044"
    label="Is it a children product?"
    checked={isChild}
    onChange={() => setIsChild(prev => !prev)}/>
  </HorizontalStack>
          <TextField
            label="Name"
            type="text"
    
            value={name}
            onChange={(e) => setName(e)}
            helpText="Name for table"
          />

          <div
            className="sizetable-wrapper"
            style={{ height: 50 + sizeRange.length * 49 }}
          >
            <SizeDataGrid
              table={table}
              sizeRange={sizeRange}
              measurements={measurements}
              setTable={setTable}
              ref={gridDataRef}
            />
          </div>
          <input
            style={{ display: "none" }}
            ref={hiddenFileInput}
            type="file"
            onChange={handleFileInputChange}
          />
        </VerticalStack>
      </div>
    </div>
  );
};

export default CustomSlidePanel;
