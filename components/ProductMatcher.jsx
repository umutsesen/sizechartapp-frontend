import React, { useState, useEffect, useCallback } from "react";
import {

  Toast,

  ChoiceList,
  Button,
  Popover,
  ActionList,
  Tooltip,
  Autocomplete,
  LegacyStack,
  Tag,
  VerticalStack,
  Text,
  Spinner,
  Select,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";


import { LegacyCard, Layout } from "@shopify/polaris";

import CustomProductsModal from "./CustomProductsModal";
import LinkButton from "./sizemeComponents/LinkButton";
import { getDefaultInformation } from "../apis/sizeCharts";
import { useTranslation } from "react-i18next";

const accountInfo = ({
  fetch,
  shopOrigin,
  setDefaultInfo,
  chartId,
  setHasFormChanged,
}) => {
  ///// toast
  const { t } = useTranslation();
  const [toastActive, toastSetActive] = useState(false);
  const toggleActive = useCallback(
    () => toastSetActive((toastActive) => !toastActive),
    []
  );
  const toastMarkup = toastActive ? (
    <Toast content={t("productMatchPage.25")} onDismiss={toggleActive} />
  ) : null;
  ///
  const [formSubmitButton, setFormSubmitButton] = useState(true);
  const [openResourcePicker, setOpenResourcePicker] = useState(false);
  const [resourceType, setResourceType] = useState("Product");
  const [selected, setSelected] = useState(["any"]);
  const [popoverActive, setPopoverActive] = useState(false);
  const [productTagList, setProductTagList] = useState([]);
  const [productVendorList, setProductVendorList] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);

  //for matched all products
  const [productAmount, setProductAmount] = useState("");
  const [products, setProducts] = useState([]);

  ///

  const [options, setOptions] = useState([]);

  const [paramsTags, setParamsTags] = useState([]);
  const [paramsProductTypes, setParamsProductTypes] = useState([]);
  const [paramsVendors, setParamsVendors] = useState([]);
  const [paramsCollections, setParamsCollections] = useState([]);
  const [paramsProducts, setParamsProducts] = useState([]);
  // for selecting products from ResourcePicker

  /////
  const [productsTitlesAndId, setProductsTitlesAndId] = useState([]);

  const [productsResourcePicker, setProductsResourcePicker] = useState([]);
  const [collectionsResourcePicker, setCollectionsResourcePicker] = useState(
    []
  );
  const [choice, setChoice] = useState("");

  const [loading, setLoading] = useState(false);
  const [showOption, setShowOption] = useState("options");
  const [productModal, setProductModal] = useState(false);
  const toggleProductModalActive = useCallback(
    () => setProductModal((active) => !active),
    []
  );

  //select
  const [selectedChoiceTag, setSelectedChoiceTag] = useState([]);

  useEffect(() => {
    (async () => {
      getProductTags();
    })();
  }, []);

  const handleSelectChange = useCallback(
    (value, option, isRemove) => {
      let replaceIndex = selectedChoiceTag;
      if (isRemove) {
        delete replaceIndex[option];
        setSelectedChoiceTag(replaceIndex);
        console.log(value, "ADSFASDF", replaceIndex, "ADSFASDF");
        if (replaceIndex.length === 0)
          setDefaultInfo((prev) => ({
            ...prev,
            query: "",
            selectedChoiceTag: replaceIndex,
          }));
        else
          setDefaultInfo((prev) => ({
            ...prev,
            selectedChoiceTag: replaceIndex,
          }));
      } else {
        if (value !== null) {
          replaceIndex[option] = value;
          setDefaultInfo((prev) => ({
            ...prev,
            selectedChoiceTag: replaceIndex,
          }));
          setSelectedChoiceTag(replaceIndex);
          getProductsFromAPI("normal");
        }
      }
      setHasFormChanged(true);
      setSelectedOptions((prev) => [...prev]);

      //sor
    },
    [
      selectedChoiceTag,
      paramsTags,
      paramsVendors,
      paramsProductTypes,
      paramsProducts,
      paramsCollections,
    ]
  );
  useEffect(() => {
    (async () => {
      console.log(
        paramsTags,
        paramsProductTypes,
        paramsVendors,
        paramsCollections,
        paramsProducts,
        selected
      );
      if (
        paramsTags.length > 0 ||
        paramsVendors.length > 0 ||
        paramsProductTypes.length > 0 ||
        paramsCollections.length > 0 ||
        paramsProducts.length > 0
      )
        getProductsFromAPI("normal");
    })();
  }, [
    paramsTags,
    paramsProductTypes,
    paramsVendors,
    paramsCollections,
    paramsProducts,
    selected,
  ]);

  const tagSelectOptions = [
    {
      label: "is",
      value: "",
    },
    {
      label: "is not",
      value: "0not",
    },
  ];

  //select end

  const handleChange = useCallback((value) => {
    setSelected(value);
  }, []);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const showItems = useCallback((choice) => {
    setHasFormChanged(true);
    if (choice === "products") {
      setResourceType("Product");
      setOpenResourcePicker(true);
    }
    if (choice === "collections") {
      setResourceType("Collection");
      setOpenResourcePicker(true);
    }
    if (choice === "tags") {
      setShowOption("tags");
    }
    if (choice === "vendor") {
      setShowOption("vendor");
    }
    if (choice === "producttypes") {
      setShowOption("producttypes");
    }
    if (choice === "allproducts") {
      getProductsFromAPI("allproducts");
      setPopoverActive(false);
      setChoice("allproducts");
    }
  }, []);
  const getProductsFromAPI = async (condition) => {
    console.log("GETPRODUCTS API WORKNIGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
  
    setFormSubmitButton(false);
    if (condition === "normal") {
      if (selectedOptions.length > 0) {
        let tagsCheck = paramsTags.map((val) => {
          if (selectedChoiceTag[val]) return val + selectedChoiceTag[val];
          else return val;
        });

        let vendorsCheck = paramsVendors.map((val) => {
          if (selectedChoiceTag[val]) return val + selectedChoiceTag[val];
          else return val;
        });
        console.log("999999999");
        let productTypesCheck = paramsProductTypes.map((val) => {
          if (selectedChoiceTag[val]) return val + selectedChoiceTag[val];
          else return val;
        });
        console.log("91238921398218938291389213");
        let collectionsCheck = paramsCollections.map((val) => {
          if (selectedChoiceTag[val]) return val + selectedChoiceTag[val];
          else return val;
        });

        let productsCheck = paramsProducts.map((val) => {
          if (selectedChoiceTag[val]) return val + selectedChoiceTag[val];
          else return val;
        });

        let optionsArray = [];
        if (tagsCheck.length > 0) optionsArray.push("tags");
        if (productTypesCheck.length > 0) optionsArray.push("product_type");
        if (vendorsCheck.length > 0) optionsArray.push("vendor");
        if (collectionsCheck.length > 0) optionsArray.push("collectionNames");
        if (productsCheck.length > 0) optionsArray.push("id");
        setOptions(optionsArray);
        const productList = await fetch(
          `/api/store/conditionResults?condition=${selected[0]}${
            productsCheck.length > 0 === true
              ? `&products=` + productsCheck.toString()
              : ""
          }${
            tagsCheck.length > 0 === true ? `&tags=` + tagsCheck.toString() : ""
          }${
            vendorsCheck.length > 0 === true
              ? `&vendors=` + vendorsCheck.toString()
              : ""
          }${
            productTypesCheck.length > 0 === true
              ? `&types=` + productTypesCheck.toString()
              : ""
          }${
            collectionsCheck.length > 0 === true
              ? `&collectionNames=` + collectionsCheck.toString()
              : ""
          }${
            optionsArray.length > 0 === true
              ? `&options=` + optionsArray.toString()
              : ""
          }`
        );
        const sendRequest = await productList.json();

        await setProducts(sendRequest.products);
        await setProductAmount(sendRequest.count);
        console.log(optionsArray, 1213123123);
        if (optionsArray.length > 0) {
          setChoice("normal");
          setDefaultInfo({
            query: `/store/conditionResults?condition=${selected[0]}${
              productsCheck.length > 0 === true
                ? `&products=` + productsCheck.toString()
                : ""
            }${
              tagsCheck.length > 0 === true
                ? `&tags=` + tagsCheck.toString()
                : ""
            }${
              vendorsCheck.length > 0 === true
                ? `&vendors=` + vendorsCheck.toString()
                : ""
            }${
              productTypesCheck.length > 0 === true
                ? `&types=` + productTypesCheck.toString()
                : ""
            }${
              collectionsCheck.length > 0 === true
                ? `&collectionNames=` + collectionsCheck.toString()
                : ""
            }${
              optionsArray.length > 0 === true
                ? `&options=` + optionsArray.toString()
                : ""
            }`,
            condition: selected[0],
            choice: "normal",
            selected,
            resourceType,
            selectedOptions,
            paramsProducts,
            paramsTags,
            paramsProductTypes,
            paramsVendors,
            paramsCollections,
            productsTitlesAndId,
            showOption,
            productsResourcePicker,
            collectionsResourcePicker,
            selectedChoiceTag,
            options,
            extractOptions: optionsArray,
          });
        }
      }
    }
    if (condition === "allproducts") {
      const productList = await fetch(
        "/api/store/conditionResults?condition=allproducts"
      );
      const sendRequest = await productList.json();
      await setProducts(sendRequest.products);
      await setProductAmount(sendRequest.count);
      setDefaultInfo({
        query: "/store/conditionResults?condition=allproducts",
        condition,
        choice: "allproducts",
      });
    }
  };

  const cleanAllProducts = async () => {
    console.log("CLEANNNNNNNNNNNNNNNNNNNNNNNN");
    setProducts([]);
    setProductAmount("");
    setChoice("");
    setSelectedOptions([]);
    setSelectedChoiceTag([]);
    setParamsTags([]);
    setParamsProductTypes([]);
    setParamsVendors([]);
    setParamsCollections([]);
    setParamsProducts([]);
    setCollectionsResourcePicker([]);
    setProductsResourcePicker([]);
    setProductsTitlesAndId([]);
    setOptions([]);
    setDefaultInfo({
      query: "",
      choice: "",
      condition: "",
      selected,
      resourceType,
      selectedOptions,
      paramsProducts,
      paramsTags,
      paramsProductTypes,
      paramsVendors,
      paramsCollections,
      productsTitlesAndId,
      showOption,
      productsResourcePicker,
      collectionsResourcePicker,
      selectedChoiceTag,
      options,
    });
  };

  // productTag Area

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValueTag, setInputValueTag] = useState("");
  const [inputValueVendor, setInputValueVendor] = useState("");
  const [inputValueProductType, setInputValueProductType] = useState("");
  const [optionsTag, setOptionsTag] = useState(productTagList);
  const [optionsVendor, setOptionsVendor] = useState(productVendorList);
  const [optionsProductTypes, setOptionsProductTypes] =
    useState(productTypeList);

  const updateTextTag = useCallback(
    (value) => {
      setInputValueTag(value);

      /*   if (value === '') {
          setOptionsTag(productTagList);
          return;
        } */
      let filterSelected = productTagList.filter(
        (product) => !selectedOptions.includes(product.label)
      );
      const filterRegex = new RegExp(value, "i");
      const resultOptions = filterSelected.filter((option) =>
        option.label.match(filterRegex)
      );

      setOptionsTag(resultOptions);
    },
    [productTagList, optionsTag, selectedOptions]
  );
  const updateTextProductType = useCallback(
    (value) => {
      setInputValueProductType(value);

      /*  if (value === '') {
          setOptionsProductTypes(productTypeList);
          return;
        } */
      let filterSelected = productTypeList.filter(
        (product) => !selectedOptions.includes(product.label)
      );
      const filterRegex = new RegExp(value, "i");
      const resultOptions = filterSelected.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptionsProductTypes(resultOptions);
    },
    [productTypeList, optionsProductTypes, selectedOptions]
  );

  const updateTextVendor = useCallback(
    (value) => {
      setInputValueVendor(value);

      /*   if (value === '') {
          setOptionsVendor(productVendorList);
          return;
        }
   */
      let filterSelected = productVendorList.filter(
        (product) => !selectedOptions.includes(product.label)
      );
      const filterRegex = new RegExp(value, "i");
      const resultOptions = filterSelected.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptionsVendor(resultOptions);
    },
    [productVendorList, optionsVendor, selectedOptions]
  );

  const removeTag = useCallback(
    (tag, type) => () => {
      handleSelectChange(null, tag, true);
      console.log("REMOVETAG WORKINNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN");
      if (type === "tag") {
        const newTags = [...paramsTags];
        newTags.splice(newTags.indexOf(tag), 1);
        console.log(newTags, "09912312312123210213123123123123");
        setParamsTags(newTags);
        setDefaultInfo((prev) => ({ ...prev, paramsTags: newTags }));
      }
      if (type === "vendor") {
        const newVendors = [...paramsVendors];
        newVendors.splice(newVendors.indexOf(tag), 1);
        console.log(newVendors, "09912312312123210213123123123123");
        setParamsVendors(newVendors);
        setDefaultInfo((prev) => ({ ...prev, paramsVendors: newVendors }));
      }
      if (type === "productType") {
        const newProductTypes = [...paramsProductTypes];
        newProductTypes.splice(newProductTypes.indexOf(tag), 1);
        console.log(newProductTypes, "09912312312123210213123123123123");
        setParamsProductTypes(newProductTypes);
        setDefaultInfo((prev) => ({
          ...prev,
          paramsProductTypes: newProductTypes,
        }));
      }
      if (type === "product") {
        const newProducts = [...paramsProducts];
        const a = [...productsTitlesAndId];
        const indexOf = newProducts.indexOf(tag);

        newProducts.splice(indexOf, 1);
        a.splice(indexOf, 1);
        setProductsTitlesAndId(a);
        setParamsProducts(newProducts);
        setProductsResourcePicker(newProducts);
        setDefaultInfo((prev) => ({
          ...prev,
          productsResourcePicker: newProducts,
          paramsProducts: newProducts,
          productsTitlesAndId: a,
        }));
      }
      if (type === "collection") {
        const newCollections = [...paramsCollections];
        console.log(newCollections);
        newCollections.splice(newCollections.indexOf(tag), 1);
        console.log(newCollections, "09912312312123210213123123123123");
        setParamsCollections(newCollections);
        setDefaultInfo((prev) => ({
          ...prev,
          paramsCollections: newCollections,
        }));
      }
      //collectıons ve product

      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
      setDefaultInfo((prev) => ({ ...prev, selectedOptions: options }));
      console.log(
        "ENNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD"
      );
      if (options.length === 0) {
        setSelectedOptions([]);
        console.log("gdsfgsdgdafgdafgdfag");
        setChoice("");
        setProductAmount("");
        setProducts([]);
        setDefaultInfo((prev) => ({
          ...prev,
          choice: "",
          selectedOptions: [],
          options: [],
        }));
        setOptions([]);
      }
    },
    [
      selectedOptions,
      productsTitlesAndId,
      paramsCollections,
      paramsProducts,
      setParamsTags,
      setParamsVendors,
      setParamsProductTypes,
      setProductsResourcePicker,
      setParamsCollections,
      setParamsProducts,
      setProductsTitlesAndId,
      setSelectedOptions,
      setChoice,
      setProductAmount,
      setProducts,
    ]
  );

  const tagsMarkup = selectedOptions.map((option) => {
    console.log(selectedOptions, option, "ADSFDASF");

    let tagLabel = "";
    tagLabel = option.replace("_", " ");
    tagLabel = titleCase(tagLabel);

    const isTag = productTagList.filter((val) => val.value === option);

    if (isTag.length > 0) {
      return (
        <Tag key={`option${option}`} onRemove={removeTag(option, "tag")}>
          <div
            style={{
              display: "flex",
              padding: "3px",
              fontSize: "1rem",
              alignItems: "center",
            }}
            className="defaultcursor"
          >
            <span style={{ marginRight: "10px" }}>
              {t("productMatchPage.0")}
            </span>
            <Select
              options={tagSelectOptions}
              onChange={(props) => {
                handleSelectChange(props, option);
              }}
              value={selectedChoiceTag[option]}
            />
            <span style={{ marginLeft: "10px", cursor: 'pointer' }}>
              <Tooltip active={false} content={t("productMatchPage.2")}>
                <a
                  href={
                    "https://" +
                    shopOrigin +
                    "/collections/all/" +
                    tagLabel.replace(/\s+/g, "-").toLowerCase()
                  }
                  style={{ color: "#2c6ecb" }}
                  target="_blank"
                >
                  {" "}
                  :{tagLabel}
                </a>
              </Tooltip>
            </span>
          </div>
        </Tag>
      );
    } else {
      const isVendor = productVendorList.filter((val) => val.value === option);
      if (isVendor.length > 0) {
        return (
          <Tag key={`option${option}`} onRemove={removeTag(option, "vendor")}>
            <div
              style={{
                display: "flex",
                padding: "3px",
                fontSize: "1rem",
                alignItems: "center",
              }}
              className="defaultcursor"
            >
              <span style={{ marginRight: "10px" }}>
                {t("productMatchPage.1")}
              </span>
              <Select
                options={tagSelectOptions}
                onChange={(props) => {
                  handleSelectChange(props, option);
                }}
                value={selectedChoiceTag[option]}
              />
              <span style={{ marginLeft: "10px", cursor: 'pointer' }}>
                <Tooltip active={false} content={t("productMatchPage.2")}>
                  <a
                    href={
                      "https://" +
                      shopOrigin +
                      "/collections/vendors?q=" +
                      tagLabel
                    }
                    style={{ color: "#2c6ecb" }}
                    target="_blank"
                  >
                    {" "}
                    :{tagLabel}
                  </a>
                </Tooltip>
              </span>
            </div>
          </Tag>
        );
      } else {
        const isProductType = productTypeList.filter(
          (val) => val.value === option
        );

        if (isProductType.length > 0) {
          return (
            <Tag
              key={`option${option}`}
              onRemove={removeTag(option, "productType")}
            >
              <div
                style={{
                  display: "flex",
                  padding: "3px",
                  fontSize: "1rem",
                  alignItems: "center",
                }}
                className="defaultcursor"
              >
                <span style={{ marginRight: "10px" }}>
                  {t("productMatchPage.4")}
                </span>
                <Select
                  options={tagSelectOptions}
                  onChange={(props) => {
                    handleSelectChange(props, option);
                  }}
                  value={selectedChoiceTag[option]}
                />
                <span style={{ marginLeft: "10px", cursor: 'pointer' }}>
                  <Tooltip active={false} content={t("productMatchPage.2")}>
                    <a
                      href={
                        "https://" +
                        shopOrigin +
                        "/collections/types?q=" +
                        tagLabel
                      }
                      style={{ color: "#2c6ecb" }}
                      target="_blank"
                    >
                      {" "}
                      :{tagLabel}
                    </a>
                  </Tooltip>
                </span>
              </div>
            </Tag>
          );
        } else {
          const isCollection = collectionsResourcePicker.filter(
            (val) => val === option
          );

          if (isCollection.length > 0) {
            return (
              <Tag
                key={`option${option}`}
                onRemove={removeTag(option, "collection")}
              >
                <div
                  style={{
                    display: "flex",
                    padding: "3px",
                    fontSize: "1rem",
                    alignItems: "center",
                  }}
                  className="defaultcursor"
                >
                  <span style={{ marginRight: "10px" }}>
                    {t("productMatchPage.4")}
                  </span>
                  <Select
                    options={tagSelectOptions}
                    onChange={(props) => {
                      handleSelectChange(props, option);
                    }}
                    value={selectedChoiceTag[option]}
                  />
                  <span style={{ marginLeft: "10px", cursor: 'pointer' }}>
                    <Tooltip active={false} content={t("productMatchPage.2")}>
                      <a
                        href={
                          "https://" +
                          shopOrigin +
                          "/collections/" +
                          tagLabel.replace(/\s+/g, "-").toLowerCase()
                        }
                        style={{ color: "#2c6ecb" }}
                        target="_blank"
                      >
                        {" "}
                        :{tagLabel}
                      </a>
                    </Tooltip>
                  </span>
                </div>
              </Tag>
            );
          } else {
            const indexOfProduct = productsResourcePicker.indexOf(tagLabel);
            console.log(productsTitlesAndId[indexOfProduct], tagLabel, indexOfProduct, "taglabelaaaaaaaaaaaaa");
            return (
              <Tag
                key={`option${option}`}
                onRemove={removeTag(option, "product")}
              >
                <div
                  style={{
                    display: "flex",
                    padding: "3px",
                    fontSize: "1rem",
                    alignItems: "center",
                  }}
                  className="defaultcursor"
                >
                  <span style={{ marginRight: "10px" }}>
                    {t("productMatchPage.5")}
                  </span>
                  <Select
                    options={tagSelectOptions}
                    onChange={(props) => {
                     
                      handleSelectChange(props, option);
                    }}
                    value={selectedChoiceTag[option]}
                  />
                  <span
                    style={{ marginLeft: "10px", cursor: 'pointer' }}
                    className="defaultcursor"
                  >
                      <Tooltip
                      active={false}
                      content={t("productMatchPage.2")}
                    >
                    <a
                         href={
                          "https://" +
                          shopOrigin +
                          "/products/" +
                          productsTitlesAndId[indexOfProduct].replace(/\s+/g, "-").toLowerCase()
                        }
                      style={{ color: "#2c6ecb" }}
                       target="_blank"
                    >
                      {" "}
                      :{productsTitlesAndId[indexOfProduct]}
                    </a>
                       </Tooltip>
                  </span>
                </div>
              </Tag>
            );
          }
        }
      }
    }
  });

  const textFieldTag = (
    <Autocomplete.TextField
      onChange={updateTextTag}
      label={t("productMatchPage.6")}
      value={inputValueTag}
    />
  );
  const textFieldVendor = (
    <Autocomplete.TextField
      onChange={updateTextVendor}
      label={t("productMatchPage.7")}
      value={inputValueVendor}
    />
  );
  const textFieldProductType = (
    <Autocomplete.TextField
      onChange={updateTextProductType}
      label={t("productMatchPage.8")}
      value={inputValueProductType}
    />
  );

  const getProductTags = async () => {
    console.log(productTagList, "213123123");
    if (productTagList.length === 0) {
      console.log(productTagList, "213123123");
      const productList = await fetch("/api/store/productTagsVendor");
      const sendRequest = await productList.json();
      console.log(productList, sendRequest, "3123123");
      await setProductTagList(sendRequest.tags);
      await setOptionsTag(sendRequest.tags);
      await setProductTypeList(sendRequest.product_types);
      await setOptionsProductTypes(sendRequest.product_types);
      await setProductVendorList(sendRequest.vendors);
      await setOptionsVendor(sendRequest.vendors);

      setLoading(false);
    }
  };

  const showOptions = (choice) => {
    if (choice === "options") {
      if (selected[0] === "any") {
        return (
          <ActionList
            items={[
              {
                content: t("productMatchPage.13"),
                onAction: () => showItems("products"),
              },
              {
                content: t("productMatchPage.12"),
                onAction: () => showItems("collections"),
              },
              {
                content: t("productMatchPage.11"),
                onAction: () => showItems("producttypes"),
              },
              {
                content: t("productMatchPage.10"),
                onAction: () => showItems("vendor"),
              },
              {
                content: t("productMatchPage.9"),
                onAction: () => showItems("tags"),
              },
              {
                content: t("productMatchPage.28"),
                onAction: () => showItems("allproducts"),
              },
            ]}
          />
        );
      } else if (paramsVendors.length === 0) {
        return (
          <ActionList
            items={[
              {
                content: t("productMatchPage.12"),
                onAction: () => showItems("collections"),
              },
              {
                content: t("productMatchPage.11"),
                onAction: () => showItems("producttypes"),
              },
              {
                content: t("productMatchPage.10"),
                onAction: () => showItems("vendor"),
              },
              {
                content: t("productMatchPage.9"),
                onAction: () => showItems("tags"),
              },
              {
                content: t("productMatchPage.28"),
                onAction: () => showItems("allproducts"),
              },
            ]}
          />
        );
      } else {
        return (
          <ActionList
            items={[
              {
                content: t("productMatchPage.9"),
                onAction: () => showItems("collections"),
              },
              {
                content: t("productMatchPage.11"),
                onAction: () => showItems("producttypes"),
              },
              {
                content: t("productMatchPage.9"),
                onAction: () => showItems("tags"),
              },
              {
                content: t("productMatchPage.28"),
                onAction: () => showItems("allproducts"),
              },
            ]}
          />
        );
      }
    }
    if (choice === "tags") {
      console.log(optionsTag, selectedOptions);
      return (
        <div style={{ padding: "10px" }}>
          <Autocomplete
            autoComplete="new-password"
            options={optionsTag}
            selected={selectedOptions}
            textField={textFieldTag}
            onSelect={(props) => {
              setSelectedOptions((prev) => [...prev, ...props]);

              setOptionsTag(
                optionsTag.filter((product) => product.label !== props[0])
              );
              setPopoverActive(false);
              setShowOption("options");

              setParamsTags((prev) => [...prev, props[0]]);

              // this element of polaris does not support multiple choice without checkboxes
              // also chosen elements stay even after choosing. this way they are deleted.
            }}
          />
        </div>
      );
    }
    if (choice === "vendor") {
      return (
        <div style={{ padding: "10px" }}>
          <Autocomplete
            autoComplete="new-password"
            options={optionsVendor}
            selected={selectedOptions}
            textField={textFieldVendor}
            onSelect={(props) => {
              setSelectedOptions((prev) => [...prev, ...props]);
              setOptionsVendor(
                optionsVendor.filter((product) => product.label !== props[0])
              );
              setPopoverActive(false);
              setShowOption("options");
              setParamsVendors((prev) => [...prev, props[0]]);
              // this element of polaris does not support multiple choice without checkboxes
              // also chosen elements stay even after choosing. this way they are deleted.
            }}
          />
        </div>
      );
    }
    if (choice === "producttypes") {
      console.log(optionsProductTypes);
      return (
        <div style={{ padding: "10px" }}>
          <Autocomplete
            autoComplete="new-password"
            options={optionsProductTypes}
            selected={selectedOptions}
            textField={textFieldProductType}
            onSelect={(props) => {
              setSelectedOptions((prev) => [...prev, ...props]);
              setOptionsProductTypes(
                optionsProductTypes.filter(
                  (product) => product.label !== props[0]
                )
              );
              setPopoverActive(false);
              setShowOption("options");
              setParamsProductTypes((prev) => [...prev, props[0]]);
              // this element of polaris does not support multiple choice without checkboxes
              // also chosen elements stay even after choosing. this way they are deleted.
            }}
          />
        </div>
      );
    }
  };

  function titleCase(string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.replace(word[0], word[0].toUpperCase()))
      .join("");
  }

  //end
  /// select options

  ////

  const activator = (
    <Button
      onClick={() => {
        console.log("111", popoverActive);
        if (popoverActive) {
          setShowOption("options");
        } else {
          console.log("xxxxx");

          console.log("xxxxx");
        }
        togglePopoverActive();
        console.log("777");
      }}
      disclosure
    >
      {t("productMatchPage.27")}
    </Button>
  );

  const handleSelection = async (resources, type) => {
    console.log(resources, type);
    setOpenResourcePicker(false);
    if (type === "collection") {
      let clearExtraInfo = resources.selection.map((resource) => {
        /*     let id = resource.id.split("n/")[1] */
        return /* {title:  */ resource.title /* , id */ /* } */;
      });
      console.log(
        clearExtraInfo,
        "ASDddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
      );
      /*  let getTitle = resources.selection.map((resource) => resource.title)
      setProductsResourcePicker((products) => [...products, ...clearExtraInfo])
      setSelectedOptions((prev) => [...prev, ...getTitle]); */
      const removeDuplicates = [
        ...new Set([...clearExtraInfo, ...collectionsResourcePicker]),
      ];
      const removeSelectedDuplicates = [
        ...new Set([...selectedOptions, ...clearExtraInfo]),
      ];
      setCollectionsResourcePicker(removeDuplicates);
      setSelectedOptions(removeSelectedDuplicates);
      console.log(removeDuplicates);
      setParamsCollections(removeDuplicates);
      setPopoverActive(false);
      setShowOption("options");
    } else {
      let getTitle = resources.selection.map((resource) => resource.title);
      let getProductId = resources.selection.map((resource) =>
        resource.id.split("t/").pop()
      );
      console.log(
        productsResourcePicker,
        selectedOptions,
        productsTitlesAndId,
        "XXXXXXXXXXXXXXXXXXXXX"
      );
      //resource picker ve id temizlencek, collections da da oyle. yoksa ayinisi pert
      const removeDuplicates = [
        ...new Set([...productsResourcePicker, ...getProductId]),
      ];
      console.log("asdasdasdasd", removeDuplicates);

      const removeSelectedDuplicates = [
        ...new Set([...selectedOptions, ...getProductId]),
      ];
      const removeTitleDuplicates = [
        ...new Set([...productsTitlesAndId, ...getTitle]),
      ];
      setProductsResourcePicker(removeDuplicates);
      setProductsTitlesAndId(removeTitleDuplicates);

      setSelectedOptions(removeSelectedDuplicates);
      setParamsProducts(removeDuplicates);
      console.log(paramsProducts, "C");
      setPopoverActive(false);
      setShowOption("options");
      /*  const newId =  resources.selection[0].id.split('t/').pop();
      const newProduct = {
        title: resources.selection[0].title,
        image: resources.selection[0].images[0],
        id: newId
      }
      await setProducts(prev => [...prev, newProduct])
      console.log(getTitle, removeDuplicates, selectedOptions, removeSelectedDuplicates, "DFfd")
      if (!selectedOptions.includes(getTitle[0])) setProductAmount(prev => Number(prev) + 1)
      
      setChoice("normal"); */
    }
  };

  useEffect(() => {
    //get defaultValues
    (async () => {
      console.log("!@###########DASDASD");
      const sendRequest = await getDefaultInformation({ fetch }, chartId);
      console.log(sendRequest);
      setSelected(sendRequest.selected);
      setParamsProductTypes(sendRequest.paramsProductTypes);
      setParamsVendors(sendRequest.paramsVendors);
      setParamsCollections(sendRequest.paramsCollections);
      setParamsProducts(sendRequest.paramsProducts);
      setParamsTags(sendRequest.paramsTags);
      setProductsTitlesAndId(sendRequest.productsTitlesAndId);
      console.log(sendRequest.productsResourcePicker, "ADSASDASD");
      await setProductsResourcePicker(sendRequest.productsResourcePicker);
      setCollectionsResourcePicker(sendRequest.collectionsResourcePicker);
      setShowOption(sendRequest.showOption);
      setSelectedChoiceTag(sendRequest.selectedChoiceTag);
      setProducts(sendRequest.products);
      setProductAmount(sendRequest.count);
      setOptions(sendRequest.options);
      let x = sendRequest.selectedOptions;
      console.log(x, sendRequest.selectedOptions);
      await setSelectedOptions(x);
      await setChoice(sendRequest.choice);
      await setDefaultInfo({
        query: sendRequest.query,
        selected,
        resourceType,
        selectedOptions,
        paramsProducts,
        paramsTags,
        paramsProductTypes,
        paramsVendors,
        paramsCollections,
        productsTitlesAndId,
        showOption,
        productsResourcePicker,
        collectionsResourcePicker,
        selectedChoiceTag,
        choice: sendRequest.choice,
        options,
      });
      console.log(selectedOptions, sendRequest.selectedOptions);
    })();
  }, []);

  return (
    <>
      <Layout>
        <Layout.Section>
          {/*    <LegacyCard title="Edit Size Chart Details" sectioned> */}

          <div>
            {resourceType === "Product" ? (
              <ResourcePicker // Resource picker component
                resourceType="Product"
                key="productPicker"
                showVariants={false}
                open={openResourcePicker}
                onSelection={(resources) =>
                  handleSelection(resources, "product")
                }
                onCancel={() => setOpenResourcePicker(false)}
              />
            ) : (
              <ResourcePicker // Resource picker component
                resourceType="Collection"
                key="collectionPicker"
                selectMultiple={true}
                showVariants={false}
                open={openResourcePicker}
                onSelection={(resources) =>
                  handleSelection(resources, "collection")
                }
                onCancel={() => setOpenResourcePicker(false)}
              />
            )}

           
          </div>
          {/*     </LegacyCard> */}
        </Layout.Section>
        <Layout.Section>
          <LegacyCard>
            <LegacyCard.Section>
              <Text  variant="bodyLg" as="p"  fontWeight="semibold">{t("productMatchPage.14")}</Text>
            </LegacyCard.Section>
            <LegacyCard.Section>
              <ChoiceList
                choices={[
                  {
                    label: t("productMatchPage.15"),
                    value: "any",
                  },
                  {
                    label: t("productMatchPage.16"),
                    value: "all",
                  },
                ]}
                selected={selected}
                onChange={handleChange}
              />
            </LegacyCard.Section>
            {choice === "" ? null : (
              <LegacyCard.Section>
                <VerticalStack style={{ width: "100%" }}>
                  <div style={{ overflowY: "auto", maxHeight: "30rem" }}>
                    <LegacyStack>
                      {choice === "allproducts" ? (
                        <Tag
                          key="optionAllProducts"
                          onRemove={() => cleanAllProducts()}
                        >
                          <div
                            style={{
                              display: "flex",
                              padding: "3px",
                              fontSize: "1rem",
                              alignItems: "center",
                              cursor: 'pointer'
                            }}
                          >
                            <a style={{ color: "#2c6ecb" }} target="_blank">
                              {t("productMatchPage.17")}
                            </a>
                          </div>
                        </Tag>
                      ) : (
                        tagsMarkup
                      )}
                    </LegacyStack>
                  </div>
                </VerticalStack>
              </LegacyCard.Section>
            )}
            <LegacyCard.Section>
              <VerticalStack>
                {choice === "normal" ? (
                  <div style={{ marginBottom: "2rem"}}>
                    <LinkButton onClick={toggleProductModalActive}>
                      {productAmount} {t("productMatchPage.18")}
                    </LinkButton>
                  </div>
                ) : null}
              </VerticalStack>
              {choice === "allproducts" ? (
                 <div style={{ marginBottom: "2rem"}}>
                <LinkButton onClick={toggleProductModalActive}>
                  {productAmount} {t("productMatchPage.18")}
                </LinkButton>
                </div>
              ) : loading === true ? (
                <Spinner accessibilityLabel="Loading" size="large" />
              ) : (
                <Popover
                  fluidContent={true}
                  /*    fullHeight={true}
      fullWidth={true} */
                  active={popoverActive}
                  activator={activator}
                  onClose={() => console.log("1")}
                >
                  {showOptions(showOption)}
                </Popover>
              )}
            </LegacyCard.Section>
          </LegacyCard>
        </Layout.Section>
        {toastMarkup}
        <CustomProductsModal
          active={productModal}
          toggleActive={toggleProductModalActive}
          amount={productAmount}
          products={products}
          shopOrigin={shopOrigin}
          t={t}
        />
      </Layout>
    </>
  );
};

export default accountInfo;
