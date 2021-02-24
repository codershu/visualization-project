import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.css']
})
export class MapChartComponent implements OnInit {

  myNumber: number = 0;
  myDate: string[] = ['2021-01-01', '2021-01-02', '2021-01-03'];
  index: number = 0;
  json: [] = [];

  constructor() { }

  ngOnInit(): void {
    this.dynamicalChange();
  }

  dynamicalChange(){
    setInterval(() => {
      let currentDate = this.myDate[this.index];
      this.changeData(currentDate);
      this.index += 1;
    }, 1000);
  }

  changeData(date: string){
    // d3.selectAll(this.json.find(x => x.date == date))
    // .enter()
    
  }
}
