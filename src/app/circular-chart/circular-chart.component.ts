import { Component, OnInit } from '@angular/core';
import states from '../../assets/data/state_name.json';
import raceData from '../../assets/data/race/race-data.json';
import * as d3 from "d3";
import { RaceData, RaceDataNode } from '../shared/models';
import { forceCenter, SimulationLinkDatum, SimulationNodeDatum } from 'd3';

@Component({
  selector: 'app-circular-chart',
  templateUrl: './circular-chart.component.html',
  styleUrls: ['./circular-chart.component.css']
})
export class CircularChartComponent implements OnInit {

  myStates: {} = states;
  myRaceData: RaceData[] = raceData;
  stateList: any[] = [];
  currentState: any;

  svgInfection: any;
  width: number = 490;
  height: number = 450;

  isDataFound: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.loadStateList()
  }

  loadStateList(){
    Object.entries(this.myStates).forEach(([key, value]) => {
      // console.log("check", key, value)
      let state = {name: key, fullName: value};
      this.stateList.push(state)
    });
  }

  onSelectState(){
    if(this.currentState == null) {
      return;
    }
    // console.log(this.currentState)
    this.drawInfection();
    this.drawMortality();
  }

  drawInfection(){
    let infection = this.myRaceData.find(x => x.fullStateName == this.currentState.fullName)?.infection;
    
    if(infection)
      this.drawCircular("#infection", infection)
    else
      return;
  }

  drawMortality(){
    let mortality = this.myRaceData.find(x => x.fullStateName == this.currentState.fullName)?.mortality;

    if(mortality)
      this.drawCircular("#mortality", mortality)
    else
      return;
  }

  drawCircular(svgId: string, data: RaceDataNode[]){
    d3.select(svgId).html(null);

    this.svgInfection = d3.select(svgId)
                          .append("svg")
                          .attr("width", this.width)
                          .attr("height", this.height);

    let domain: string[] = [];
    let total = 0;
    if(data){
      this.isDataFound = true;
      data.forEach(race => {
        // console.log("check data", race)
        domain.push(race.name)
        total += race.value;
      })
      // console.log("check domain", domain)
    }else{
      this.isDataFound = false;
      return;
    }

    // Color palette for continents?
    var color = d3.scaleOrdinal()
                  .domain(domain)
                  .range(d3.schemeSet1);
                  // .range(["gold", "blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"])

    // Size scale for countries
    var size = d3.scaleLinear()
                .domain([0, 30000])
                .range([7,55])  // circle will be between 7 and 55 px wide

    // create a tooltip
    var Tooltip = d3.select(svgId)
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "2px")
                    .style("border-radius", "5px")
                    .style("padding", "5px");

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d: any) {
      Tooltip
        .style("opacity", 1)
    }
    var mousemove = function(i: any, d: any) {
      // console.log("check pointer", d3.pointer, i, d)
      let endingWord = svgId == "#infection" ? " infected" : " death";
      let rate = (d.value * 100 / total).toFixed(2);
      Tooltip
        .html('<div style="font-size: 11px;">' + d.name + '</div>' + '<div style="font-size: 11px;">' + d.value + ' (' + rate + '%)' + '</div>') 
        .style("left", i.x + 30 + "px")
        .style("top", i.y + "px")
    }
    var mouseleave = function(d: any) {
      Tooltip
        .style("opacity", 0)
    }

    // Initialize the circle: all located at the center of the svg area
    var node = this.svgInfection.append("g")
                  .selectAll("circle")
                  .data(data)
                  .enter()
                  .append("circle")
                  .attr("class", "node")
                  .attr("r", function(d: any, i: any, nodes: any){ 
                    // console.log("i", i, nodes)
                    return size(d.value)
                  })
                  .attr("cx", this.width / 2)
                  .attr("cy", this.height / 2)
                  .style("fill", function(d: any){ 
                    return color(d.name)
                  })
                  .style("fill-opacity", 0.8)
                  .attr("stroke", "black")
                  .style("stroke-width", 1)
                  .on("mouseover", mouseover) // What to do when hovered
                  .on("mousemove", mousemove)
                  .on("mouseleave", mouseleave)
                  .call(
                    d3.drag() // call specific function when circle is dragged
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended)
                  );

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(this.width / 2).y(this.height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(-100)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d, event, i){ 
          console.log("d1", d)
          if(d.x)
            return (size(d.x)+3)
          else
            return 100
        }).iterations(1)) // Force that avoids circle overlapping

    
    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(node)
        .on("tick", () => {
          node
            .attr("cx", (d: any) => { 
              return d.x; 
            })
            .attr("cy", (d: any) => { 
              return d.y; 
            })
        });

    // What happens when a circle is dragged?
    function dragstarted(event: any, d: any) {
      // console.log("dragstarted", event, d, node._groups)
      // let current = node._groups.find((x: any) => x.__data__.name == d.name)
      if (!event.active) simulation.alphaTarget(.03).restart();
      d.fx = event.x;
      d.fy = event.y;
      d.x = event.x;
      d.y = event.y;
    }
    function dragged(event: any, d: any) {
      // console.log("dragged", event, d)
      d.fx = event.x;
      d.fy = event.y;
      d.x = event.x;
      d.y = event.y;
    }
    function dragended(event: any, d: any) {
      // console.log("dragended", event, d)
      if (!event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
      d.x = event.x;
      d.y = event.y;
    }
  }

}
