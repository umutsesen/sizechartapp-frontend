import React, { useState, useCallback } from "react";
import { Tabs, LegacyCard} from "@shopify/polaris";
import { modalProductCards, parseTable } from "../variables/constants";
import ImportSizeTable from "./ImportSizeTable";

const CustomModal = ({
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
  setPicturePreference,
  t,
}) => {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "Select-product-type",
      content: t("DashboardPage.22"),
      panelID: "Select-product-type-1",
 
    },
    {     id: "import-size-chart",
    content: t("DashboardPage.23"),
    panelID: "import-size-chart-1",
  }
  ];

  const tabPanel = [
    <div>
      <div className="modal__clothes-choose">
        {modalProductCards.map((card, idx) => (
          <div
            className="selectCloth"
            key={idx}
            style={{ cursor: "pointer" }}
            onClick={() => {
              
              const { sizeRange, measurements } = parseTable(card.table);
              setSizeRange(sizeRange);
              setPicturePreference(card.product)
              console.log(measurements, "measurementsMODALcustom")
              setMeasurements(measurements);
              setTable(card.table);
              setUpperOrLower(card.type);
              setModalIsOpen(false);
              setOpenSlidePanel(true);
          
            }}
          >
            <LegacyCard>
              <LegacyCard.Section>
                <div className="selectClothColumn">
                  <img width={120} height={120} src={card.image} />
                  <span className="clothText">
                    {t(`Clothes.${card.product}`)}
                  </span>
                </div>
              </LegacyCard.Section>
            </LegacyCard>
          </div>
        ))}
      </div>
    </div>,
    <div className="importSizeTable">
      <ImportSizeTable
        setModalIsOpen={setModalIsOpen}
        setOpenSlidePanel={setOpenSlidePanel}
        setSizeRange={setSizeRange}
        setMeasurements={setMeasurements}
        setUpperOrLower={setUpperOrLower}
        setTable={setTable}
        fetch={fetch}
        isNewChart={isNewChart}
        setIsNewChart={setIsNewChart}
        setSuccessOrError={setSuccessOrError}
        t={t}
      />
    </div>,
  ];

  return (
    <div style={{ width: "100%" }}>
    
      <LegacyCard>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          {tabPanel[selected]}
        </Tabs>
      </LegacyCard>
    </div>
  );
};

export default CustomModal;
