import React, { useState, useCallback, useEffect } from "react";
import { LegacyCard, TextField, Button } from "@shopify/polaris";
import { saveText, getText } from "../apis/sizeCharts";


const CustomModal = ({
  fetch,
  setModalIsOpen
}) => {
  const [text, setText] = useState('');

  // Handle text change
  const handleTextChange = useCallback((newValue) => setText(newValue), []);

  useEffect(() => {
    getText(fetch)
      .then((response) => {
        console.log(response)
        setText(response.text.text); // Assuming the response contains the text data
      })
      .catch((error) => {
        console.error(error); // Handle the error appropriately
      });
  }, []);
  // Handle save action
  const handleSave = useCallback(() => {
    saveText(fetch, text)
    // Implement what should happen when the save button is clicked
    console.log(text); // For demonstration, just logging the text to the console
    alert('Yazı Kaydedildi');
    // You might want to call `fetch` with the text or use it in some other way
  }, [text]);
  return (
    <div style={{ width: "100%", padding: '2rem'}}>
  
      <TextField
       
        value={text}
        onChange={handleTextChange}
        autoComplete="off"
      />
      <div  style={{marginTop: '2rem', display: 'flex', justifyContent:'flex-end',marginBottom: '2rem'}}>
      <Button onClick={handleSave}>Save</Button>
      </div>
  
  </div>
  );
};

export default CustomModal;
