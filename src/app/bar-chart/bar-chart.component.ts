import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from "d3";
import { groups } from 'd3';
import value from '../../assets/data/state_name.json';
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
  maxYAxisVal: number = 0;
  allStatesData: StateData[] = [];
  barChartData: any = null;
  currentDate: string = "";
  minDate: string = "2021-02-01";
  maxDate: string = "2021-02-22";
  currentStateData: BarChartSingleDayData[] = [];
  svg: any;
  marginTop: number = 20;
  marginRight: number = 160;
  marginBottom: number = 35;
  marginLeft: number = 55;
  width: number = 1400 - this.marginLeft - this.marginRight;
  height: number = 400 - this.marginTop - this.marginBottom;
  xMax: number = 0;
  lowColor: string = '#f9f9f9';
  
 

 
 

 
  constructor(private http: HttpClient) { }

  ngOnInit(): void{
    this.loadAllData();
  }

  loadAllData(){
    //console.log(3);
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
        this.getMaxYAxisValue();
      })
      .then(() => {
        //console.log("see what", this.allStatesData);
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
              stateData.daily.push(daily);
            });
            stateData.state = stateName;
            stateData.fullStateName = fullStateName;
            this.allStatesData.push(stateData);
            // console.log("check json", this.allStatesData);
            
            resolve(stateData);
        
          },
          error => {
            reject(error);
            console.log("error when read file", error);
          }
        );
    })
}

getMaxYAxisValue(): Promise<any>{
  return new Promise((resolve, reject) => {
    this.maxYAxisVal = 0;
    // loop
    this.allStatesData.forEach(state => {
      state.daily.forEach(singleDay => {
        let currentValue = +singleDay.death + +singleDay.hospitalized + +singleDay.recovered;
        this.maxYAxisVal = currentValue > this.maxYAxisVal ? currentValue : this.maxYAxisVal;
      })
    })

    resolve(this.maxYAxisVal);
  })
}

loadBarChartData(){
  d3.json("assets/map/us-state.json")
    .then(data => {
      this.barChartData = data;
      this.prepareDate();
    })
    .catch(error => 
      console.log("error when load us.json", error)
    );
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
      //console.log('check check ', state.daily.find(x => x.date == this.currentDate), this.currentDate);
      let currentRecovered = state.daily.find(x => x.date == this.currentDate)?.recovered;
      currentRecovered = currentRecovered == null ? 0 : currentRecovered;
      let currentHospitalized = state.daily.find(x => x.date == this.currentDate)?.hospitalized;
      currentHospitalized = currentHospitalized == null ? 0 : currentHospitalized;
      let currentStateData = new BarChartSingleDayData();
      currentStateData.state = state.state;
      currentStateData.death = +currentDeath;
      currentStateData.recovered = +currentRecovered;
      currentStateData.hospitalized = +currentHospitalized;
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
                .attr("width", this.width + this.marginLeft + this.marginRight)
                .attr("height", this.height + this.marginTop + this.marginBottom)
                .append("g")
                .attr("transform", "translate(" + this.marginLeft + "," + this.marginTop + ")");

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

    // let stackedData = d3.stack()(["death", "hospitalized", "recovered"].map(function(totalNumber) {
    //   // return that.currentStateData.map(function(d) {
    //   //   return {x: d.state, y: +d[totalNumber]};
    //   // });
    // }));

    // let subgroups = this.currentStateData.slice(1)
    // let groups = d3.map(this.currentStateData, function(d) {return (d.group)}).keys()

    var stackGen = d3.stack()
                    .keys(["death", "hospitalized", "recovered"])

    // console.log("check ", this.currentStateData)

    var stackedData = stackGen(this.currentStateData);


    let x = d3.scaleBand()
              
              .domain(this.currentStateData.map(d => d.state))
              .range([0, this.width - this.marginRight])
              .padding(0.2);

    this.svg.append('g')
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));
              

    let y = d3.scaleLinear()
              .domain([0,this.maxYAxisVal])
              .range([this.height, 0]);
    

    this.svg.append('g')
            .call(d3.axisLeft(y));

    // let color = d3.scaleOrdinal()
    //               .domain(subgroups)
    //               .range(['#e41a1c', '#377eb8', '#4daf4a'])

    let groups = this.svg.selectAll('g.number')
                    .data(this.currentStateData)
                    .enter()
                    .append('g')
                    .attr('class', 'number')
                                     

    // this.svg.append('g')
    //         .selectAll('g')
    //         .data(stackedData)
    //         .enter()
    //         .append('g')
    //         .attr('fill', function(d) {return color(d.key);})
    //         .selectAll('rect')
    //         .data(function(d) {return d;})
    //         .enter()
    //         .append('rect')
    //         .attr('x', function(d) {return x(d.data.group);})
    //         .attr('y', function(d) {return y(d[1]);})
    //         .attr('height', function(d) {return y(d[0]) - y(d[1]);})
    //         .attr('width', x.bandwidth())

    this.svg.selectAll('bars')
            .data(this.currentStateData)
            .enter()
            .append('rect')
            // .attr('fill', function(d:any){
            //   let data = that. currentStateData.find(x => x.fullStateName == d.fullStateName);
            //   if(data){
            //     let value = data.death + data.hospitalized + data.recovered;
            //   }
            // })
            .attr('x', (d: { state: string; }) => x(d.state))
            .attr('y', (d: { death: d3.NumberValue;}) => y(d.death))
            .attr('width', x.bandwidth())
            .attr('height', (d: { death: d3.NumberValue; }) => this.height - y(d.death))
            .attr('fill', '#d04a35');

            
  }

  }
    
 


