import React, { useState, useCallback, useEffect } from "react";
import CustomModal from "../components/CustomModal";
import {
  Layout,
  TextField,
  Icon,
  ResourceList,
  ResourceItem,
  Tabs,
  Page,
  Badge,
  Text,
  LegacyCard,
  Toast,
  Frame,
  Modal,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonTabs,
  VerticalStack,
} from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import ChartEdit from "../components/ChartEdit";
import CustomSlidePanel from "../components/CustomSlidePanel";
import {
  yearDiff,
  monthDiff,
  weekDiff,
  dayDiff,
} from "../variables/timeDifferences";
import { CSSTransition } from "react-transition-group";

import ActiveExtension from "../components/beforeLoad/activeExtension";

import {
  getUserSizeCharts,
  deleteUserSizeCharts,
  publishSelectedSizeCharts,
  unPublishSelectedSizeCharts,
  deleteSizeChart,
} from "../apis/sizeCharts";


import { useTranslation } from "react-i18next";
import { saveUserProducts } from "../apis/user";
import { useAuthenticatedFetch } from "../hooks";

import SizeMeButton from "../components/sizemeComponents/Button";
import "../styles/styles.css";
import "../styles/modals.scss";
import "../styles/components.scss";


const Tab3Page = ({ userInfo }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = useCallback((newValue) => setSearchQuery(newValue), []);

  console.log(userInfo, "3123")
  const fetch = useAuthenticatedFetch();
  const [shopOrigin, setShopOrigin] = useState();
  const [extensionModalActive, setExtensionModalActive] = useState(false);
  const [isExtensionActivated, setIsExtensionActivated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openSlidePanel, setOpenSlidePanel] = useState(false);
 
  useEffect(() => {
    (async () => {
      console.log(userInfo, 'userInfo')
      if (!userInfo) return;

      if (
        userInfo.appExtensionStatus.isEmbedActive === false ||
        userInfo.appExtensionStatus.isBlockActive === false
      ) {
        setExtensionModalActive(true);
        setIsExtensionActivated(false);
      } else {
        setIsExtensionActivated(true);
      }
     /*  console.log(userInfo.storeData.domain, "userInfo.storeData.domain") */
      setShopOrigin(userInfo.storeData.domain);
      await saveUserProducts({ fetch });
    
    })();
  }, [userInfo]);


  const [upperOrLower, setUpperOrLower] = useState();
  const [sortValue, setSortValue] = useState("desc");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sizeRange, setSizeRange] = useState([]);

  const [measurements, setMeasurements] = useState([]);
  const [picturePreference, setPicturePreference] = useState();

  const [selectedItems, setSelectedItems] = useState([]);

  const [items, setItems] = useState([]);
  const [deleteOptions, setDeleteOptios] = useState("");

  const [sizeChartItem, setSizeChartItem] = useState();

  const [tabSelected, setTabSelected] = useState(0);
 

  const [isChartEdit, setIsChartEdit] = useState(false);
  const [clickedChart, setClickedChart] = useState();

  const [isNewChart, setIsNewChart] = useState(false);

 
  const [table, setTable] = useState([]);

  const [successOrError, setSuccessOrError] = useState(null);
  const toastMarkup = successOrError ? (
    <Toast
      content={successOrError.message}
      error={!successOrError.success}
      onDismiss={() => setSuccessOrError(null)}
    />
  ) : null;

  useEffect(() => {
    (async () => {
      try {
        console.log(userInfo, "userInfo", shopOrigin, "shopOrigin")
        if (!userInfo || !shopOrigin) return;
        console.log(userInfo, "123123", shopOrigin, "s123123")
          const data = await getUserSizeCharts(fetch, sortValue);
          console.log(data, "data")
          setItems(data[0]?.charts);
          setLoading(false);
          console.log(userInfo, "5555Info", shopOrigin, "sho555555pOrigin")
        
      } catch (err) {
        setSuccessOrError({
          message: t(`Errors.${err.message}`),
          success: false,
        });
      }
    })();
  }, [isChartEdit, isNewChart, sortValue, shopOrigin, userInfo]);


  const goChartEdit = (item) => {
    setIsChartEdit(true);
    setClickedChart(item);
  };

  // Delete modal open close state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState();

  const handleDeleteModalChange = useCallback(
    () => setIsDeleteModalOpen(!isDeleteModalOpen),
    [isDeleteModalOpen]
  );
  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Hepsi seçildiğinde alınacak aksiyonlar
  const promotedBulkActions = [
    {
      content: t("DashboardPage.14"),
      onAction: () => {
        setDeleteOptios("multiple");
        handleDeleteModalChange();
      },
    },
    {
      content: t("DashboardPage.18"),
      onAction: async () => {
        try {
          await publishSelectedSizeCharts(fetch, selectedItems);
          setSelectedItems([]);
          setIsNewChart(!isNewChart);
        } catch (err) {
          setSuccessOrError({
            message: t(`Errors.${err.message}`),
            success: false,
          });
        }
      },
    },
    {
      content: t("DashboardPage.19"),
      onAction: async () => {
        try {
          await unPublishSelectedSizeCharts(fetch, selectedItems);
          setSelectedItems([]);
          setIsNewChart(!isNewChart);
        } catch (err) {
          setSuccessOrError({
            message: t(`Errors.${err.message}`),
            success: false,
          });
        }
      },
    },
  ];
  console.log(measurements, `measurementsIndexJSX`)
  if (loading) {
    return (
      <Frame>
        <SkeletonPage title="Dashboard" primaryAction>
          <Layout>
            <Layout.Section>
             
          
              <LegacyCard>
                <TextField
                  autoComplete="off"
                  placeholder={t("DashboardPage.2")}
                  type="text"
                  prefix={<Icon source={SearchMinor} color="base" />}
                />

                <LegacyCard.Section>
                  <SkeletonBodyText lines={2} />
                </LegacyCard.Section>
                <LegacyCard.Section>
                  <SkeletonBodyText lines={2} />
                </LegacyCard.Section>
              </LegacyCard>
            </Layout.Section>
          </Layout>
        </SkeletonPage>
      </Frame>
    );
  }
  return !isChartEdit && !loading ? (
    <Frame>
      <Page
        title="Dashboard"
        primaryAction={
          <SizeMeButton onClick={() => setModalIsOpen(true)}>
            {t("DashboardPage.20")}
          </SizeMeButton>
        }
      >
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
            <TextField
  autoComplete="off"
  placeholder={t("DashboardPage.2")}
  type="text"
  prefix={<Icon source={SearchMinor} color="base" />}
  value={searchQuery}
  onChange={handleSearchChange}
/>

              <ResourceList
                resourceName={{
                  singular: t("DashboardPage.6"),
                  plural: t("DashboardPage.7"),
                }}
                items={items && filteredItems}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                loading={loading}
                selectable
                sortValue={sortValue}
                idForItem={(item) => item._id}
                promotedBulkActions={promotedBulkActions}
                sortOptions={[
                  { label: t("DashboardPage.4"), value: "desc" },
                  { label: t("DashboardPage.5"), value: "asc" },
                ]}
                onSortChange={(selected) => {
                  setSortValue(selected);
                }}
                renderItem={(item, id) => {
                  const { _id, name } = item;

                  let lastUpdateDate;

                  if (yearDiff(item.timeStamp) !== 0) {
                    lastUpdateDate = `${yearDiff(item.timeStamp)} ${t(
                      "DashboardPage.8"
                    )}`;
                  } else if (monthDiff(item.timeStamp) !== 0) {
                    lastUpdateDate = `${monthDiff(item.timeStamp)} ${t(
                      "DashboardPage.9"
                    )}`;
                  } else if (weekDiff(item.timeStamp) !== 0) {
                    lastUpdateDate = `${weekDiff(item.timeStamp)} ${t(
                      "DashboardPage.10"
                    )}`;
                  } else if (dayDiff(item.timeStamp) !== 0) {
                    lastUpdateDate = `${dayDiff(item.timeStamp)} ${t(
                      "DashboardPage.11"
                    )}`;
                  } else {
                    lastUpdateDate = `${t("DashboardPage.12")}`;
                  }

                  const shortCutActions = [
                    {
                      content: t("DashboardPage.13"),
                      onAction: () => goChartEdit(item),
                    },
                    {
                      content: t("DashboardPage.14"),
                      onAction: () => {
                        setSizeChartItem(item);
                        setDeleteOptios("single");
                        handleDeleteModalChange();
                      },
                    },
                  ];

                  return (
                    <ResourceItem
                      id={id}
                      shortcutActions={shortCutActions}
                      // persistActions
                      onClick={() => {
                        goChartEdit(item);
                        if (!hasCompletedTutorial) {
                          updateTutorialStep(3);
                        }
                      }}
                    >
                      <h3>{name}</h3>
                      <Badge
                        status={
                          item.status === "Published" ? "info" : "warning"
                        }
                      >
                        {item.status === "Published"
                          ? t("DashboardPage.15")
                          : t("DashboardPage.21")}
                      </Badge>
                      {item.matchingProducts &&
                        !item.matchingProducts?.length && (
                          <h4>{t("DashboardPage.16")}</h4>
                        )}
                      <p>{lastUpdateDate}</p>
                    </ResourceItem>
                  );
                }}
              />
            </LegacyCard>
          </Layout.Section>
          <hr></hr>
          {toastMarkup}
        </Layout>
        <CSSTransition
          in={modalIsOpen}
          classNames="modal"
          timeout={300}
          unmountOnExit
        >
          <div className="modalBackground">
            <div className="modal__content">
              <div className="modal__content--header">
                <h6 className="modal__content--header-text">
                  {t("DashboardPage.17")}
                </h6>
                <button
                  className="modal__closeButton"
                  onClick={() => setModalIsOpen(false)}
                >
                  <img
                    src="https://customerssizeandme.s3.eu-central-1.amazonaws.com/close.png"
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              <CustomModal
                setModalIsOpen={setModalIsOpen}
                setSizeRange={setSizeRange}
                setMeasurements={setMeasurements}
                setUpperOrLower={setUpperOrLower}
                setTable={setTable}
                isNewChart={isNewChart}
                setIsNewChart={setIsNewChart}
                setSuccessOrError={setSuccessOrError}
                t={t}
                openSlidePanel={openSlidePanel}
                setOpenSlidePanel={setOpenSlidePanel}
                setPicturePreference={setPicturePreference}
                fetch={fetch}
              />
            </div>
          </div>
        </CSSTransition>
        <CSSTransition
          in={extensionModalActive}
          classNames="modal"
          timeout={300}
          unmountOnExit
        >
          <ActiveExtension
            domain={shopOrigin}
            fetch={fetch}
            setExtensionModalActive={setExtensionModalActive}
            setIsExtensionActivated={setIsExtensionActivated}
          />
        </CSSTransition>
        
        <CSSTransition
          in={openSlidePanel}
          classNames="slide"
          timeout={300}
          unmountOnExit
        >
          <CustomSlidePanel
            openSlidePanel={openSlidePanel}
            setOpenSlidePanel={setOpenSlidePanel}
            sizeRange={sizeRange}
            measurements={measurements}
            setSizeRange={setSizeRange}
            setMeasurements={setMeasurements}
            setIsNewChart={setIsNewChart}
            isNewChart={isNewChart}
            fetch={fetch}
            upperOrLower={upperOrLower}
            table={table}
            setTable={setTable}
            setSuccessOrError={setSuccessOrError}
            picturePreference={picturePreference}
     
            t={t}
          />
        </CSSTransition>

      </Page>
      {/* Çoklu seçimde silinmek istendiğinde açılan modal */}
      <Modal
        titleHidden
        // activator={deleteSizeChartModalActivator}
        open={isDeleteModalOpen}
        onClose={handleDeleteModalChange}
        primaryAction={{
          content: t("DashboardPage.43"),
          onAction: handleDeleteModalChange,
        }}
        secondaryActions={{
          content: t("DashboardPage.44"),
          onAction: async () => {
            handleDeleteModalChange();
            try {
              if (deleteOptions === "single") {
                console.log(sizeChartItem);
                await deleteSizeChart(fetch, sizeChartItem._id);
                setItems(
                  items.filter(
                    (chartItem) => chartItem._id !== sizeChartItem._id
                  )
                );
              } else if (deleteOptions === "multiple") {
                await deleteUserSizeCharts(fetch, selectedItems);
                setItems(
                  items.filter((item) => !selectedItems.includes(item._id))
                );
                setSelectedItems([]);
              }
            } catch (err) {
              setSuccessOrError({
                message: t(`Errors.${err.message}`),
                success: false,
              });
            }
          },
        }}
      >
        <Modal.Section>
          <VerticalStack>
            <Text size="medium">{t("DashboardPage.45")}</Text>
          
          </VerticalStack>
        </Modal.Section>
      </Modal>
    </Frame>
  ) : (
    !loading && (
      <ChartEdit
        shopOrigin={shopOrigin}
        setIsChartEdit={setIsChartEdit}
        chart={clickedChart}
        fetch={fetch}
      />
    )
  );
};

export default Tab3Page;
