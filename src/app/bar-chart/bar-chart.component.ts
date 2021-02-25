import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as d3 from "d3";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  currentDate: string = "";

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { 
    this.form = this.formBuilder.group({
      selectedStates: []
    });
  }

  ngOnInit(): void {
  }

}
