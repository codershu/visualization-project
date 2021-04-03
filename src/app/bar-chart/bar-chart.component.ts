import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from "d3";
import states from '../../assets/data/state_name.json';
import { DailyData, StateData, BarChartSingleDayData, BarChartStackData, StateCheckboxItem } from '../shared/models';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  checkboxList: StateCheckboxItem[] = [
    { name : "AK", fullName : "Alaska", checked : true, disable : false },
    { name : "AL", fullName : "Alabama", checked : true, disable : false },
    { name : "AR", fullName : "Arkansas", checked : true, disable : false },
    { name : "AS", fullName : "American Samoa", checked : true, disable : false },
    { name : "AZ", fullName : "Arizona", checked : true, disable : false },
    { name : "CA", fullName : "California", checked : true, disable : false },
    { name : "CO", fullName : "Colorado", checked : true, disable : false },
    { name : "CT", fullName : "Connecticut", checked : true, disable : false },
    { name : "DC", fullName : "District of Columbia", checked : true, disable : false },
    { name : "DE", fullName : "Delaware", checked : true, disable : false },
    { name : "FL", fullName : "Florida", checked : false, disable : true },
    { name : "GA", fullName : "Georgia", checked : false, disable : true },
    { name : "GU", fullName : "Guam", checked : false, disable : true },
    { name : "HI", fullName : "Hawaii", checked : false, disable : true },
    { name : "IA", fullName : "Iowa", checked : false, disable : true },
    { name : "ID", fullName : "Idaho", checked : false, disable : true },
    { name : "IL", fullName : "Illinois", checked : false, disable : true },
    { name : "IN", fullName : "Indiana", checked : false, disable : true },
    { name : "KS", fullName : "Kansas", checked : false, disable : true },
    { name : "KY", fullName : "Kentucky", checked : false, disable : true },
    { name : "LA", fullName : "Louisiana", checked : false, disable : true },
    { name : "MA", fullName : "Massachusetts", checked : false, disable : true },
    { name : "MD", fullName : "Maryland", checked : false, disable : true },
    { name : "ME", fullName : "Maine", checked : false, disable : true },
    { name : "MI", fullName : "Michigan", checked : false, disable : true },
    { name : "MN", fullName : "Minnesota", checked : false, disable : true },
    { name : "MO", fullName : "Missouri", checked : false, disable : true },
    { name : "MP", fullName : "Northern Mariana Islands", checked : false, disable : true },
    { name : "MS", fullName : "Mississippi", checked : false, disable : true },
    { name : "MT", fullName : "Montana", checked : false, disable : true },
    { name : "NC", fullName : "North Carolina", checked : false, disable : true },
    { name : "ND", fullName : "North Dakota", checked : false, disable : true },
    { name : "NE", fullName : "Nebraska", checked : false, disable : true },
    { name : "NH", fullName : "New Hampshire", checked : false, disable : true },
    { name : "NJ", fullName : "New Jersey", checked : false, disable : true },
    { name : "NM", fullName : "New Mexico", checked : false, disable : true },
    { name : "NV", fullName : "Nevada", checked : false, disable : true },
    { name : "NY", fullName : "New York", checked : false, disable : true },
    { name : "OH", fullName : "Ohio", checked : false, disable : true },
    { name : "OK", fullName : "Oklahoma", checked : false, disable : true },
    { name : "OR", fullName : "Oregon", checked : false, disable : true },
    { name : "PA", fullName : "Pennsylvania", checked : false, disable : true },
    { name : "PR", fullName : "Puerto Rico", checked : false, disable : true },
    { name : "RI", fullName : "Rhode Island", checked : false, disable : true },
    { name : "SC", fullName : "South Carolina", checked : false, disable : true },
    { name : "SD", fullName : "South Dakota", checked : false, disable : true },
    { name : "TN", fullName : "Tennessee", checked : false, disable : true },
    { name : "TX", fullName : "Texas", checked : false, disable : true },
    { name : "UT", fullName : "Utah", checked : false, disable : true },
    { name : "VA", fullName : "Virginia", checked : false, disable : true },
    { name : "VI", fullName : "US Virgin Islands", checked : false, disable : true },
    { name : "VT", fullName : "Vermont", checked : false, disable : true },
    { name : "WA", fullName : "Washington", checked : false, disable : true },
    { name : "WI", fullName : "Wisconsin", checked : false, disable : true },
    { name : "WV", fullName : "West Virginia", checked : false, disable : true },
    { name : "WY", fullName : "Wyoming", checked : false, disable : true }
  ];
  selectedStates: string[] = [];
  hasTenStatesSelected: boolean = true;
  myStates: {} = states;
  loadAllFilePromises: Promise<any>[] = [];
  maxYAxisVal: number = 0;
  allStatesData: StateData[] = [];
  barChartData: any = null;
  currentDate: string = "";
  minDate: string = "2020-03-01";
  maxDate: string = "2021-02-22";
  currentStateData: BarChartSingleDayData[] = [];
  currentStackData: any[] = [];
  svg: any;
  marginTop: number = 20;
  marginRight: number = 160;
  marginBottom: number = 35;
  marginLeft: number = 55;
  width: number = 1400 - this.marginLeft - this.marginRight;
  height: number = 450 - this.marginTop - this.marginBottom;
  xMax: number = 0;
  lowColor: string = '#f9f9f9';
  subgroups = ["death", "hospitalized", "recovered"];
  dynamicalInterval: any;
  btnDisabled: boolean = false;
  speed: number = -50;
  
 
  constructor(private http: HttpClient) { }

  ngOnInit(): void{
    this.preCheckSelectedStates();
    this.loadAllData();
  }

  preCheckSelectedStates(){
    this.checkboxList.forEach(state => {
      if(state.checked) this.selectedStates.push(state.name);
    })
    // console.log("check initial states", this.selectedStates)
  }

  onStatesCheckboxChange(event: any){
    // console.log("onchange", event.target.value, event.target.checked, event.target)
    if(event.target.checked){
      this.selectedStates.push(event.target.value)
      if(this.selectedStates.length == 10){
        this.checkboxList.forEach(state => {
          if(!state.checked) state.disable = true;
        })
      }
    }else{
      let index = this.selectedStates.indexOf(event.target.value, 0);
      if (index > -1) {
        this.selectedStates.splice(index, 1);
      }
      this.checkboxList.forEach(state => {
        state.disable = false;
      })
    }

    // console.log("check selection", this.selectedStates)
    this.prepareData();

  }

  onStartClick(){
    // console.log()
    d3.select("#barChartGraph").html(null);
    this.prepareDate();
  }

  onContinueClick(){
    this.btnDisabled = false;
    this.dynamicalChange();
  }

  onPauseClick(){
    clearInterval(this.dynamicalInterval);
    this.btnDisabled = true;
  }

  onSpeedChange(){
    clearInterval(this.dynamicalInterval);
    this.dynamicalChange();
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
    this.maxYAxisVal = 0;
    this.currentStackData = [];
    this.selectedStates.forEach(name => {
      let state = this.allStatesData.find(item => item.state == name);
      if(state == null) return;
      let currentDeath = state.daily.find(x => x.date == this.currentDate)?.death;
      //console.log("check each state", state.fullStateName, state)
      currentDeath = currentDeath == null ? 0 : currentDeath;
      // console.log('check check ', state.daily.find(x => x.date == this.currentDate), this.currentDate);
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
      
      // console.log("really? ", this.currentDate, this.maxYAxisVal, this.currentStateData)
      this.maxYAxisVal = currentStateData.death + currentStateData.recovered + currentStateData.hospitalized >= this.maxYAxisVal ? currentStateData.death + currentStateData.recovered + currentStateData.hospitalized : this.maxYAxisVal; 
    })
    // console.log("before", this.currentDate, this.currentStateData)

    this.currentStateData.sort((a, b) => (b.death + b.hospitalized + b.recovered) - (a.death + a.hospitalized + a.recovered));

    this.currentStateData.forEach(state => {
      let currentStackData = {"state": state.state, "fullStateName": state.fullStateName, "death": state.death, "recovered": state.recovered, "hospitalized": state.hospitalized};
      this.currentStackData.push(currentStackData);
    })

    this.maxYAxisVal += this.maxYAxisVal * 0.1;
    // console.log("after", this.maxYAxisVal, this.currentStateData );
    resolve(this.currentStateData);
  })
}

  createChart() {
    this.svg = d3.select("#barChartGraph")
                .append("svg")
                .attr("width", this.width + this.marginLeft + this.marginRight)
                .attr("height", this.height + this.marginTop + this.marginBottom)
                .append("g")
                .attr("transform", "translate(" + this.marginLeft + "," + this.marginTop + ")");

    // console.log("current data", this.currentStateData)
    
    let x = d3.scaleBand()
              .domain(this.currentStateData.map(d => d.state))
              .range([0, this.width/2])
              .padding(0.5);
    
    this.svg.append('g')
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));
    
    // console.log("check maxYAxisVal", this.maxYAxisVal, this.currentStackData)
    let y = d3.scaleLinear()
              .domain([0,this.maxYAxisVal])
              .range([this.height, 0])
              .nice();
    
    this.svg.append('g')
            .call(d3.axisLeft(y));

    let color = d3.scaleOrdinal()
                  .domain(this.subgroups)
                  .range(['#e41a1c', '#377eb8', '#4daf4a'])
    
    var stackedData = d3.stack()
                  .keys(this.subgroups)(this.currentStackData);

    this.svg.append('g')
            .selectAll('g')
            .data(stackedData)
            .enter()
            .append('g')
            .attr('fill', function(d: any) {
              // console.log("check key", d)
              return color(d.key);
            })
            .selectAll('rect')
            .data(function(d: any) {return d;})
            .enter()
            .append('rect')
            .attr('x', function(d: any) {
              // console.log("check key", d)
              return x(d.data.state);
            })
            .attr('y', function(d: any) {return y(d[1]);})
            .attr('height', function(d: any) {return y(d[0]) - y(d[1]);})
            .attr('width', x.bandwidth());
    
    var legend = this.svg.append("g")
                  .attr("font-family", "sans-serif")
                  .attr("font-size", 10)
                  .attr("text-anchor", "end")
                  .selectAll("g")
                  .data(this.subgroups.slice().reverse())
                  .enter().append("g")
                  .attr("transform", function(d: any, i: any) { return "translate(0," + i * 20 + ")"; });
      
    legend.append("rect")
          .attr("x", this.width/2 + 5)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", color);
  
    legend.append("text")
          .attr("x", this.width/2)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d: any) { return d; });
    
    this.dynamicalChange();
  }

  dynamicalChange(){
    this.dynamicalInterval = setInterval(() => {
      let current = new Date(this.currentDate);
      // console.log("get new date", this.currentDate)
      if(current < new Date(this.maxDate)){
        // weird, need to add the next line of code to ensure that this.currentDate can get the right value
        let nextDate = new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-CA').slice(0, 10)
        this.currentDate = new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-CA').slice(0, 10);
        // console.log("check", new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-CA').slice(0, 10), this.currentDate);
        this.prepareData()
          .then(() => {
            d3.select("#barChartGraph").html(null);
            this.updateBars();
          })
          .catch(error => console.log("error when prepare data", error));
      }else{
        clearInterval(this.dynamicalInterval);
        setTimeout(() => {
          this.currentDate = this.minDate;
          this.dynamicalChange();
        }, 3000);
      }
    }, -this.speed);
  }

  updateBars(){
    let that = this;

    this.svg = d3.select("#barChartGraph")
                .append("svg")
                .attr("width", this.width + this.marginLeft + this.marginRight)
                .attr("height", this.height + this.marginTop + this.marginBottom)
                .append("g")
                .attr("transform", "translate(" + this.marginLeft + "," + this.marginTop + ")");

    // console.log("current data", this.currentStateData)
    
    let x = d3.scaleBand()
              .domain(this.currentStateData.map(d => d.state))
              .range([0, this.width/2.2])
              .padding(0.5);
    
    this.svg.append('g')
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));
    
    // console.log("check maxYAxisVal", this.maxYAxisVal, this.currentStackData)
    let y = d3.scaleLinear()
              .domain([0,this.maxYAxisVal])
              .range([this.height, 0])
              .nice();
    
    this.svg.append('g')
            .call(d3.axisLeft(y));

    let color = d3.scaleOrdinal()
                  .domain(this.subgroups)
                  .range(['#e41a1c', '#377eb8', '#4daf4a'])
    
    var stackedData = d3.stack()
                  .keys(this.subgroups)(this.currentStackData);
        
    var Tooltip = d3.select("#barChartGraph")
                  .append("div")
                  .style("opacity", 0)
                  .attr("class", "tooltip")
                  .style("background-color", "white")
                  .style("border", "solid")
                  .style("border-width", "1px")
                  .style("border-radius", "5px")
                  .style("padding", "5px");

    this.svg.append('g')
            .selectAll('g')
            .data(stackedData)
            .enter()
            .append('g')
            .attr('fill', function(d: any) {
              // console.log("check key", d)
              return color(d.key);
            })
            .selectAll('rect')
            .data(function(d: any) {return d;})
            .enter()
            .append('rect')
            .attr('x', function(d: any) {
              // console.log("check key", d)
              return x(d.data.state);
            })
            .attr('y', function(d: any) {return y(d[1]);})
            .attr('height', function(d: any) {return y(d[0]) - y(d[1]);})
            .attr('width', x.bandwidth())
            .on("mouseover", function(d: any, i: any){
              clearInterval(that.dynamicalInterval);
              // console.log("mouse over", d, i.data)
            })
            .on("mousemove", function(d: any, i: any){
              clearInterval(that.dynamicalInterval);
              Tooltip
                .html('<div style="font-size: 11px;">Recovered: ' + i.data.recovered + '</div>' + '<div style="font-size: 11px;">Hospitalized: ' + i.data.hospitalized + '</div>' + '<div style="font-size: 11px;">Death: ' + i.data.death + '</div>')
                .style("left", d.x + 30 + "px")
                .style("top", d.y + "px")
                .style("opacity", 1);
            })
            .on("mouseleave", function(){
              that.dynamicalChange();
            })
    
    var legend = this.svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(this.subgroups.slice().reverse())
            .enter().append("g")
            .attr("transform", function(d: any, i: any) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", this.width/2 + 5)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", color);

    legend.append("text")
        .attr("x", this.width/2)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d: any) { return d; });
          
  }

  ngOnDestroy(){
    clearInterval(this.dynamicalInterval);
  }

}
    
 


