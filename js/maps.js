const map = document.getElementById('map');
        const svg = document.getElementById('svg-overlay');
        const points = [];

        const createSVGElement = (type, attributes) => {
            const elem = document.createElementNS("http://www.w3.org/2000/svg", type);
            for (let attr in attributes) {
                elem.setAttribute(attr, attributes[attr]);
            }
            return elem;
        };

        map.addEventListener("click", (e) => {
            const rect = map.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            points.push({ x, y });
            drawPoints();
        });

        const drawPoints = () => {
            svg.innerHTML = ""; // Clear previous drawings

            for (let i = 0; i < points.length; i++) {
                const { x, y } = points[i];

                if (i === 0) {
                    // First point (Triangle)
                    const triangle = createSVGElement("polygon", {
                        points: `${x},${y-10} ${x-8},${y+10} ${x+8},${y+10}`,
                        fill: "black",
                        stroke: "pink",
                        "stroke-width": "2"
                    });
                    svg.appendChild(triangle);
                } else if (i === 10) {
                    // Last point after 10 clicks (Double Circle)
                    const outerCircle = createSVGElement("circle", {
                        cx: x, cy: y, r: 8,
                        fill: "white", stroke: "pink", "stroke-width": "2"
                    });
                    const innerCircle = createSVGElement("circle", {
                        cx: x, cy: y, r: 4,
                        fill: "black"
                    });
                    svg.appendChild(outerCircle);
                    svg.appendChild(innerCircle);
                } else {
                    // Normal points (Small black circles)
                    const circle = createSVGElement("circle", {
                        cx: x, cy: y, r: 5,
                        fill: "black",
                        stroke: "pink",
                        "stroke-width": "2"
                    });
                    svg.appendChild(circle);

                    if (i > 0 && i < 10) {
                        // Add text labels for non-first, non-last points
                        const text = createSVGElement("text", {
                            x: x + 10, y: y - 10,
                            "font-size": "14px",
                            "font-family": "Arial",
                            fill: "black"
                        });
                        text.textContent = i;
                        svg.appendChild(text);
                    }
                }

                // Draw lines connecting each point
                if (i > 0) {
                    const prev = points[i - 1];
                    const line = createSVGElement("line", {
                        x1: prev.x, y1: prev.y,
                        x2: x, y2: y,
                        stroke: "pink",
                        "stroke-width": "2"
                    });
                    svg.appendChild(line);
                }
            }
        };