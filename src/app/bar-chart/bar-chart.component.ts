import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from "d3";
import states from '../../assets/data/state_name.json';
import { DailyData, StateData, BarChartSingleDayData } from '../shared/models';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  myStates: {} = states;
  loadAllFilePromises: Promise<any>[] = [];
  minVal: number = 0;
  maxVal: number = 0;
  allStatesData: StateData[] = [];
  BarChartData: any = null;
  currentDate: string = "";
  minDate: string = "2020-03-04";
  maxDate: string = "2021-02-22";
  currentStateData: BarChartSingleDayData[] = [];
  svg: any;
  width: number = 860;
  height: number = 500;
  margin: number = 20;
  xMax: number = 0;
 
 

 
  constructor(private http: HttpClient) { }

  ngOnInit(): void{

    this.loadAllData();
  }

  loadAllData(){
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
        this.prepareData();
        
      });

  }

   // this is a Promise function, Promise will ensure finishing current work before reaching to the next step
   readFile(filePath: string, stateName: string, fullStateName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(filePath, {responseType: 'json'})
        .subscribe(
          data => {

            //console.log("check statedata", data)
            let stateData: StateData = new StateData();
            // loop through each day's data of a state to combine as a summarized data set
            Object.entries(data).forEach(([key, value]) => {
              //console.log("check key value", key, value)
              let daily: DailyData = Object.assign(new DailyData(), value);
              // this.minVal = daily.positive < this.minVal ? daily.positive : this.minVal;
              //this.maxVal = daily.positive > this.maxVal ? daily.positive : this.maxVal;
              stateData.daily.push(daily);
            });
            stateData.state = stateName;
            stateData.fullStateName = fullStateName;
            this.allStatesData.push(stateData);
            //console.log("check json", stateData);
            
            resolve(stateData);
          },
          error => {
            reject(error);
            console.log("error when read file", error);
          }
        );
    })
}


prepareDate(){

  this.currentDate = this.minDate;
  // console.log("check min date", this.minDate)
  this.prepareData()
      .then(() => {
        this.createChart();
      
        
    
      })
      .catch(error => console.log("error when inital draw map", error));
}

prepareData(): Promise<any> {
  return new Promise((resolve, reject) => {
    this.currentStateData = [];
    this.allStatesData.forEach(state => {
      let currentDeath = state.daily.find(x => x.date == this.currentDate)?.death;
      //console.log("check each state", state.fullStateName, state)
      currentDeath = currentDeath == null ? 0 : currentDeath;
      let currentRecovered = state.daily.find(x => x.date == this.currentDate)?.recovered;
      currentRecovered = currentRecovered == null ? 0 : currentRecovered;
      let currentHospitalized = state.daily.find(x => x.date == this.currentDate)?.hospitalized;
      currentHospitalized = currentHospitalized == null ? 0 : currentHospitalized;
      let currentStateData = new BarChartSingleDayData();
      currentStateData.state = state.state;
      currentStateData.death = currentDeath;
      currentStateData.recovered = currentRecovered;
      currentStateData.hospitalized = currentHospitalized;
      currentStateData.fullStateName = state.fullStateName;
      this.currentStateData.push(currentStateData);
    })

    resolve(this.currentStateData);
  })
}



  createChart() {
    let that = this;

    this.svg = d3.select("#graph")
                .append("svg")
                .attr("width", this.width + this.margin)
                .attr("height", this.height + this.margin)
                .append("g")
                .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
    this.drawBars();
  }
  
  drawBars(){
    //let xMax = d3.max(this.currentDate.death)

    let x = d3.scaleBand()
              .range([0, this.width])
              //.domain([0, xMax])
              .padding(0.2);
    
    this.svg.append('g')
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");


    let y = d3.scaleLinear()
              .domain([0,200000])
              .range([this.height, 0]);

    this.svg.append('g')
            .call(d3.axisLeft(y));

    this.svg.selectAll()
            .data(this.BarChartData.features)
            .enter()
            .append('rect')
            .attr("x", this.BarChartData.death)
            .attr("y", this.BarChartData.hospitalized)
            .attr("width", x.bandwidth())
            .attr("height", this.height )
            .attr("fill", "#d04a35");
  }
    
 

  } 
