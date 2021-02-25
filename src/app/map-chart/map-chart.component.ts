import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import states from '../../assets/data/state_name.json';
import { HttpClient } from '@angular/common/http';
import { DailyData, StateData, MapSingleDayData } from '../shared/models';
import * as topojson from 'topojson';
import { FeatureCollection, GeometryCollection } from 'geojson';
import { scaleLinear, ScaleLinear } from 'd3';

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
  width: number = 960;
  height: number = 500;
  myNumber: number = 0;
  minDate: string = "2020-03-01";
  maxDate: string = "2021-02-22";
  allStatesData: StateData[] = [];
  currentStateData: MapSingleDayData[] = [];
  svg: any;
  lowColor: string = '#f9f9f9';
  highColor: string = "darkred";

  projection = d3.geoAlbersUsa()
                  .scale(1000)
                  .translate([this.width/2, this.height/2])
  path = d3.geoPath()
           .projection(this.projection);

  minVal: number = 0;
  maxVal: number = 0;
  ramp = d3.scaleLinear<string>()
           .domain([this.minVal, this.maxVal])
          //  .interpolate(d3.interpolatePuRd(["", ""]))
           .range([this.lowColor, this.highColor]);

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
    this.allStatesData.forEach(state => {
      let tempDate = new Date(state.daily[state.daily.length - 1].date);
      let current = new Date(this.minDate);
      if(tempDate < current){
        this.minDate = state.daily[state.daily.length - 1].date;
      }
    })
    this.currentDate = this.minDate;
    // console.log("check min date", this.minDate)
    this.prepareData()
        .then(() => this.drawMap())
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

    // after inital drawing, start adding time to update data
    this.dynamicalChange();
  }


  // use the setInterval function to update the data with certain time period
  dynamicalChange(){
    setInterval(() => {
      let current = new Date(this.currentDate);
      if(current < new Date(this.maxDate)){
        this.currentDate = new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-CA').slice(0, 10);
        this.prepareData()
          .then(() => {
            this.changeData();
          })
          .catch(error => console.log("error when prepare data", error))
      }else{
        this.currentDate = this.minDate;
      }
    }, 100);
  }

    // call prepareData to get the newest currentStateData for updating the map
    changeData(){
      this.prepareData()
        .then(() => {
          // console.log("new data", this.currentStateData)
          this.ramp = d3.scaleLinear<string>().domain([this.minVal, this.maxVal / 10]).range([this.lowColor, this.highColor]);
          this.updateMap();
        })
    }

  // update existing map with new data
  updateMap(){
    let that = this;

    this.svg.selectAll("path")
            .data(this.mapData.features)
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
            .attr("d", that.path);
  }

}
