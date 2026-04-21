var map = L.map("interactiveMap").setView([53.544169, 14.857611], 13);

const ROWS = 4;
const COLS = 4;

// define object for storing piece masks
var pieceMasks = {};

// returns a promise with an image object
// takes a src string as a parameter
const loadMask = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img); // on sucsess return object
    img.onerror = () => resolve(null); // on error return null
    img.src = src;
  });
};

// setting up the pieceMasks object with keys (top, left, bottom, right) and an Image object as the value
const preloadMasks = async () => {
  const masksToLoad = {
    "0_1_1_0": "assets/piece1.png",
    "1_1_1_1": "assets/piece2.png",
    "0_-1_-1_0": "assets/piece3.png",
    "0_1_-1_0": "assets/piece4.png",
    "0_-1_1_0": "assets/piece5.png",
    "0_-1_1_1": "assets/piece6.png",
    "0_-1_-1_1": "assets/piece7.png",
    "0_-1_-1_-1": "assets/piece8.png",
    "0_-1_1_-1": "assets/piece9.png",
    "0_1_1_-1": "assets/piece10.png",
    "0_1_-1_-1": "assets/piece11.png",
    "0_1_-1_1": "assets/piece12.png",
    "0_1_1_1": "assets/piece13.png",
    "1_-1_0_1": "assets/piece14.png",
    "-1_-1_0_1": "assets/piece15.png",
    "-1_-1_0_-1": "assets/piece16.png",
    "1_-1_0_-1": "assets/piece17.png",
    "1_1_0_-1": "assets/piece18.png",
    "-1_1_0_-1": "assets/piece19.png",
    "-1_1_0_1": "assets/piece20.png",
    "1_1_0_1": "assets/piece21.png",
    "0_0_1_1": "assets/piece22.png",
    "0_0_-1_-1": "assets/piece23.png",
    "0_0_-1_1": "assets/piece24.png",
    "0_0_1_-1": "assets/piece25.png",
    "1_1_0_0": "assets/piece26.png",
    "-1_-1_0_0": "assets/piece27.png",
    "-1_1_0_0": "assets/piece28.png",
    "1_-1_0_0": "assets/piece29.png",
    "1_0_0_1": "assets/piece30.png",
    "-1_0_0_-1": "assets/piece31.png",
    "-1_0_0_1": "assets/piece32.png",
    "1_0_0_-1": "assets/piece33.png",
    "-1_1_1_0": "assets/piece34.png",
    "-1_-1_1_0": "assets/piece35.png",
    "-1_-1_-1_0": "assets/piece36.png",
    "-1_1_-1_0": "assets/piece37.png",
    "1_1_-1_0": "assets/piece38.png",
    "1_-1_-1_0": "assets/piece39.png",
    "1_-1_1_0": "assets/piece40.png",
    "1_1_1_0": "assets/piece41.png",
    "-1_0_1_1": "assets/piece42.png",
    "-1_0_1_-1": "assets/piece43.png",
    "-1_0_-1_-1": "assets/piece44.png",
    "-1_0_-1_1": "assets/piece45.png",
    "1_0_-1_1": "assets/piece46.png",
    "1_0_-1_-1": "assets/piece47.png",
    "1_0_1_-1": "assets/piece48.png",
    "1_0_1_1": "assets/piece49.png",
    "1_1_1_-1": "assets/piece50.png",
    "1_1_-1_1": "assets/piece51.png",
    "-1_-1_1_-1": "assets/piece52.png",
    "1_1_-1_-1": "assets/piece53.png",
    "1_-1_-1_-1": "assets/piece54.png",
    "-1_1_-1_-1": "assets/piece55.png",
    "-1_-1_-1_-1": "assets/piece56.png",
    "-1_-1_-1_1": "assets/piece57.png",
    "1_-1_-1_1": "assets/piece58.png",
    "1_-1_1_1": "assets/piece59.png",
    "-1_1_1_1": "assets/piece61.png",
    "-1_-1_1_1": "assets/piece62.png",
    "-1_1_1_-1": "assets/piece63.png",
  };

  const loadPromises = Object.entries(masksToLoad).map(async ([key, url]) => {
    pieceMasks[key] = await loadMask(url);
  });

  await Promise.all(loadPromises);
};

// custom map marker
// takes text string as a parameter
const marker = (text) => {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        display: inline-block;
      ">
        <div style="
          padding: 6px 10px;
          background-color: #1a1a1a;
          color: white;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
        ">${text}</div>
        <div style="
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 20px;
          background-color: #1a1a1a;
        "></div>
        <div style="
          position: absolute;
          bottom: -18px;
          left: 50%;
          border-radius: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background-color: #1a1a1a;
        "></div>
      </div>
    `,
    iconSize: [100, 50],
    iconAnchor: [25, 45],
    popupAnchor: [0, -23],
  });
};

// defining the tiles for the map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// method that creates puzzle matrix (what piece mask will be used)
// -1 for a hole; 0 for a straight wall; 1 for a dingle
// takes integers rows and cols as parameter
const generatePuzzleMatrix = () => {
  let result = [];
  for (let i = 0; i < ROWS; i++) {
    result[i] = [];
  }

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const top = i === 0 ? 0 : -result[i - 1][j].bottom;
      const left = j === 0 ? 0 : -result[i][j - 1].right;
      const bottom = i === ROWS - 1 ? 0 : Math.random() > 0.5 ? 1 : -1;
      const right = j === COLS - 1 ? 0 : Math.random() > 0.5 ? 1 : -1;

      result[i][j] = { top, left, bottom, right };
    }
  }

  return result;
};

// variables that make updating the marker location possible
let locationMarker = null;

const onMyLocationButtonClick = () => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const coords = [lat, lng];

      map.setView(coords);
      console.log("Coordinates: ", coords);

      if (locationMarker) {
        locationMarker.setLatLng(coords);
      } else {
        locationMarker = L.marker(coords, {
          icon: marker("Jesteś tutaj!"),
        }).addTo(map);
      }
    },
    (error) => {
      console.error("Error getting location: ", error.message);
    },
  );
};

const checkWin = () => {
  const allPieces = puzzleBoard.querySelectorAll("img");
  const colPct = 100 / COLS;
  const rowPct = 100 / ROWS;

  let isFinished = true;

  allPieces.forEach((p) => {
    const pLeftPct = parseFloat(p.style.left);
    const pTopPct = parseFloat(p.style.top);

    const pLeftDingle = parseFloat(p.dataset.leftDingle || 0);
    const pTopDingle = parseFloat(p.dataset.topDingle || 0);

    const currentCol = Math.round(pLeftPct / colPct + pLeftDingle);
    const currentRow = Math.round(pTopPct / rowPct + pTopDingle);

    const correctCol = parseInt(p.dataset.correctCol);
    const correctRow = parseInt(p.dataset.correctRow);

    if (currentCol !== correctCol || currentRow !== correctRow) {
      isFinished = false;
    }
  });
  console.debug("Finished: ", isFinished);
  if (isFinished && allPieces.length > 0) {
    setTimeout(() => {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Puzzle Solved!", {
            body: "Congratulations! You solved the map!",
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Puzzle Solved!", {
                body: "Congratulations! You solved the map!",
              });
            } else {
              alert("Congratulations! You solved the map!");
            }
          });
        } else {
          alert("Congratulations! You solved the map!");
        }
      } else {
        alert("Congratulations! You solved the map!"); // fallback for older browsers
      }
    }, 100);
  }
};

const onDownloadMapButtonClick = async () => {
  const mapContainer = document.getElementById("interactiveMap");

  try {
    // to be sure we can generate the puzzle we have to preload the masks first then we continue
    await preloadMasks();

    const canvas = await html2canvas(mapContainer, {
      useCORS: true, // to make loading in files during interpretation in possible
      ignoreElements: (element) => {
        // Ignore Leaflet UI controls
        return (
          element.classList &&
          element.classList.contains("leaflet-control-container")
        );
      },
    });
    const puzzleBoard = document.getElementById("puzzleBoard");
    puzzleBoard.innerHTML = "";
    puzzleBoard.style.backgroundImage = "none";
    puzzleBoard.style.display = "block";
    puzzleBoard.style.position = "relative";
    puzzleBoard.style.width = `${mapContainer.offsetWidth}px`;
    puzzleBoard.style.height = `${mapContainer.offsetHeight}px`;

    puzzleBoard.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    puzzleBoard.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      const offsetX = parseFloat(e.dataTransfer.getData("offsetX"));
      const offsetY = parseFloat(e.dataTransfer.getData("offsetY"));
      const draggableElement = document.getElementById(id);

      if (draggableElement) {
        // if dropped element found
        const rect = puzzleBoard.getBoundingClientRect(); // returns info about size of the element

        // calculating where tge piece was dropped
        const targetX = e.clientX - rect.left - offsetX;
        const targetY = e.clientY - rect.top - offsetY;

        const leftPct = (targetX / puzzleBoard.offsetWidth) * 100;
        const topPct = (targetY / puzzleBoard.offsetHeight) * 100;

        const leftDingle = parseFloat(draggableElement.dataset.leftDingle || 0);
        const topDingle = parseFloat(draggableElement.dataset.topDingle || 0);

        const colPct = 100 / COLS;
        const rowPct = 100 / ROWS;

        let col = Math.round(leftPct / colPct + leftDingle);
        let row = Math.round(topPct / rowPct + topDingle);

        col = Math.max(0, Math.min(COLS - 1, col));
        row = Math.max(0, Math.min(ROWS - 1, row));

        // checking if there already was a piece
        let occupyingPiece = null;
        const allPieces = puzzleBoard.querySelectorAll("img");
        allPieces.forEach((p) => {
          if (p.id !== id) {
            const pLeftPct = parseFloat(p.style.left);
            const pTopPct = parseFloat(p.style.top);
            const pLeftDingle = parseFloat(p.dataset.leftDingle || 0);
            const pTopDingle = parseFloat(p.dataset.topDingle || 0);

            const pCol = Math.round(pLeftPct / colPct + pLeftDingle);
            const pRow = Math.round(pTopPct / rowPct + pTopDingle);

            if (pCol === col && pRow === row) {
              occupyingPiece = p;
            }
          }
        });

        // if yes switch them
        if (occupyingPiece) {
          const originLeftPct = parseFloat(draggableElement.style.left);
          const originTopPct = parseFloat(draggableElement.style.top);
          const originCol = Math.round(originLeftPct / colPct + leftDingle);
          const originRow = Math.round(originTopPct / rowPct + topDingle);

          const occLeftDingle = parseFloat(
            occupyingPiece.dataset.leftDingle || 0,
          );
          const occTopDingle = parseFloat(
            occupyingPiece.dataset.topDingle || 0,
          );

          const newOccLeftPct = (originCol - occLeftDingle) * colPct;
          const newOccTopPct = (originRow - occTopDingle) * rowPct;

          occupyingPiece.style.left = `${newOccLeftPct}%`;
          occupyingPiece.style.top = `${newOccTopPct}%`;
        }

        const snappedLeftPct = (col - leftDingle) * colPct;
        const snappedTopPct = (row - topDingle) * rowPct;

        draggableElement.style.left = `${snappedLeftPct}%`;
        draggableElement.style.top = `${snappedTopPct}%`;

        // check if a puzzle is solved on each piece drop
        checkWin();
      }
    });

    const pieces = await cutCanvasIntoPieces(canvas);

    pieces.forEach((piece, idx) => {
      const pieceImg = document.createElement("img");
      pieceImg.src = piece.data;

      // set up dataset attributes for checking if a puzzle is solved
      pieceImg.dataset.correctCol = idx % COLS;
      pieceImg.dataset.correctRow = Math.floor(idx / COLS);

      // set up dataset attributes for corrent resizing
      pieceImg.dataset.leftDingle = piece.leftDingle;
      pieceImg.dataset.topDingle = piece.topDingle;

      pieceImg.draggable = true;

      pieceImg.id = `piece_${idx}`;

      pieceImg.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", pieceImg.id);

        const rect = pieceImg.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        e.dataTransfer.setData("offsetX", offsetX);
        e.dataTransfer.setData("offsetY", offsetY);
      });

      pieceImg.addEventListener("dragend", (e) => {
        pieceImg.style.opacity = "1";
      });

      pieceImg.style.position = "absolute";
      pieceImg.style.zIndex = "20000";

      pieceImg.style.width = `${(piece.sourceW / canvas.width) * 100}%`;
      pieceImg.style.height = `${(piece.sourceH / canvas.height) * 100}%`;

      // initially randomize the placement
      pieceImg.style.left = `${Math.random() * 75}%`;
      pieceImg.style.top = `${Math.random() * 75}%`;

      puzzleBoard.appendChild(pieceImg);
    });
  } catch (err) {
    console.error("Error generating map puzzle: ", err);
  }
};

const cutCanvasIntoPieces = async (sourceCanvas) => {
  const pieces = [];
  const pieceWidth = sourceCanvas.width / COLS;
  const pieceHeight = sourceCanvas.height / ROWS;

  const matrix = generatePuzzleMatrix();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const pInfo = matrix[y][x];

      // masks with dingles have a diffrent size
      const topDingle = pInfo.top === 1 ? 0.25 : 0;
      const bottomDingle = pInfo.bottom === 1 ? 0.25 : 0;
      const leftDingle = pInfo.left === 1 ? 0.25 : 0;
      const rightDingle = pInfo.right === 1 ? 0.25 : 0;

      const sourceX = x * pieceWidth - leftDingle * pieceWidth;
      const sourceY = y * pieceHeight - topDingle * pieceHeight;

      // rescaling images to get original ratio
      const sourceW = pieceWidth * (1 + leftDingle + rightDingle);
      const sourceH = pieceHeight * (1 + topDingle + bottomDingle);

      const pieceCanvas = document.createElement("canvas");
      pieceCanvas.width = sourceW;
      pieceCanvas.height = sourceH;
      const ctx = pieceCanvas.getContext("2d");

      const key = `${pInfo.top}_${pInfo.left}_${pInfo.bottom}_${pInfo.right}`;

      let mask = pieceMasks[key];
      if (mask) {
        // if mask exists we use to cut out not needed parts of the canva
        ctx.drawImage(mask, 0, 0, sourceW, sourceH);
        ctx.globalCompositeOperation = "source-in";
      }

      ctx.drawImage(
        sourceCanvas,
        sourceX,
        sourceY,
        sourceW,
        sourceH,
        0,
        0,
        sourceW,
        sourceH,
      );

      ctx.globalCompositeOperation = "source-over"; // reset to normal

      pieces.push({
        data: pieceCanvas.toDataURL(),
        sourceW,
        sourceH,
        sourceX,
        sourceY,
        baseWidth: pieceWidth,
        baseHeight: pieceHeight,
        topDingle,
        leftDingle,
      });
    }
  }

  return pieces;
};

const myLocationBtn = document.getElementById("myLocation");

if (myLocationBtn) {
  myLocationBtn.onclick = onMyLocationButtonClick;
}

const downloadMapBtn = document.getElementById("downloadMap");

if (downloadMapBtn) {
  downloadMapBtn.onclick = onDownloadMapButtonClick;
}
