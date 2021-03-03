import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import states from '../../assets/data/state_name.json';
import { HttpClient } from '@angular/common/http';
import { DailyData, StateData, MapSingleDayData } from '../shared/models';


@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.css']
})
export class MapChartComponent implements OnInit {

  myStates: {} = states;
  loadAllFilePromises: Promise<any>[] = [];
  currentDate: string = "";
  mapData: any = null;
  width: number = 860;
  height: number = 500;
  myNumber: number = 0;
  minDate: string = "2020-03-01";
  maxDate: string = "2021-02-22";
  allStatesData: StateData[] = [];
  currentStateData: MapSingleDayData[] = [];
  svg: any;
  lowColor: string = "#f9f9f9";
  highColor: string = "#B22222";
  dynamicalInterval: any;
  mouseoverState: string = "";
  mouseoverNumber: number = 0;

  projection = d3.geoAlbersUsa()
                  .scale(900)
                  .translate([this.width/2, this.height/2])
  path = d3.geoPath()
           .projection(this.projection);

  minVal: number = 0;
  maxVal: number = 0;
  ramp = d3.scaleLinear<string>()
           .domain([this.minVal, this.maxVal])
          //  .interpolate(d3.interpolatePuRd(["", ""]))
           .range([this.lowColor, this.highColor]);
  tooltip: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // start point for everything
    this.loadAllData();
  }

  loadAllData(){
    // loop through state_name list to create each file name to read file
    Object.entries(this.myStates).forEach(([key, value]) => {
      // console.log("check", key, value)
      let fileName = key + '.json';
      let filePath = 'assets/data/history/json/' + fileName;
      let fullStateName = "" + value;

      // add each readFile Promise function into a list
      this.loadAllFilePromises.push(this.readFile(filePath, key, fullStateName));
    });
    
    // Promise all Promises to move to the next step, ensure we have read all files
    Promise.all(this.loadAllFilePromises)
      .then(() => {
        this.ramp = d3.scaleLinear<string>().domain([this.minVal, this.maxVal / 2]).range([this.lowColor, this.highColor]);
        this.loadMapData();
      });
  }

  // this is a Promise function, Promise will ensure finishing current work before reaching to the next step
  readFile(filePath: string, stateName: string, fullStateName: string): Promise<any> {
      return new Promise((resolve, reject) => {
        this.http.get(filePath, {responseType: 'json'})
          .subscribe(
            data => {
              let currentStateData: StateData = new StateData();
              // loop through each day's data of a state to combine as a summarized data set
              Object.entries(data).forEach(([key, value]) => {
                // console.log("check key value", key, value)
                let daily: DailyData = Object.assign(new DailyData(), value);
                // this.minVal = daily.positive < this.minVal ? daily.positive : this.minVal;
                this.maxVal = daily.positive > this.maxVal ? daily.positive : this.maxVal;
                currentStateData.daily.push(daily);
              });
              currentStateData.state = stateName;
              currentStateData.fullStateName = fullStateName;
              this.allStatesData.push(currentStateData);
              // console.log("check json", currentStateData);
              
              resolve(currentStateData);
            },
            error => {
              reject(error);
              console.log("error when read file", error);
            }
          );
      })
  }

  // read map json file
  loadMapData(){
    d3.json("assets/map/us-state.json")
      .then(data => {
          // console.log("check map data", data);
          this.mapData = data;
          this.prepareDate();
      })
      .catch(error => 
        console.log("error when load us.json", error)
      );
  }

   // find the minimum date as the start date
   prepareDate(){
    // this.allStatesData.forEach(state => {
    //   let tempDate = new Date(state.daily[state.daily.length - 1].date);
    //   let current = new Date(this.minDate);
    //   if(tempDate < current){
    //     this.minDate = state.daily[state.daily.length - 1].date;
    //   }
    // })
    this.currentDate = this.minDate;
    // console.log("check min date", this.minDate)
    this.prepareData()
        .then(() => {
          this.drawMap();
          this.drawLengend();
        })
        .catch(error => console.log("error when inital draw map", error));
  }

  // reorganize data into a single day dataset with all states, "recovered" was not actually used
  prepareData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.currentStateData = [];
      this.allStatesData.forEach(state => {
        let currentPositive = state.daily.find(x => x.date == this.currentDate)?.positive;
        // console.log("check each state", state.fullStateName, currentPositive)
        currentPositive = currentPositive == null ? 0 : currentPositive;
        let currentRecovered = state.daily.find(x => x.date == this.currentDate)?.recovered;
        currentRecovered = currentRecovered == null ? 0 : currentRecovered;
        let currentStateData = new MapSingleDayData();
        currentStateData.state = state.state;
        currentStateData.positive = currentPositive;
        currentStateData.recovered = currentRecovered;
        currentStateData.fullStateName = state.fullStateName;
        this.currentStateData.push(currentStateData);
      })

      resolve(this.currentStateData);
    })
  }

  // draw the map initially, notice the this.svg is a global variable, for updating data on it in the following step
  drawMap(){
    // console.log("check current data", this.currentStateData)
    let that = this;
    this.svg = d3.select("#graph")
                .append("svg")
                .attr("width", this.width)
                .attr("height", this.height)

    this.svg.selectAll()
            .data(this.mapData.features)
            .enter()
            .append("path")
            // fill is the key step to update the color filled in each state
            // by using ramp function with the current positive number
            // ramp is a d3 way to define the color of choosed area
            .attr("fill",function(d: any){
              // console.log("check d", d);
              let data = that.currentStateData.find(x => x.fullStateName == d.properties.name);
              if(data){
                let value = data.positive - data.recovered;
                return that.ramp(value);
              }
              else
                return that.lowColor;
            })
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5)
            .attr("d", that.path);
    
    this.tooltip = d3.select("#graph")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

    this.addTag();

    // after inital drawing, start adding time to update data
    this.dynamicalChange();
  }

  addTag(){
    let that = this;

    this.svg.selectAll("text")
            .data(this.mapData.features)
            .enter()
            .append("svg:text")
            .text(function(d: any){
              let shortName = "";
              Object.entries(that.myStates).forEach(([key, value]) => {
                if(value == d.properties.name){
                  shortName = key;
                }
              });
              return shortName;
            })
            .attr("x", function(d: any){
                return that.path.centroid(d)[0];
            })
            .attr("y", function(d: any){
                return that.path.centroid(d)[1];
            })
            .attr("text-anchor","middle")
            .attr('font-size','6pt')
            .on("mouseover", function(d: any, i: any){
              clearInterval(that.dynamicalInterval);
              that.tooltip.style("opacity", 1);
              d3.select(null)
                .style("stroke", "none")
                .style("opacity", 0.8);
              let data = that.currentStateData.find(x => x.fullStateName == i.properties.name);
              let number = 0;
              if(data) number = data.positive;
              that.mouseoverState = i.properties.name;
              that.mouseoverNumber = number;
              // that.tooltip
              //   .html(function(){
              //     // console.log("check d 2", d)
              //     return "State: " + i.properties.name + ", Number: " + number;
              //   }
              // )  
            })
            .on("mousemove", function(d: any, i: any){
              clearInterval(that.dynamicalInterval);
              let data = that.currentStateData.find(x => x.fullStateName == i.properties.name);
              let number = 0;
              if(data) number = data.positive;
              that.mouseoverState = i.properties.name;
              that.mouseoverNumber = number;
              // that.tooltip
              //   .html(function(){
              //     // console.log("check d 2", d)
              //     return "State: " + i.properties.name + ", Number: " + number;
              //   }
              // )  
            })
            .on("mouseleave", function(){
              that.mouseoverState = "None";
              that.mouseoverNumber = 0;
              that.dynamicalChange();
              that.tooltip
                  .style("opacity", 0)
              d3.select(null)
                .style("stroke", "none")
                .style("opacity", 0.8)
            })
  }

  // use the setInterval function to update the data with certain time period
  dynamicalChange(){
    this.dynamicalInterval = setInterval(() => {
      let current = new Date(this.currentDate);
      if(current < new Date(this.maxDate)){
        this.currentDate = new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-CA').slice(0, 10);
        this.prepareData()
          .then(() => {
            this.updateMap();
          })
          .catch(error => console.log("error when prepare data", error));
      }else{
        clearInterval(this.dynamicalInterval);
        setTimeout(() => {
          this.currentDate = this.minDate;
          this.dynamicalChange();
        }, 3000);

      }
    }, 50);
  }

  // update existing map with new data
  updateMap(){
    let that = this;

    this.svg.selectAll("path")
            .data(this.mapData.features)
            // .enter()
            .attr("fill",function(d: any){
              let data = that.currentStateData.find(x => x.fullStateName == d.properties.name);
              if(data){
                // console.log("check d", data.positive, data.recovered);
                // let value = data.positive - data.recovered;
                let value = data.positive;
                return that.ramp(value);
              }
              else
                return that.lowColor;
            })
            .on("mouseover", function(d: any, i: any){
              clearInterval(that.dynamicalInterval);
              that.tooltip.style("opacity", 1);
              d3.select(null)
                .style("stroke", "none")
                .style("opacity", 0.8);
              let data = that.currentStateData.find(x => x.fullStateName == i.properties.name);
              let number = 0;
              if(data) number = data.positive;
              that.mouseoverState = i.properties.name;
              that.mouseoverNumber = number;
              // that.tooltip
              //   .html(function(){
              //     // console.log("check d 2", d)
              //     return "State: " + i.properties.name + ", Number: " + number;
              //   }
              // )  
            })
            .on("mousemove", function(d: any, i: any){
              clearInterval(that.dynamicalInterval);
              let data = that.currentStateData.find(x => x.fullStateName == i.properties.name);
              let number = 0;
              if(data) number = data.positive;
              that.mouseoverState = i.properties.name;
              that.mouseoverNumber = number;
              // that.tooltip
              //   .html(function(){
              //     // console.log("check d 2", d)
              //     return "State: " + i.properties.name + ", Number: " + number;
              //   }
              // )  
            })
            .on("mouseleave", function(){
              that.dynamicalChange();
              that.tooltip
                  .style("opacity", 0)
              d3.select(null)
                .style("stroke", "none")
                .style("opacity", 0.8);
              that.mouseoverState = "None";
              that.mouseoverNumber = 0;
            })
            .attr("d", that.path);

    this.addTag();
  }

  drawLengend(){
    var w = 140, h = 300;

		var key = d3.select("#graph")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.attr("class", "legend");

		var legend = key.append("defs")
			.append("svg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "100%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "100%")
			.attr("spreadMethod", "pad");

		legend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", this.highColor)
			.attr("stop-opacity", 1);
			
		legend.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", this.lowColor)
			.attr("stop-opacity", 1);

		key.append("rect")
			.attr("width", w - 110)
			.attr("height", h)
			.style("fill", "url(#gradient)")
			.attr("transform", "translate(0,10)");

		var y = d3.scaleLinear()
			.range([h, 0])
			.domain([this.minVal, this.maxVal / 2]);

		var yAxis = d3.axisRight(y);

		key.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(31,10)")
			.call(yAxis)
  }

}
