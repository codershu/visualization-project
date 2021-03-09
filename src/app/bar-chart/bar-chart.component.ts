import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from "d3";
import { groups } from 'd3';
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
  minDate: string = "2020-04-01";
  maxDate: string = "2021-02-22";
  currentStateData: BarChartSingleDayData[] = [];
  svg: any;
  width: number = 860;
  height: number = 500;
  margin: number = 20;
  xMax: number = 0;
  lowColor: string = '#f9f9f9';

 
 

 
  constructor(private http: HttpClient) { }

  ngOnInit(): void{
    console.log(4);

    this.loadAllData();
  }

  loadAllData(){
    console.log(3);
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
        console.log("see what", this.allStatesData);
        this.prepareDate();
        
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

        console.log(1);

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
      //console.log('check check ', state.daily.find(x => x.date == this.currentDate), this.currentDate);
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
    //console.log(2, this.currentStateData);
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

    // this.svg.append('text')
    //         .attr('transform', 'translate(100,0)')
    //         .attr('x', 50)
    //         .attr('y', 50)
    //         .attr('font-size', '24px')
    //         .text('Covid-19 State display')

    this.drawBars();
  }
  
  drawBars(){
    let that = this;


    let x = d3.scaleBand()
              .range([0, this.width])
              //.domain(groups)
              .padding(0.2);

    this.svg.append('g')
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));
              

    let y = d3.scaleLinear()
              .domain([0,60])
              .range([this.height, 0]);
    

    // this.svg.append('g')
    //         .call(d3.axisLeft(y));

    // let color = d3.scaleOrdinal()
    //               .domain(subgroups)
    //               .range(['#e41a1c', '#377eb8', '#4daf4a'])

    // let stackedData = d3.stack()
    //                     .keys(subgroups)(data)

    this.svg.selectAll('.bar')
            .data(this.currentStateData)
            .enter()
            .append('rect')
            .attr('fill',function(d:any){
              console.log('want to see', d)
              let data = that.currentStateData.find(x => x.fullStateName == d.properties.name);
              if(data){
                let value = data.death
                return value;
        
              }
              else 
                return that.lowColor;
            })
            .attr("x", function(d:any) {return x(d.date);})
            .attr("y", function(d:any) {return y(d.death);})
            .attr("width", x.bandwidth())
            .attr("height", this.height )
            .attr("fill", "#d04a35");
  }
    
 

  } 
