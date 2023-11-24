import React, { useState, useRef } from "react";
import Cards from "./Cards";
import Chip from "@mui/material/Chip";
import { Box, Modal, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import "./Dashboard.css";
import html2canvas from "html2canvas";

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentCard, setCurrentCard] = useState("");
  const [inputText, setInputText] = useState("");
  const [loader, setLoader] = useState(false);

  // Define scenes
  const scenes = Array.from({ length: 10 }, (_, i) => `scene${i + 1}`);
  const [sceneImages, setSceneImages] = useState(
    scenes.reduce((acc, scene) => ({ ...acc, [scene]: "" }), {})
  );

  const outRef = useRef();

  const getTextInput = (event) => {
    setInputText(event.target.value);
  };

  const handleModalOpening = (cardNumber) => {
    setOpenModal(true);
    setCurrentCard(cardNumber);
  };

  const handleModalClosing = () => {
    setOpenModal(false);
  };

  console.log("running");
  const handleAPIResponse = async () => {
    setLoader(true);
    try {
      const API_URL =
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud";
      const API_KEY =
        "VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM";

      console.log("requestsent");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "image/png",
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: inputText }),
      });
      console.log("running22");
      console.log(response);
      if (response.ok) {
        const data = await response.blob();
        const IMG_URL = URL.createObjectURL(data);

        setSceneImages((prevImages) => ({
          ...prevImages,
          [currentCard]: IMG_URL,
        }));
        handleModalClosing();
      } else {
        console.error("Request failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoader(false);
    handleModalClosing();
  };

  const handleReset = () => {
    setSceneImages(
      scenes.reduce((acc, scene) => ({ ...acc, [scene]: "" }), {})
    );
    setInputText("");
    setLoader(false);
  };

  //function to capture the screenshot
  const captureScreenshot = async (event) => {
    event.preventDefault();
    const canvas = await html2canvas(outRef.current);

    const data = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.jpeg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  return (
    <div className="divToTakeScreenshotOf">
      {loader && (
        <div className="loader-container">
          <CircularProgress style={{ color: "red" }} />
        </div>
      )}

      <div className="dashboard-area">
        <div className="form-area">
          <h1 className="title-text">Dashtoon </h1>
          <h1 className="title-text">Comics</h1>
          <form>
            <div></div>
            <div className="form-text-content">
              <h3>Welcome to the comic world!</h3>
              <p>
                Dive into captivating stories, where every panel is a portal to
                adventure. Immerse yourself in vibrant characters, thrilling
                plots, and dazzling artwork. <br />
                Explore a world where imagination knows no bounds. Get ready for
                a journey beyond reality, where each page unfolds a new
                dimension of excitement and wonder!
                <br />
                <br />
              </p>
            </div>
            <div className="form-chips">
              <Chip
                sx={{ p: 2, m: 2 }}
                color="success"
                label="Download Image"
                onClick={captureScreenshot}
              />
              <Chip
                sx={{ p: 2, m: 2 }}
                label="Reset"
                color="error"
                className="reset-button"
                onClick={handleReset}
              />
            </div>
          </form>
        </div>
        <div className="card-column" ref={outRef}>
          {scenes.map((scene) => (
            <Cards
              key={scene}
              card-number={scene}
              IMG_URL={sceneImages[scene]}
              onClick={() => handleModalOpening(scene)}
            />
          ))}
        </div>
        <Modal
          open={openModal}
          onClose={handleModalClosing}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="modal"
        >
          <Box
            sx={{
              width: 500,
              bgcolor: "white",
              p: 2,
              borderRadius: 1,
            }}
          >
            <TextField
              id="outlined-basic"
              label="Search here"
              variant="filled"
              value={inputText}
              onChange={getTextInput}
              fullWidth
              autoFocus
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Chip
                variant="contained"
                label="Close"
                color="error"
                onClick={handleModalClosing}
                sx={{ mr: 2 }}
              />
              &nbsp;
              <Chip
                variant="contained"
                label="Get Scene"
                onClick={handleAPIResponse}
                color="primary"
              />
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
