const mapContainer = document.getElementById('map-container');
const map = document.getElementById('map');

let pointCount = 0;

// Define edge points of the flat map (top-left and bottom-right corners)
const mapBounds = {
    topLeft: { lat: 39.00519909462398, lon: -77.0094406846897 },
    bottomRight: { lat: 38.97126732894448, lon: -77.00976581667058 }
};

map.onload = () => {
    const mapWidth = map.clientWidth;
    const mapHeight = map.clientHeight;

    const getCoordinates = (x, y) => {
        const lon = mapBounds.topLeft.lon + (x / mapWidth) * (mapBounds.bottomRight.lon - mapBounds.topLeft.lon);
        const lat = mapBounds.topLeft.lat - (y / mapHeight) * (mapBounds.topLeft.lat - mapBounds.bottomRight.lat);
        return { lat, lon };
    };

    map.addEventListener('click', (e) => {
        const rect = map.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const coordinates = getCoordinates(x, y);
        console.log(`Point ${pointCount + 1}:`, coordinates);

        placeCircle(x, y);
    });
};

const placeCircle = (x, y) => {
    pointCount++;

    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.innerText = pointCount;
    circle.style.left = `${x - 15}px`; // Offset to center the circle
    circle.style.top = `${y - 15}px`;

    circle.setAttribute('draggable', true);
    circle.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', null);
        circle.dataset.offsetX = e.clientX - circle.offsetLeft;
        circle.dataset.offsetY = e.clientY - circle.offsetTop;
    });

    document.addEventListener('dragover', (e) => e.preventDefault());

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        const offsetX = parseInt(circle.dataset.offsetX, 10);
        const offsetY = parseInt(circle.dataset.offsetY, 10);
        circle.style.left = `${e.clientX - offsetX}px`;
        circle.style.top = `${e.clientY - offsetY}px`;
    });

    mapContainer.appendChild(circle);
};
