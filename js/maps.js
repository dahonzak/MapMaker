class Point {
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.createPoint();
        if (index > 0) this.createLine();
        if (index > 0 && index < 10) this.createLabel();
    }

    createPoint() {
        this.element = document.createElement("div");

        if (this.index === 0) {
            // First point - Triangle
            this.element.classList.add("triangle");
        } else if (this.index === 10) {
            // Last point after 10 clicks - Double Circle
            this.element.classList.add("double-circle");
        } else {
            // Normal points - Hollow circle
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

        // Calculate distance and angle
        const dx = this.x - prev.x;
        const dy = this.y - prev.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        line.style.width = `${length}px`;
        line.style.height = "2px";
        line.style.left = `${prev.x}px`;
        line.style.top = `${prev.y}px`;
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

document.getElementById("map").addEventListener("click", (e) => {
    const rect = map.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (points.length < 11) {
        points.push(new Point(x, y, points.length));
    }
});