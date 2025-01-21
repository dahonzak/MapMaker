class MapConverter {
    constructor(topLeft, bottomRight, mapElement) {
        this.lat1 = topLeft.lat;
        this.lon1 = topLeft.lon;
        this.lat2 = bottomRight.lat;
        this.lon2 = bottomRight.lon;
        this.mapElement = mapElement;
    }

    toLatLon(x, y) {
        const rect = this.mapElement.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const lon = this.lon1 + ((x / width) * (this.lon2 - this.lon1));
        const lat = this.lat1 - ((y / height) * (this.lat1 - this.lat2));

        return { lat, lon };
    }
}

class Point {
    constructor(x, y, index, converter) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.latLon = converter.toLatLon(x, y);
        this.radius = 5; // Approximate radius of a point
        this.createPoint();
        if (index > 0) this.createLine();
        if (index > 0 && index < 10) this.createLabel();
        this.createCoords();
    }

    createPoint() {
        this.element = document.createElement("div");

        if (this.index === 0) {
            this.element.classList.add("triangle");
        } else if (this.index === 10) {
            this.element.classList.add("double-circle");
        } else {
            this.element.classList.add("point");
        }

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        document.getElementById("map-container").appendChild(this.element);

        if (this.index === 0) this.orientTriangle();
    }

    createLine() {
        const prev = points[this.index - 1];
        const line = document.createElement("div");
        line.classList.add("line");
        const dx = this.x - prev.x;
        const dy = this.y - prev.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const offsetX = (dx / length) * this.radius;
        const offsetY = (dy / length) * this.radius;
        line.style.width = `${length - 2 * this.radius}px`;
        line.style.height = "2px";
        line.style.left = `${prev.x + offsetX}px`;
        line.style.top = `${prev.y + offsetY}px`;
        line.style.transform = `rotate(${angle}deg)`;
        document.getElementById("map-container").appendChild(line);
    }

    createLabel() {
        const label = document.createElement("div");
        label.classList.add("label");
        label.style.left = `${this.x}px`;
        label.style.top = `${this.y}px`;
        label.textContent = this.index;
        document.getElementById("map-container").appendChild(label);
    }

    createCoords() {
        const coordText = document.createElement("div");
        coordText.classList.add("coords");
        coordText.style.left = `${this.x}px`;
        coordText.style.top = `${this.y}px`;
        coordText.textContent = `(${this.latLon.lat.toFixed(5)}, ${this.latLon.lon.toFixed(5)})`;
        document.getElementById("map-container").appendChild(coordText);
    }

    orientTriangle() {
        if (points.length > 1) {
            const next = points[1];
            const dx = next.x - this.x;
            const dy = next.y - this.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            this.element.style.transform = `rotate(${angle}deg) translate(-50%, -50%)`;
        }
    }
}

let points = [];

const converter = new MapConverter(
    { lat: 39.00519909462398, lon: -77.0094406846897 },
    { lat: 38.97126732894448, lon: -77.00976581667058 },
    document.getElementById("map")
);

document.getElementById("map").addEventListener("click", (e) => {
    const rect = map.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (points.length < 11) {
        points.push(new Point(x, y, points.length, converter));
        if (points.length > 1) points[0].orientTriangle();
    }
});

