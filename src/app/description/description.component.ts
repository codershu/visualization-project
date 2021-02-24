import { Component, OnInit } from '@angular/core';
import states from '../../assets/data/state_name.json';
import { HttpClient } from '@angular/common/http';
import { DailyData, StateData } from '../shared/models';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  myStates: {} = states;
  fileReader = new FileReader();
  allStates: StateData[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  // processData(){

  //   Object.entries(this.myStates).forEach(([key, value]) => {
  //     console.log("check", key, value)
  //     let fileName = key + '.csv';
  //     let filePath = 'assets/data/history/csv/' + fileName;
  //     // this.readFile(filePath);
  //   });
  // }

  // readFile(filePath: string){
  //   this.http.get(filePath, {responseType: 'text'})
  //   .subscribe(
  //       data => {
  //           this.csvToJson(data);
  //       },
  //       error => {
  //           console.log(error);
  //       }
  //   );
  // }

  // csvToJson(data: any) {
  //   let record = data.split(/\r\n|\n/);
  //   let headers = record[0].split(',');
  //   let lines = [];
  //   let stateDataList: StateData[] = [];

  //   for (let i = 1; i < record.length; i++) {
  //       let data = record[i].split(',');
  //       let row = new DailyData();
  //       row.death = +data[2];
  //       row.deathConfirmed = +data[3];
  //       row.deathIncrease = +data[4];
  //       row.deathProbable = +data[5];
  //       row.hospitalized = +data[6];
  //       row.hospitalizedCumulative = +data[7];
  //       row.hospitalizedCurrently = +data[8];
  //       row.hospitalizedIncrease = +data[9];
  //       row.inIcuCumulative = +data[10];
  //       row.inIcuCurrently = +data[11];
  //       row.negative = +data[12];
  //       row.negativeIncrease = +data[13];
  //       row.negativeTestsAntibody = +data[14];
  //       row.negativeTestsPeopleAntibody = +data[15];
  //       row.negativeTestsViral = +data[16];
  //       row.onVentilatorCumulative = +data[17];
  //       row.onVentilatorCurrently = +data[18];
  //       row.positive = +data[19];
  //       row.positiveCasesViral = +data[20];
  //       row.positiveIncrease = +data[21];
  //       row.positiveScore = +data[22];
  //       row.positiveTestsAntibody = +data[23];
  //       row.positiveTestsAntigen = +data[24];
  //       row.positiveTestsPeopleAntibody = +data[25];
  //       row.positiveTestsPeopleAntigen = +data[26];
  //       row.positiveTestsViral = +data[27];
  //       row.recovered = +data[28];
  //       row.totalTestEncountersViral = +data[29];
  //       row.totalTestEncountersViralIncrease = +data[30];
  //       row.totalTestResults = +data[31];
  //       row.totalTestResultsIncrease = +data[32];
  //       row.totalTestsAntibody = +data[33];
  //       row.totalTestsAntigen = +data[34];
  //       row.totalTestsPeopleAntibody = +data[35];
  //       row.totalTestsPeopleAntigen = +data[36];
  //       row.totalTestsPeopleViral = +data[37];
  //       row.totalTestsPeopleViralIncrease = +data[38];
  //       row.totalTestsViral = +data[39];
  //       row.totalTestsViralIncrease = +data[40];

  //       let stateData = new StateData();
  //       stateData.date = new Date(data[0]);
  //       stateData.state = data[1];
  //       stateData.daily = row;

  //       stateDataList.push(stateData);
  //   }

  //   console.log("check state data", stateDataList)
  //   let fileName = 'AZ.json';
  //   let filePath = 'assets/data/history/json/' + fileName;
  //   this.http.post(filePath, stateDataList).subscribe(data => {
  //     console.log("successfully created json file");
  //   }, error => {
  //     console.log("error when creating json file", error)
  //   })

  // }

}
