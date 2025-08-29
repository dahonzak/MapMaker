let points = [];
let maxPoints = 10;
let courseInfo = {
    name: "",
    creator: "",
    difficulty: "",

};

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
        if (index > 0 && index < maxPoints) this.createLabel();
        this.createCoords();
    }

    createPoint() {
        this.element = document.createElement("div");

        if (this.index === 0) {
            this.element.classList.add("triangle");
        } else if (this.index === maxPoints) {
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
        const offsetX = (dx / length) * (this.radius + 6);
        const offsetY = (dy / length) * (this.radius + 6);
        const prad = 4 * this.radius;
        line.style.width = `${length - prad}px`;
        line.style.height = "2px";
        line.style.left = `${prev.x + offsetX}px`;
        line.style.top = `${prev.y + offsetY - 1}px`;
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

    askDescription() {
        const description = prompt("Enter a description for this point:");
        if (description !== null) {
            this.description = description;
        }
    }

    orientTriangle() {
        if (points.length > 1) {
            const next = points[1];
            const dx = next.x - this.x;
            const dy = next.y - this.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            this.element.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
        }
    }
}

const converter = new MapConverter(
    { lat: 39.00519909462398, lon: -77.0094406846897 },
    { lat: 38.971194, lon: -76.963440 },
    document.getElementById("map")
);

document.getElementById("map").addEventListener("click", (e) => {
    const rect = map.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (points.length < maxPoints+1) {
        points.push(new Point(x, y, points.length, converter));
        if (points.length > 1) points[0].orientTriangle();
        console.log(points[points.length - 1]);
    }
});

