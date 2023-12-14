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

const CustomErrorProducts = ({
  active,
  toggleActive,
  products,
  t,
}) => {

  return (
   
      <Modal
        open={active}
        onClose={() => toggleActive(false)}
        title={` ${products.length} Çakışan Ürün`}
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
                  return (
                    <ResourceItem
                      id={id}
                      url={`#`}
                      media={media}
                      accessibilityLabel={`${t(
                        "productMatchPage.22"
                      )} ${title}`}
         
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
export default CustomErrorProducts;
