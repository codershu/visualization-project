import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CircularChartComponent } from './circular-chart/circular-chart.component';
import { MapChartComponent } from './map-chart/map-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { DescriptionComponent } from './description/description.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    CircularChartComponent,
    MapChartComponent,
    BarChartComponent,
    DescriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
