import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CITIES } from '../constants';
import { DestinationScore, CityData } from '../types';

interface Props {
  destinations: DestinationScore[];
  currentLocationName: string; 
  finalDestination: string;
}

const DestinyMap: React.FC<Props> = ({ destinations, currentLocationName, finalDestination }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 1000;
    
    // Create Defs for Glow and Gradients
    const defs = svg.append("defs");
    
    // Glow Filter
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "2.5")
      .attr("result", "coloredBlur");
      
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Arrow Marker for Future
    defs.append("marker")
      .attr("id", "arrow-head-future")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", "20")
      .attr("refY", "5")
      .attr("markerWidth", "6")
      .attr("markerHeight", "6")
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#f59e0b"); // Amber

    // Arrow Marker for Past
    defs.append("marker")
      .attr("id", "arrow-head-past")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", "15")
      .attr("refY", "5")
      .attr("markerWidth", "5")
      .attr("markerHeight", "5")
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#475569"); // Slate

    // Container Group
    const g = svg.append("g");

    // Helper: Find City
    const findCity = (name: string): CityData | null => {
      if (!name) return null;
      const normalized = name.toLowerCase().trim();
      // Try exact match first
      let key = Object.keys(CITIES).find(k => k.toLowerCase() === normalized);
      // Try partial match if exact fails
      if (!key) {
        key = Object.keys(CITIES).find(k => normalized.includes(k.toLowerCase()) || k.toLowerCase().includes(normalized));
      }
      return key ? CITIES[key] : null;
    };

    const startCity = findCity(currentLocationName);
    const endCity = findCity(finalDestination);
    const cityList = Object.values(CITIES);

    // 1. Draw "The Grid" (Faint connections)
    cityList.forEach(city => {
       const isStart = startCity && city.name === startCity.name;
       const isEnd = endCity && city.name === endCity.name;
       const isCandidate = destinations.some(d => d.name === city.name);

       let r = 2;
       let opacity = 0.15;
       let fill = "#64748b";

       if (isCandidate) { opacity = 0.3; fill = "#22d3ee"; } // Candidate cyan
       if (isStart) { opacity = 0; } // Will draw specifically later
       if (isEnd) { opacity = 0; } // Will draw specifically later

       if (!isStart && !isEnd) {
           g.append("circle")
            .attr("cx", city.coords.x)
            .attr("cy", city.coords.y)
            .attr("r", r)
            .attr("fill", fill)
            .attr("opacity", opacity);
       }
    });

    // 2. Plot "The Path Taken" (Simulated History)
    // We generate a chain of 2 cities leading to the current one to show "trajectory"
    if (startCity) {
      // Deterministic pseudo-random generation based on input string
      let seed = 0;
      for(let i=0; i<currentLocationName.length; i++) seed += currentLocationName.charCodeAt(i);
      
      const potentialPastCities = cityList.filter(c => 
        c.name !== startCity.name && 
        (!endCity || c.name !== endCity.name)
      );
      
      if (potentialPastCities.length >= 2) {
        // Pick 2 distinctive past nodes based on seed
        const idx1 = seed % potentialPastCities.length;
        const idx2 = (seed * 7) % potentialPastCities.length; // distinct prime multiplier
        
        const past1 = potentialPastCities[idx1];
        const past2 = potentialPastCities[idx2 === idx1 ? (idx2 + 1) % potentialPastCities.length : idx2];

        // Draw Path: Past2 -> Past1 -> Current
        const historyPath = [past2, past1, startCity];

        // Draw connections
        const lineGenerator = d3.line<CityData>()
          .x(d => d.coords.x)
          .y(d => d.coords.y)
          .curve(d3.curveLinear);

        g.append("path")
          .datum(historyPath)
          .attr("d", lineGenerator)
          .attr("fill", "none")
          .attr("stroke", "#475569")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "4, 4")
          .attr("marker-mid", "url(#arrow-head-past)");

        // Draw Past Nodes
        [past2, past1].forEach((city, i) => {
            const node = g.append("g").attr("transform", `translate(${city.coords.x}, ${city.coords.y})`);
            node.append("circle").attr("r", 4).attr("fill", "#1e293b").attr("stroke", "#475569").attr("stroke-width", 1);
            node.append("text")
                .attr("y", 15)
                .attr("text-anchor", "middle")
                .text(`NODE -${2-i}`)
                .attr("fill", "#64748b")
                .attr("font-family", "Share Tech Mono")
                .attr("font-size", "8px");
        });
      }
    }

    // 3. Draw Candidate Vectors (Faint connection lines from current)
    if (startCity) {
       destinations.forEach(dest => {
          if (endCity && dest.name === endCity.name) return; // Skip main path
          const target = findCity(dest.name);
          if (target) {
             g.append("line")
              .attr("x1", startCity.coords.x)
              .attr("y1", startCity.coords.y)
              .attr("x2", target.coords.x)
              .attr("y2", target.coords.y)
              .attr("stroke", "#22d3ee") // Cyan for potential
              .attr("stroke-width", 0.5)
              .attr("opacity", 0.1)
              .attr("stroke-dasharray", "2, 4");
          }
       });
    }

    // 4. Draw MAIN DESTINY PATH (Current -> Future)
    if (startCity && endCity) {
        const pathData = d3.path();
        pathData.moveTo(startCity.coords.x, startCity.coords.y);
        // Add a slight curve for aesthetics
        const midX = (startCity.coords.x + endCity.coords.x) / 2;
        const midY = (startCity.coords.y + endCity.coords.y) / 2;
        // Offset mid point slightly to create curve based on direction
        const curveOffset = 20; 
        
        pathData.quadraticCurveTo(midX + curveOffset, midY - curveOffset, endCity.coords.x, endCity.coords.y);

        const path = g.append("path")
          .attr("d", pathData.toString())
          .attr("fill", "none")
          .attr("stroke", "#f59e0b") // Amber
          .attr("stroke-width", 3)
          .attr("marker-end", "url(#arrow-head-future)")
          .attr("filter", "url(#glow)")
          .attr("opacity", 0.9);

        // Path Animation
        const length = path.node()?.getTotalLength() || 0;
        path
          .attr("stroke-dasharray", length + " " + length)
          .attr("stroke-dashoffset", length)
          .transition()
          .duration(2000)
          .ease(d3.easeCubicInOut)
          .attr("stroke-dashoffset", 0);
    }

    // 5. Render Node Markers (Start and End)
    
    // CURRENT LOCATION
    if (startCity) {
        const node = g.append("g").attr("transform", `translate(${startCity.coords.x}, ${startCity.coords.y})`);
        
        // Pulse ring
        node.append("circle")
            .attr("r", 8)
            .attr("fill", "#06b6d4")
            .attr("opacity", 0.5)
            .append("animate")
            .attr("attributeName", "r")
            .attr("values", "8;25;8")
            .attr("dur", "3s")
            .attr("repeatCount", "indefinite");
        
        node.append("circle")
            .attr("r", 15)
            .attr("fill", "#06b6d4")
            .attr("opacity", 0.2)
            .append("animate")
            .attr("attributeName", "opacity")
            .attr("values", "0.2;0;0.2")
            .attr("dur", "3s")
            .attr("repeatCount", "indefinite");

        // Core
        node.append("circle")
            .attr("r", 6)
            .attr("fill", "#22d3ee")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("filter", "url(#glow)");

        // Label
        node.append("text")
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .text("CURRENT")
            .attr("fill", "#22d3ee")
            .attr("font-family", "Share Tech Mono")
            .attr("font-size", "10px")
            .attr("font-weight", "bold");
            
        node.append("text")
            .attr("y", 42)
            .attr("text-anchor", "middle")
            .text(startCity.name.toUpperCase())
            .attr("fill", "#a5f3fc")
            .attr("font-family", "Share Tech Mono")
            .attr("font-size", "12px");
    }

    // DESTINATION
    if (endCity) {
        const node = g.append("g").attr("transform", `translate(${endCity.coords.x}, ${endCity.coords.y})`);

        // Outer rotating ring
        node.append("circle")
            .attr("r", 30)
            .attr("fill", "none")
            .attr("stroke", "#f59e0b")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "5, 5")
            .attr("opacity", 0.6)
            .append("animateTransform")
            .attr("attributeName", "transform")
            .attr("type", "rotate")
            .attr("from", "0 0 0")
            .attr("to", "360 0 0")
            .attr("dur", "10s")
            .attr("repeatCount", "indefinite");

        // Inner glowing core
        node.append("circle")
            .attr("r", 8)
            .attr("fill", "#f59e0b")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("filter", "url(#glow)");

        // Label
        node.append("text")
            .attr("y", -35)
            .attr("text-anchor", "middle")
            .text("TARGET LOCK")
            .attr("fill", "#f59e0b")
            .attr("font-family", "Share Tech Mono")
            .attr("font-size", "10px")
            .attr("letter-spacing", "2px");
            
        node.append("text")
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .text(endCity.name.toUpperCase())
            .attr("fill", "#fff")
            .attr("font-family", "Cinzel")
            .attr("font-weight", "bold")
            .attr("font-size", "16px")
            .attr("filter", "url(#glow)");
    }
    
    // 6. Highlight other top candidates (faintly)
    destinations.forEach((dest, i) => {
        if (endCity && dest.name === endCity.name) return;
        if (startCity && dest.name === startCity.name) return;
        
        const city = findCity(dest.name);
        if (city && i < 3) { // Only top 3 alternates
             const node = g.append("g").attr("transform", `translate(${city.coords.x}, ${city.coords.y})`);
             node.append("circle")
                .attr("r", 3)
                .attr("fill", "#22d3ee")
                .attr("opacity", 0.8);
                
             node.append("text")
                .attr("y", 12)
                .attr("text-anchor", "middle")
                .text(city.name.toUpperCase())
                .attr("fill", "#64748b")
                .attr("font-family", "Share Tech Mono")
                .attr("font-size", "8px");
        }
    });

  }, [destinations, finalDestination, currentLocationName]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-slate-900/40 rounded-xl border border-slate-800 p-4 relative backdrop-blur-sm group">
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%] opacity-20"></div>

      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-amber-500 mythic-font text-sm uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          Kalki's Path Map
        </h3>
        <p className="text-slate-500 text-[10px] tech-font mt-1">
          Grid: ACTIVE | Vectors: COMPUTED
        </p>
      </div>
      
      <svg 
        ref={svgRef} 
        viewBox="0 0 1000 1000" 
        className="w-full h-auto max-h-[600px] relative z-1 transition-opacity duration-700 opacity-90 group-hover:opacity-100"
        style={{ filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.1))' }}
      >
        {/* SVG Content rendered by D3 */}
      </svg>
    </div>
  );
};

export default DestinyMap;