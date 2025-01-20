const map = document.getElementById("map");
const svg = document.getElementById("lines");
const points = [];
const orienteeringPink = "#E70067"; // Orienteering pink

map.onload = () => {
    map.addEventListener("click", (e) => {
        const rect = map.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        points.push({ x, y });

        drawPoint(x, y, points.length);
        if (points.length > 1) {
            drawLine(points[points.length - 2], { x, y });
        }
    });
};

function drawPoint(x, y, index) {
    const container = document.createElement("div");
    container.classList.add("point");
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

    if (index === 1) {
        // First point: Triangle with pink border
        container.innerHTML = `<svg width="14" height="14">
            <polygon points="7,0 14,14 0,14" fill="red" stroke="${orienteeringPink}" stroke-width="2"/>
        </svg>`;
    } else if (index === points.length) {
        // Last point: Double circle with pink border
        container.innerHTML = `<svg width="16" height="16">
            <circle cx="8" cy="8" r="4" fill="blue" stroke="${orienteeringPink}" stroke-width="2"/>
            <circle cx="8" cy="8" r="6" fill="none" stroke="${orienteeringPink}" stroke-width="2"/>
        </svg>`;
    } else {
        // Normal point: Small circle with pink border
        container.innerHTML = `<svg width="12" height="12">
            <circle cx="6" cy="6" r="4" fill="green" stroke="${orienteeringPink}" stroke-width="2"/>
        </svg>`;
    }

    // Add label
    const label = document.createElement("div");
    label.classList.add("label");
    label.style.left = `${x + 10}px`;
    label.style.top = `${y}px`;
    label.textContent = `(${x.toFixed(1)}, ${y.toFixed(1)})`;

    document.body.appendChild(container);
    document.body.appendChild(label);
}

function drawLine(start, end) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);
    line.setAttribute("stroke", orienteeringPink);
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
}
