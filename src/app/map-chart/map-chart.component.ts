import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import states from '../../assets/data/state_name.json';
import { HttpClient } from '@angular/common/http';
import { DailyData, StateData } from '../shared/models';
import * as topojson from 'topojson';
import { FeatureCollection, GeometryCollection } from 'geojson';

@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.css']
})
export class MapChartComponent implements OnInit {

  myStates: {} = states;
  loadAllFilePromises: Promise<any>[] = [];

  width: number = 960;
  height: number = 500;
  myNumber: number = 0;
  myDates: string[] = ['2021-01-01', '2021-01-02', '2021-01-03'];
  allStatesData: StateData[] = [];
  index: number = 0;
  svg: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(){
    Object.entries(this.myStates).forEach(([key, value]) => {
      // console.log("check", key, value)
      let fileName = key + '.json';
      let filePath = 'assets/data/history/json/' + fileName;
      this.loadAllFilePromises.push(this.readFile(filePath, key));
    });

    Promise.all(this.loadAllFilePromises)
      .then(() => {
        this.loadMapData();
      });
    
  }

  readFile(filePath: string, stateName: string): Promise<any> {
      return new Promise((resolve, reject) => {
        this.http.get(filePath, {responseType: 'json'})
          .subscribe(
            data => {
              let currentStateData: StateData = new StateData();
                Object.entries(data).forEach(([key, value]) => {
                  let daily: DailyData = Object.assign(new DailyData(), value);
                  currentStateData.daily.push(daily);
                });
                currentStateData.state = stateName;
                this.allStatesData.push(currentStateData);
                // console.log("check json", currentStateData);
                resolve(currentStateData);
              },
            error => {
              reject(error);
              console.log(error);
            }
          );
      })
  }

  loadMapData(){
    d3.json("assets/map/us.json")
      .then(data => {
          console.log("check map data", data);
          this.drawMap(data);
      })
      .catch(error => 
        console.log("error when load us.json", error)
      );
  }

  drawMap(data: any){
    this.svg = d3.select("#graph")
                .append("svg")
                .attr("width", this.width)
                .attr("height", this.height)

    let projection = d3.geoAlbersUsa()
                      .scale(1000)
                      .translate([this.width/2, this.height/2])
    
    let path = d3.geoPath()
                .projection(projection);

    this.svg.selectAll(null)
            .data((topojson.feature(data, data.objects.states) as unknown as FeatureCollection).features)
            .enter()
            .append("path")
            .attr("fill","#e3e3e3")
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5)
            .attr("d", path);
  }

  dynamicalChange(){
    setInterval(() => {
      let currentDate = this.myDates[this.index];
      this.changeData(currentDate);
      this.index += 1;
    }, 1000);
  }

  changeData(date: string){
    
  }
}
