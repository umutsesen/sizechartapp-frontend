import React from "react";
import {
  Avatar,
  LegacyCard,
  ResourceItem,
  ResourceList,
  Text,
  Modal,
  Thumbnail,
} from "@shopify/polaris";

const CustomProductsModal = ({
  active,
  toggleActive,
  amount,
  products,
  shopOrigin,
  t,
  setSelectedItems,
  selectedItems
}) => {
  console.log(products)
  const promotedBulkActions = [
    {
      content: 'Ürünleri Kaydet',
      onAction: () => toggleActive(),
    },
  ];

  return (
   
      <Modal
        open={active}
        onClose={toggleActive}
        title={` ${amount} ${t("productMatchPage.24")}`}
      >
        <Modal.Section>
          <LegacyCard>
            <div style={{ maxHeight: "900px", overflowY: "scroll" }}>
              <ResourceList
                resourceName={{
                  singular: t("productMatchPage.19"),
                  plural: t("productMatchPage.20"),
                }}
                
                items={products}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                promotedBulkActions={promotedBulkActions}
             /*    bulkActions={bulkActions} */
                renderItem={(item) => {
                  const { title, id, image } = item;
                  const media = (
                    <Thumbnail
                      source={
                        image
                          ? image
                          : "https://www.invenura.com/wp-content/themes/consultix/images/no-image-found-360x250.png"
                      }
                      alt={title}
                    />
                  );
/* 
                  const shortcutActions = [
                    {
                      content: t("productMatchPage.26"),
                      accessibilityLabel: t("productMatchPage.26"),
                      url: `https://${shopOrigin}/products/${title.replace(
                        /\s+/g,
                        "-"
                      )}`,
                      external: true,
                    },
                  ]; */

                  return (
                    <ResourceItem
                      id={id}
                      url={`#`}
                      media={media}
                      accessibilityLabel={`${t(
                        "productMatchPage.22"
                      )} ${title}`}
                 /*      shortcutActions={shortcutActions} */
                      persistActions
                    >
                  
                        <Text variant="bodyLg" as="p"  fontWeight="semibold">{title}</Text>
               
                    </ResourceItem>
                  );
                }}
              />
            </div>
          </LegacyCard>
        </Modal.Section>
      </Modal>
   
  );
};
export default CustomProductsModal;
