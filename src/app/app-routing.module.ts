import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { MapChartComponent } from './map-chart/map-chart.component';
import { CircularChartComponent } from './circular-chart/circular-chart.component';
import { DescriptionComponent } from './description/description.component';


const routes: Routes = [
  { path: 'home', component: DescriptionComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'map', component: MapChartComponent},
  { path: 'bar', component: BarChartComponent},
  { path: 'circular', component: CircularChartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
