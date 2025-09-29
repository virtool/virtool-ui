import Badge from "@base/Badge";
import { scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";
import "./NuvsOrf.css";
import NuvsOrfLabel from "./NuvsOrfLabel";

const HEIGHT = 8;

function draw(element, maxLength, pos, strand) {
    element.innerHTML = "";

    const width = element.offsetWidth - 30;

    // Construct the SVG canvas.
    const svg = select(element)
        .append("svg")
        .attr("width", width + 30)
        .attr("height", HEIGHT);

    // Create a mother group that will hold all chart elements.
    const group = svg.append("g").attr("transform", "translate(15,0)");

    // Set up a y-axis that will appear at the top of the chart.
    const x = scaleLinear().range([0, width]).domain([0, maxLength]);

    const x0 = x(Math.abs(pos[strand === 1 ? 0 : 1]));
    const x1 = x(Math.abs(pos[strand === 1 ? 1 : 0]));
    const x2 = x1 + (strand === 1 ? -5 : 5);

    const yBase = HEIGHT - 4;

    const d = [
        `M${x0},${yBase + 2}`,
        `L${x2},${yBase + 2}`,
        `L${x1},${yBase}`,
        `L${x2},${yBase - 2}`,
        `L${x0},${yBase - 2}`,
    ].join(" ");

    group.append("path").attr("d", d).attr("stroke-width", 1);
}

export default function NuvsOrf({
    hits,
    index,
    maxSequenceLength,
    pos,
    strand,
}) {
    const chartEl = useRef(null);

    useEffect(
        () => draw(chartEl.current, maxSequenceLength, pos, strand),
        [index],
    );

    const hmm = hits[0];

    return (
        <div className="pb-3">
            <div className="flex font-medium items-center gap-4 nuvs-orf py-3">
                <NuvsOrfLabel hmm={hmm} />
                <span className="flex gap-2">
                    <Badge>{pos[1] - pos[0]}</Badge>
                    <span className="text-emerald-700">
                        {hmm ? hmm.full_e : null}
                    </span>
                </span>
            </div>

            <div ref={chartEl} />
        </div>
    );
}
