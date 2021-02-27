import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import * as d3 from "d3";
import states from '../../assets/data/state_name.json';
import { DailyData, StateData } from '../shared/models';

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
  // currentStateData: BarChartSingleDayData[] = [];
  
  margin: {} = { top:20, right:20, bottom:30, left:40};
 

 
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
    // Promise.all(this.loadAllFilePromises)
    //   .then(() => {
    //     this.loadBarChartData();
    //   });

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
// loadBarChartData(){
//   d3.json("assets/data/history/json")
//     .then(data => {
//         // console.log("check map data", data);
//         this.BarChartData = data;
//         this.prepareDate();
//     })
//     .catch(error => 
//       console.log("error when load us.json", error)
//     );
// }

// prepareDate(){
//   // this.allStatesData.forEach(state => {
//   //   let tempDate = new Date(state.daily[state.daily.length - 1].date);
//   //   let current = new Date(this.minDate);
//   //   if(tempDate < current){
//   //     this.minDate = state.daily[state.daily.length - 1].date;
//   //   }
//   // })
//   this.currentDate = this.minDate;
//   // console.log("check min date", this.minDate)
//   this.prepareData()
//       .then(() => {
//         // this.createChart();
    
//       })
//       .catch(error => console.log("error when inital draw map", error));
// }

// prepareData(): Promise<any> {
//   return new Promise((resolve, reject) => {
//     this.currentStateData = [];
//     this.allStatesData.forEach(state => {
//       let currentDeath = state.daily.find(x => x.date == this.currentDate)?.death;
//       // console.log("check each state", state.fullStateName, currentPositive)
//       currentDeath = currentDeath == null ? 0 : currentDeath;
//       let currentRecovered = state.daily.find(x => x.date == this.currentDate)?.recovered;
//       currentRecovered = currentRecovered == null ? 0 : currentRecovered;
//       let currentHospitalized = state.daily.find(x => x.date == this.currentDate)?.hospitalized;
//       currentHospitalized = currentHospitalized == null ? 0 : currentHospitalized;
//       let currentStateData = new BarChartSingleDayData();
//       currentStateData.state = state.state;
//       currentStateData.death = currentDeath;
//       currentStateData.recovered = currentRecovered;
//       currentStateData.hospitalized = currentHospitalized;
//       currentStateData.fullStateName = state.fullStateName;
//       this.currentStateData.push(currentStateData);
//     })

//     resolve(this.currentStateData);
//   })
// }




  // createChart() {
  //   const svg = d3.create('svg')
  //                 .attr('')

  //   const element = this.chartContainer.nativeElement;
  //   const data = this.data;

  //   const svg = d3.select(element)
  //                 .append('svg')
  //                 .attr('width', element.offsetWidth)
  //                 .attr('height', element.offsetHeight);

  //   const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
  //   const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

  //   const x = d3
  //     .scaleBand()
  //     .rangeRound([0, contentWidth])
  //     .padding(0.1)
  //     .domain(data.map(d => d.letter));

  //   const y = d3
  //     .scaleLinear()
  //     .rangeRound([contentHeight, 0])
  //     .domain([0, d3.max(data, d => d.frequency)]);

  //   const g = svg.append('g')
  //     .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

  //   g.append('g')
  //     .attr('class', 'axis axis--x')
  //     .attr('transform', 'translate(0,' + contentHeight + ')')
  //     .call(d3.axisBottom(x));

  //   g.append('g')
  //     .attr('class', 'axis axis--y')
  //     .call(d3.axisLeft(y).ticks(10, '%'))
  //     .append('text')
  //     .attr('transform', 'rotate(-90)')
  //     .attr('y', 6)
  //     .attr('dy', '0.71em')
  //     .attr('text-anchor', 'end')
  //     .text('Frequency');

  //   g.selectAll('.bar')
  //     .data(data)
  //     .enter()
  //     .append('rect')
  //     .attr('class', 'bar')
  //     .attr('x', d => x(d.letter))
  //     .attr('y', d => y(d.frequency))
  //     .attr('width', x.bandwidth())
  //     .attr('height', d => contentHeight - y(d.frequency));
  // }


  


 

  
}