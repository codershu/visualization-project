(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/shuhan/UVIC/2021 Spring/CSC 511/Project/Actual Code/visualization-covid19/src/main.ts */"zUnb");


/***/ }),

/***/ "3ye2":
/*!*****************************************!*\
  !*** ./src/assets/data/state_name.json ***!
  \*****************************************/
/*! exports provided: AK, AL, AR, AS, AZ, CA, CO, CT, DC, DE, FL, GA, GU, HI, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MP, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, PR, RI, SC, SD, TN, TX, UT, VA, VI, VT, WA, WI, WV, WY, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"AK\":\"Alaska\",\"AL\":\"Alabama\",\"AR\":\"Arkansas\",\"AS\":\"American Samoa\",\"AZ\":\"Arizona\",\"CA\":\"California\",\"CO\":\"Colorado\",\"CT\":\"Connecticut\",\"DC\":\"District of Columbia\",\"DE\":\"Delaware\",\"FL\":\"Florida\",\"GA\":\"Georgia\",\"GU\":\"Guam\",\"HI\":\"Hawaii\",\"IA\":\"Iowa\",\"ID\":\"Idaho\",\"IL\":\"Illinois\",\"IN\":\"Indiana\",\"KS\":\"Kansas\",\"KY\":\"Kentucky\",\"LA\":\"Louisiana\",\"MA\":\"Massachusetts\",\"MD\":\"Maryland\",\"ME\":\"Maine\",\"MI\":\"Michigan\",\"MN\":\"Minnesota\",\"MO\":\"Missouri\",\"MP\":\"Northern Mariana Islands\",\"MS\":\"Mississippi\",\"MT\":\"Montana\",\"NC\":\"North Carolina\",\"ND\":\"North Dakota\",\"NE\":\"Nebraska\",\"NH\":\"New Hampshire\",\"NJ\":\"New Jersey\",\"NM\":\"New Mexico\",\"NV\":\"Nevada\",\"NY\":\"New York\",\"OH\":\"Ohio\",\"OK\":\"Oklahoma\",\"OR\":\"Oregon\",\"PA\":\"Pennsylvania\",\"PR\":\"Puerto Rico\",\"RI\":\"Rhode Island\",\"SC\":\"South Carolina\",\"SD\":\"South Dakota\",\"TN\":\"Tennessee\",\"TX\":\"Texas\",\"UT\":\"Utah\",\"VA\":\"Virginia\",\"VI\":\"US Virgin Islands\",\"VT\":\"Vermont\",\"WA\":\"Washington\",\"WI\":\"Wisconsin\",\"WV\":\"West Virginia\",\"WY\":\"Wyoming\"}");

/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "DR3Z":
/*!**************************************************!*\
  !*** ./src/app/map-chart/map-chart.component.ts ***!
  \**************************************************/
/*! exports provided: MapChartComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapChartComponent", function() { return MapChartComponent; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "VphZ");
/* harmony import */ var _assets_data_state_name_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../assets/data/state_name.json */ "3ye2");
var _assets_data_state_name_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../assets/data/state_name.json */ "3ye2", 1);
/* harmony import */ var _shared_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/models */ "gG+F");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "tk/3");





class MapChartComponent {
    constructor(http) {
        this.http = http;
        this.myStates = _assets_data_state_name_json__WEBPACK_IMPORTED_MODULE_1__;
        this.loadAllFilePromises = [];
        this.currentDate = "";
        this.mapData = null;
        this.width = 860;
        this.height = 500;
        this.myNumber = 0;
        this.minDate = "2020-03-01";
        this.maxDate = "2021-02-22";
        this.allStatesData = [];
        this.currentStateData = [];
        this.lowColor = "#f9f9f9";
        this.highColor = "#B22222";
        this.mouseoverState = "None";
        this.mouseoverNumber = 0;
        this.projection = d3__WEBPACK_IMPORTED_MODULE_0__["geoAlbersUsa"]()
            .scale(900)
            .translate([this.width / 2, this.height / 2]);
        this.path = d3__WEBPACK_IMPORTED_MODULE_0__["geoPath"]()
            .projection(this.projection);
        this.minVal = 0;
        this.maxVal = 0;
        this.ramp = d3__WEBPACK_IMPORTED_MODULE_0__["scaleLinear"]()
            .domain([this.minVal, this.maxVal])
            //  .interpolate(d3.interpolatePuRd(["", ""]))
            .range([this.lowColor, this.highColor]);
    }
    ngOnInit() {
        // start point for everything
        this.loadAllData();
    }
    loadAllData() {
        // loop through state_name list to create each file name to read file
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
            this.ramp = d3__WEBPACK_IMPORTED_MODULE_0__["scaleLinear"]().domain([this.minVal, this.maxVal / 2]).range([this.lowColor, this.highColor]);
            this.loadMapData();
        });
    }
    // this is a Promise function, Promise will ensure finishing current work before reaching to the next step
    readFile(filePath, stateName, fullStateName) {
        return new Promise((resolve, reject) => {
            this.http.get(filePath, { responseType: 'json' })
                .subscribe(data => {
                let currentStateData = new _shared_models__WEBPACK_IMPORTED_MODULE_2__["StateData"]();
                // loop through each day's data of a state to combine as a summarized data set
                Object.entries(data).forEach(([key, value]) => {
                    // console.log("check key value", key, value)
                    let daily = Object.assign(new _shared_models__WEBPACK_IMPORTED_MODULE_2__["DailyData"](), value);
                    // this.minVal = daily.positive < this.minVal ? daily.positive : this.minVal;
                    this.maxVal = daily.positive > this.maxVal ? daily.positive : this.maxVal;
                    currentStateData.daily.push(daily);
                });
                currentStateData.state = stateName;
                currentStateData.fullStateName = fullStateName;
                this.allStatesData.push(currentStateData);
                // console.log("check json", currentStateData);
                resolve(currentStateData);
            }, error => {
                reject(error);
                console.log("error when read file", error);
            });
        });
    }
    // read map json file
    loadMapData() {
        d3__WEBPACK_IMPORTED_MODULE_0__["json"]("assets/map/us-state.json")
            .then(data => {
            // console.log("check map data", data);
            this.mapData = data;
            this.prepareDate();
        })
            .catch(error => console.log("error when load us.json", error));
    }
    // find the minimum date as the start date
    prepareDate() {
        // this.allStatesData.forEach(state => {
        //   let tempDate = new Date(state.daily[state.daily.length - 1].date);
        //   let current = new Date(this.minDate);
        //   if(tempDate < current){
        //     this.minDate = state.daily[state.daily.length - 1].date;
        //   }
        // })
        this.currentDate = this.minDate;
        // console.log("check min date", this.minDate)
        this.prepareData()
            .then(() => {
            this.drawMap();
            this.drawLengend();
        })
            .catch(error => console.log("error when inital draw map", error));
    }
    // reorganize data into a single day dataset with all states, "recovered" was not actually used
    prepareData() {
        return new Promise((resolve, reject) => {
            this.currentStateData = [];
            this.allStatesData.forEach(state => {
                var _a, _b;
                let currentPositive = (_a = state.daily.find(x => x.date == this.currentDate)) === null || _a === void 0 ? void 0 : _a.positive;
                // console.log("check each state", state.fullStateName, currentPositive)
                currentPositive = currentPositive == null ? 0 : currentPositive;
                let currentRecovered = (_b = state.daily.find(x => x.date == this.currentDate)) === null || _b === void 0 ? void 0 : _b.recovered;
                currentRecovered = currentRecovered == null ? 0 : currentRecovered;
                let currentStateData = new _shared_models__WEBPACK_IMPORTED_MODULE_2__["MapSingleDayData"]();
                currentStateData.state = state.state;
                currentStateData.positive = currentPositive;
                currentStateData.recovered = currentRecovered;
                currentStateData.fullStateName = state.fullStateName;
                this.currentStateData.push(currentStateData);
            });
            resolve(this.currentStateData);
        });
    }
    // draw the map initially, notice the this.svg is a global variable, for updating data on it in the following step
    drawMap() {
        // console.log("check current data", this.currentStateData)
        let that = this;
        this.svg = d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#graph")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
        this.svg.selectAll()
            .data(this.mapData.features)
            .enter()
            .append("path")
            // fill is the key step to update the color filled in each state
            // by using ramp function with the current positive number
            // ramp is a d3 way to define the color of choosed area
            .attr("fill", function (d) {
            // console.log("check d", d);
            let data = that.currentStateData.find(x => x.fullStateName == d.properties.name);
            if (data) {
                let value = data.positive - data.recovered;
                return that.ramp(value);
            }
            else
                return that.lowColor;
        })
            .attr("stroke", "#333")
            .attr("stroke-width", 0.5)
            .attr("d", that.path);
        this.tooltip = d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#graph")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");
        this.addTag();
        // after inital drawing, start adding time to update data
        this.dynamicalChange();
    }
    addTag() {
        let that = this;
        this.svg.selectAll("text")
            .data(this.mapData.features)
            .enter()
            .append("svg:text")
            .text(function (d) {
            let shortName = "";
            Object.entries(that.myStates).forEach(([key, value]) => {
                if (value == d.properties.name) {
                    shortName = key;
                }
            });
            return shortName;
        })
            .attr("x", function (d) {
            return that.path.centroid(d)[0];
        })
            .attr("y", function (d) {
            return that.path.centroid(d)[1];
        })
            .attr("text-anchor", "middle")
            .attr('font-size', '6pt')
            .on("mouseover", function (d, i) {
            clearInterval(that.dynamicalInterval);
            that.tooltip.style("opacity", 1);
            d3__WEBPACK_IMPORTED_MODULE_0__["select"](null)
                .style("stroke", "none")
                .style("opacity", 0.8);
            let data = that.currentStateData.find(x => x.fullStateName == i.properties.name);
            let number = 0;
            if (data)
                number = data.positive;
            that.mouseoverState = i.properties.name;
            that.mouseoverNumber = number;
            // that.tooltip
            //   .html(function(){
            //     // console.log("check d 2", d)
            //     return "State: " + i.properties.name + ", Number: " + number;
            //   }
            // )  
        })
            .on("mousemove", function (d, i) {
            clearInterval(that.dynamicalInterval);
            let data = that.currentStateData.find(x => x.fullStateName == i.properties.name);
            let number = 0;
            if (data)
                number = data.positive;
            that.mouseoverState = i.properties.name;
            that.mouseoverNumber = number;
            // that.tooltip
            //   .html(function(){
            //     // console.log("check d 2", d)
            //     return "State: " + i.properties.name + ", Number: " + number;
            //   }
            // )  
        })
            .on("mouseleave", function () {
            that.mouseoverState = "None";
            that.mouseoverNumber = 0;
            that.dynamicalChange();
            that.tooltip
                .style("opacity", 0);
            d3__WEBPACK_IMPORTED_MODULE_0__["select"](null)
                .style("stroke", "none")
                .style("opacity", 0.8);
        });
    }
    // use the setInterval function to update the data with certain time period
    dynamicalChange() {
        this.dynamicalInterval = setInterval(() => {
            let current = new Date(this.currentDate);
            if (current < new Date(this.maxDate)) {
                this.currentDate = new Date(current.setDate(current.getDate() + 1)).toLocaleString('en-CA').slice(0, 10);
                this.prepareData()
                    .then(() => {
                    this.updateMap();
                })
                    .catch(error => console.log("error when prepare data", error));
            }
            else {
                clearInterval(this.dynamicalInterval);
                setTimeout(() => {
                    this.currentDate = this.minDate;
                    this.dynamicalChange();
                }, 3000);
            }
        }, 50);
    }
    // update existing map with new data
    updateMap() {
        let that = this;
        this.svg.selectAll("path")
            .data(this.mapData.features)
            // .enter()
            .attr("fill", function (d) {
            let data = that.currentStateData.find(x => x.fullStateName == d.properties.name);
            if (data) {
                // console.log("check d", data.positive, data.recovered);
                // let value = data.positive - data.recovered;
                let value = data.positive;
                return that.ramp(value);
            }
            else
                return that.lowColor;
        })
            .on("mouseover", function (d, i) {
            clearInterval(that.dynamicalInterval);
            that.tooltip.style("opacity", 1);
            d3__WEBPACK_IMPORTED_MODULE_0__["select"](null)
                .style("stroke", "none")
                .style("opacity", 0.8);
            let data = that.currentStateData.find(x => x.fullStateName == i.properties.name);
            let number = 0;
            if (data)
                number = data.positive;
            that.mouseoverState = i.properties.name;
            that.mouseoverNumber = number;
            // that.tooltip
            //   .html(function(){
            //     // console.log("check d 2", d)
            //     return "State: " + i.properties.name + ", Number: " + number;
            //   }
            // )  
        })
            .on("mousemove", function (d, i) {
            clearInterval(that.dynamicalInterval);
            let data = that.currentStateData.find(x => x.fullStateName == i.properties.name);
            let number = 0;
            if (data)
                number = data.positive;
            that.mouseoverState = i.properties.name;
            that.mouseoverNumber = number;
            // that.tooltip
            //   .html(function(){
            //     // console.log("check d 2", d)
            //     return "State: " + i.properties.name + ", Number: " + number;
            //   }
            // )  
        })
            .on("mouseleave", function () {
            that.dynamicalChange();
            that.tooltip
                .style("opacity", 0);
            d3__WEBPACK_IMPORTED_MODULE_0__["select"](null)
                .style("stroke", "none")
                .style("opacity", 0.8);
            that.mouseoverState = "None";
            that.mouseoverNumber = 0;
        })
            .attr("d", that.path);
        this.addTag();
    }
    drawLengend() {
        var w = 140, h = 300;
        var key = d3__WEBPACK_IMPORTED_MODULE_0__["select"]("#graph")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "legend");
        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "100%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");
        legend.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", this.highColor)
            .attr("stop-opacity", 1);
        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", this.lowColor)
            .attr("stop-opacity", 1);
        key.append("rect")
            .attr("width", w - 110)
            .attr("height", h)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");
        var y = d3__WEBPACK_IMPORTED_MODULE_0__["scaleLinear"]()
            .range([h, 0])
            .domain([this.minVal, this.maxVal / 2]);
        var yAxis = d3__WEBPACK_IMPORTED_MODULE_0__["axisRight"](y);
        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(31,10)")
            .call(yAxis);
    }
}
MapChartComponent.ɵfac = function MapChartComponent_Factory(t) { return new (t || MapChartComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"])); };
MapChartComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: MapChartComponent, selectors: [["app-map-chart"]], decls: 16, vars: 3, consts: [[1, "main-container"], [1, "sub-page-title"], [2, "font-weight", "bold"], [1, "self-tooltip"], [2, "color", "darkslategray", "font-weight", "bold"], [2, "color", "darkviolet", "font-family", "Arial, Helvetica, sans-serif", "font-weight", "800", "font-size", "large"], [2, "color", "red", "font-family", "Arial, Helvetica, sans-serif", "font-weight", "800", "font-size", "large"], ["id", "graph"]], template: function MapChartComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "h4", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "US Covid-19 Positive Case Map");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Current Date: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9, " State: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](12, ", Number: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](15, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.currentDate);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.mouseoverState);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.mouseoverNumber);
    } }, styles: [".tooltip[_ngcontent-%COMP%] {   \n    \n    text-align: center;         \n    width: 80px;                    \n    height: 28px;                   \n    padding: 2px;               \n    font: 12px sans-serif;      \n    background: lightsteelblue; \n    border: 0px;        \n    border-radius: 8px;         \n    pointer-events: none;           \n}\n\n.self-tooltip[_ngcontent-%COMP%]{\n    text-align: center;\n    margin-top: 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hcC1jaGFydC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksaUNBQWlDO0lBQ2pDLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsWUFBWTtJQUNaLFlBQVk7SUFDWixxQkFBcUI7SUFDckIsMEJBQTBCO0lBQzFCLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsb0JBQW9CO0FBQ3hCOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLGdCQUFnQjtBQUNwQiIsImZpbGUiOiJtYXAtY2hhcnQuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi50b29sdGlwIHsgICBcbiAgICAvKiBwb3NpdGlvbjogYWJzb2x1dGU7ICAgICAgICAgICovXG4gICAgdGV4dC1hbGlnbjogY2VudGVyOyAgICAgICAgIFxuICAgIHdpZHRoOiA4MHB4OyAgICAgICAgICAgICAgICAgICAgXG4gICAgaGVpZ2h0OiAyOHB4OyAgICAgICAgICAgICAgICAgICBcbiAgICBwYWRkaW5nOiAycHg7ICAgICAgICAgICAgICAgXG4gICAgZm9udDogMTJweCBzYW5zLXNlcmlmOyAgICAgIFxuICAgIGJhY2tncm91bmQ6IGxpZ2h0c3RlZWxibHVlOyBcbiAgICBib3JkZXI6IDBweDsgICAgICAgIFxuICAgIGJvcmRlci1yYWRpdXM6IDhweDsgICAgICAgICBcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTsgICAgICAgICAgIFxufVxuXG4uc2VsZi10b29sdGlwe1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBtYXJnaW4tdG9wOiAxMHB4O1xufSJdfQ== */"] });


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");


class AppComponent {
    constructor() {
        this.title = 'visualization-covid19';
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 26, vars: 0, consts: [["role", "banner", 1, "toolbar"], ["width", "100", "height", "40", "alt", "Uvic Logo", "src", "assets/img/UVic_logo.jpg"], [1, "spacer"], ["routerLink", "/home"], [1, "nav-sub-title"], ["routerLink", "/map"], ["routerLink", "/bar"], ["routerLink", "/circular"], ["role", "main", 1, "content"], [1, "fixed-bottom"], [1, "footer"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "CSC 511 Course Project -- Visualization COVID-19");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Description");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "Map");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "Bar");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "a", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "Circular");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](22, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "footer", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "\u00A9 2021 Copyright: Shu Han");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], styles: ["[_nghost-%COMP%] {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n    font-size: 14px;\n    color: #333;\n    box-sizing: border-box;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n\n  h1[_ngcontent-%COMP%], h2[_ngcontent-%COMP%], h3[_ngcontent-%COMP%], h4[_ngcontent-%COMP%], h5[_ngcontent-%COMP%], h6[_ngcontent-%COMP%] {\n    margin: 8px 0;\n  }\n\n  p[_ngcontent-%COMP%] {\n    margin: 0;\n  }\n\n  .spacer[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n\n  .toolbar[_ngcontent-%COMP%] {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    height: 60px;\n    display: flex;\n    align-items: center;\n    background-color: #1976d2;\n    color: white;\n    font-weight: 600;\n  }\n\n  .toolbar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n    margin: 0 16px;\n  }\n\n  .toolbar[_ngcontent-%COMP%]   #twitter-logo[_ngcontent-%COMP%] {\n    height: 40px;\n    margin: 0 16px;\n  }\n\n  .toolbar[_ngcontent-%COMP%]   #twitter-logo[_ngcontent-%COMP%]:hover {\n    opacity: 0.8;\n  }\n\n  .content[_ngcontent-%COMP%] {\n    display: flex;\n    margin: 82px auto 32px;\n    padding: 0 16px;\n    max-width: 960px;\n    flex-direction: column;\n    align-items: center;\n  }\n\n  svg.material-icons[_ngcontent-%COMP%] {\n    height: 24px;\n    width: auto;\n  }\n\n  svg.material-icons[_ngcontent-%COMP%]:not(:last-child) {\n    margin-right: 8px;\n  }\n\n  .card[_ngcontent-%COMP%]   svg.material-icons[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {\n    fill: #888;\n  }\n\n  .card-container[_ngcontent-%COMP%] {\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: center;\n    margin-top: 16px;\n  }\n\n  .card[_ngcontent-%COMP%] {\n    border-radius: 4px;\n    border: 1px solid #eee;\n    background-color: #fafafa;\n    height: 40px;\n    width: 200px;\n    margin: 0 8px 16px;\n    padding: 16px;\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    align-items: center;\n    transition: all 0.2s ease-in-out;\n    line-height: 24px;\n  }\n\n  .card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(:last-child) {\n    margin-right: 0;\n  }\n\n  .card.card-small[_ngcontent-%COMP%] {\n    height: 16px;\n    width: 168px;\n  }\n\n  .card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(.highlight-card) {\n    cursor: pointer;\n  }\n\n  .card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(.highlight-card):hover {\n    transform: translateY(-3px);\n    box-shadow: 0 4px 17px rgba(0, 0, 0, 0.35);\n  }\n\n  .card-container[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:not(.highlight-card):hover   .material-icons[_ngcontent-%COMP%]   path[_ngcontent-%COMP%] {\n    fill: rgb(105, 103, 103);\n  }\n\n  .card.highlight-card[_ngcontent-%COMP%] {\n    background-color: #1976d2;\n    color: white;\n    font-weight: 600;\n    border: none;\n    width: auto;\n    min-width: 30%;\n    position: relative;\n  }\n\n  .card.card.highlight-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    margin-left: 60px;\n  }\n\n  svg#rocket[_ngcontent-%COMP%] {\n    width: 80px;\n    position: absolute;\n    left: -10px;\n    top: -24px;\n  }\n\n  svg#rocket-smoke[_ngcontent-%COMP%] {\n    height: calc(100vh - 95px);\n    position: absolute;\n    top: 10px;\n    right: 180px;\n    z-index: -10;\n  }\n\n  a[_ngcontent-%COMP%], a[_ngcontent-%COMP%]:visited, a[_ngcontent-%COMP%]:hover {\n    color: #1976d2;\n    text-decoration: none;\n  }\n\n  a[_ngcontent-%COMP%]:hover {\n    color: #125699;\n  }\n\n  .terminal[_ngcontent-%COMP%] {\n    position: relative;\n    width: 80%;\n    max-width: 600px;\n    border-radius: 6px;\n    padding-top: 45px;\n    margin-top: 8px;\n    overflow: hidden;\n    background-color: rgb(15, 15, 16);\n  }\n\n  .terminal[_ngcontent-%COMP%]::before {\n    content: \"\\2022 \\2022 \\2022\";\n    position: absolute;\n    top: 0;\n    left: 0;\n    height: 4px;\n    background: rgb(58, 58, 58);\n    color: #c2c3c4;\n    width: 100%;\n    font-size: 2rem;\n    line-height: 0;\n    padding: 14px 0;\n    text-indent: 4px;\n  }\n\n  .terminal[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%] {\n    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;\n    color: white;\n    padding: 0 1rem 1rem;\n    margin: 0;\n  }\n\n  .circle-link[_ngcontent-%COMP%] {\n    height: 40px;\n    width: 40px;\n    border-radius: 40px;\n    margin: 8px;\n    background-color: white;\n    border: 1px solid #eeeeee;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    cursor: pointer;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n    transition: 1s ease-out;\n  }\n\n  .circle-link[_ngcontent-%COMP%]:hover {\n    transform: translateY(-0.25rem);\n    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);\n  }\n\n  footer[_ngcontent-%COMP%] {\n    margin-top: 8px;\n    display: flex;\n    align-items: center;\n    line-height: 20px;\n  }\n\n  footer[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n    display: flex;\n    align-items: center;\n  }\n\n  .github-star-badge[_ngcontent-%COMP%] {\n    color: #24292e;\n    display: flex;\n    align-items: center;\n    font-size: 12px;\n    padding: 3px 10px;\n    border: 1px solid rgba(27,31,35,.2);\n    border-radius: 3px;\n    background-image: linear-gradient(-180deg,#fafbfc,#eff3f6 90%);\n    margin-left: 4px;\n    font-weight: 600;\n    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;\n  }\n\n  .github-star-badge[_ngcontent-%COMP%]:hover {\n    background-image: linear-gradient(-180deg,#f0f3f6,#e6ebf1 90%);\n    border-color: rgba(27,31,35,.35);\n    background-position: -.5em;\n  }\n\n  .github-star-badge[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%] {\n    height: 16px;\n    width: 16px;\n    margin-right: 4px;\n  }\n\n  svg#clouds[_ngcontent-%COMP%] {\n    position: fixed;\n    bottom: -160px;\n    left: -230px;\n    z-index: -10;\n    width: 1920px;\n  }\n\n  \n\n  @media screen and (max-width: 767px) {\n\n    .card-container[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%]:not(.circle-link), .terminal[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n\n    .card[_ngcontent-%COMP%]:not(.highlight-card) {\n      height: 16px;\n      margin: 8px 0;\n    }\n\n    .card.highlight-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n      margin-left: 72px;\n    }\n\n    svg#rocket-smoke[_ngcontent-%COMP%] {\n      right: 120px;\n      transform: rotate(-5deg);\n    }\n  }\n\n  @media screen and (max-width: 575px) {\n    svg#rocket-smoke[_ngcontent-%COMP%] {\n      display: none;\n      visibility: hidden;\n    }\n  }\n\n  .nav-sub-title[_ngcontent-%COMP%]{\n    color: white;\n    margin-left: 20px;\n    margin-right: 20px;\n}\n\n  footer[_ngcontent-%COMP%]{\n    bottom: 0;\n    position: fixed;\n    width: 100%;\n}\n\n  .footer[_ngcontent-%COMP%]{\n    height: 30px;\n    margin: auto;\n    width: 400px;\n    text-align:center;\n    padding:10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7RUFDRTtJQUNFLDBKQUEwSjtJQUMxSixlQUFlO0lBQ2YsV0FBVztJQUNYLHNCQUFzQjtJQUN0QixtQ0FBbUM7SUFDbkMsa0NBQWtDO0VBQ3BDOztFQUVBOzs7Ozs7SUFNRSxhQUFhO0VBQ2Y7O0VBRUE7SUFDRSxTQUFTO0VBQ1g7O0VBRUE7SUFDRSxPQUFPO0VBQ1Q7O0VBRUE7SUFDRSxrQkFBa0I7SUFDbEIsTUFBTTtJQUNOLE9BQU87SUFDUCxRQUFRO0lBQ1IsWUFBWTtJQUNaLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIseUJBQXlCO0lBQ3pCLFlBQVk7SUFDWixnQkFBZ0I7RUFDbEI7O0VBRUE7SUFDRSxjQUFjO0VBQ2hCOztFQUVBO0lBQ0UsWUFBWTtJQUNaLGNBQWM7RUFDaEI7O0VBRUE7SUFDRSxZQUFZO0VBQ2Q7O0VBRUE7SUFDRSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsc0JBQXNCO0lBQ3RCLG1CQUFtQjtFQUNyQjs7RUFFQTtJQUNFLFlBQVk7SUFDWixXQUFXO0VBQ2I7O0VBRUE7SUFDRSxpQkFBaUI7RUFDbkI7O0VBRUE7SUFDRSxVQUFVO0VBQ1o7O0VBRUE7SUFDRSxhQUFhO0lBQ2IsZUFBZTtJQUNmLHVCQUF1QjtJQUN2QixnQkFBZ0I7RUFDbEI7O0VBRUE7SUFDRSxrQkFBa0I7SUFDbEIsc0JBQXNCO0lBQ3RCLHlCQUF5QjtJQUN6QixZQUFZO0lBQ1osWUFBWTtJQUNaLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2IsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsbUJBQW1CO0lBQ25CLGdDQUFnQztJQUNoQyxpQkFBaUI7RUFDbkI7O0VBRUE7SUFDRSxlQUFlO0VBQ2pCOztFQUVBO0lBQ0UsWUFBWTtJQUNaLFlBQVk7RUFDZDs7RUFFQTtJQUNFLGVBQWU7RUFDakI7O0VBRUE7SUFDRSwyQkFBMkI7SUFDM0IsMENBQTBDO0VBQzVDOztFQUVBO0lBQ0Usd0JBQXdCO0VBQzFCOztFQUVBO0lBQ0UseUJBQXlCO0lBQ3pCLFlBQVk7SUFDWixnQkFBZ0I7SUFDaEIsWUFBWTtJQUNaLFdBQVc7SUFDWCxjQUFjO0lBQ2Qsa0JBQWtCO0VBQ3BCOztFQUVBO0lBQ0UsaUJBQWlCO0VBQ25COztFQUVBO0lBQ0UsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsVUFBVTtFQUNaOztFQUVBO0lBQ0UsMEJBQTBCO0lBQzFCLGtCQUFrQjtJQUNsQixTQUFTO0lBQ1QsWUFBWTtJQUNaLFlBQVk7RUFDZDs7RUFFQTs7O0lBR0UsY0FBYztJQUNkLHFCQUFxQjtFQUN2Qjs7RUFFQTtJQUNFLGNBQWM7RUFDaEI7O0VBRUE7SUFDRSxrQkFBa0I7SUFDbEIsVUFBVTtJQUNWLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsaUJBQWlCO0lBQ2pCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsaUNBQWlDO0VBQ25DOztFQUVBO0lBQ0UsNEJBQTRCO0lBQzVCLGtCQUFrQjtJQUNsQixNQUFNO0lBQ04sT0FBTztJQUNQLFdBQVc7SUFDWCwyQkFBMkI7SUFDM0IsY0FBYztJQUNkLFdBQVc7SUFDWCxlQUFlO0lBQ2YsY0FBYztJQUNkLGVBQWU7SUFDZixnQkFBZ0I7RUFDbEI7O0VBRUE7SUFDRSxvRUFBb0U7SUFDcEUsWUFBWTtJQUNaLG9CQUFvQjtJQUNwQixTQUFTO0VBQ1g7O0VBRUE7SUFDRSxZQUFZO0lBQ1osV0FBVztJQUNYLG1CQUFtQjtJQUNuQixXQUFXO0lBQ1gsdUJBQXVCO0lBQ3ZCLHlCQUF5QjtJQUN6QixhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLG1CQUFtQjtJQUNuQixlQUFlO0lBQ2Ysd0VBQXdFO0lBQ3hFLHVCQUF1QjtFQUN6Qjs7RUFFQTtJQUNFLCtCQUErQjtJQUMvQiwyQ0FBMkM7RUFDN0M7O0VBRUE7SUFDRSxlQUFlO0lBQ2YsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixpQkFBaUI7RUFDbkI7O0VBRUE7SUFDRSxhQUFhO0lBQ2IsbUJBQW1CO0VBQ3JCOztFQUVBO0lBQ0UsY0FBYztJQUNkLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsZUFBZTtJQUNmLGlCQUFpQjtJQUNqQixtQ0FBbUM7SUFDbkMsa0JBQWtCO0lBQ2xCLDhEQUE4RDtJQUM5RCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGtJQUFrSTtFQUNwSTs7RUFFQTtJQUNFLDhEQUE4RDtJQUM5RCxnQ0FBZ0M7SUFDaEMsMEJBQTBCO0VBQzVCOztFQUVBO0lBQ0UsWUFBWTtJQUNaLFdBQVc7SUFDWCxpQkFBaUI7RUFDbkI7O0VBRUE7SUFDRSxlQUFlO0lBQ2YsY0FBYztJQUNkLFlBQVk7SUFDWixZQUFZO0lBQ1osYUFBYTtFQUNmOztFQUdBLHNCQUFzQjs7RUFDdEI7O0lBRUU7O01BRUUsV0FBVztJQUNiOztJQUVBO01BQ0UsWUFBWTtNQUNaLGFBQWE7SUFDZjs7SUFFQTtNQUNFLGlCQUFpQjtJQUNuQjs7SUFFQTtNQUNFLFlBQVk7TUFDWix3QkFBd0I7SUFDMUI7RUFDRjs7RUFFQTtJQUNFO01BQ0UsYUFBYTtNQUNiLGtCQUFrQjtJQUNwQjtFQUNGOztFQUVGO0lBQ0ksWUFBWTtJQUNaLGlCQUFpQjtJQUNqQixrQkFBa0I7QUFDdEI7O0VBRUE7SUFDSSxTQUFTO0lBQ1QsZUFBZTtJQUNmLFdBQVc7QUFDZjs7RUFFQTtJQUNJLFlBQVk7SUFDWixZQUFZO0lBQ1osWUFBWTtJQUNaLGlCQUFpQjtJQUNqQixZQUFZO0FBQ2hCIiwiZmlsZSI6ImFwcC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiXG4gIDpob3N0IHtcbiAgICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBcIlNlZ29lIFVJXCIsIFJvYm90bywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZiwgXCJBcHBsZSBDb2xvciBFbW9qaVwiLCBcIlNlZ29lIFVJIEVtb2ppXCIsIFwiU2Vnb2UgVUkgU3ltYm9sXCI7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGNvbG9yOiAjMzMzO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XG4gICAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTtcbiAgfVxuXG4gIGgxLFxuICBoMixcbiAgaDMsXG4gIGg0LFxuICBoNSxcbiAgaDYge1xuICAgIG1hcmdpbjogOHB4IDA7XG4gIH1cblxuICBwIHtcbiAgICBtYXJnaW46IDA7XG4gIH1cblxuICAuc3BhY2VyIHtcbiAgICBmbGV4OiAxO1xuICB9XG5cbiAgLnRvb2xiYXIge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICByaWdodDogMDtcbiAgICBoZWlnaHQ6IDYwcHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICMxOTc2ZDI7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIH1cblxuICAudG9vbGJhciBpbWcge1xuICAgIG1hcmdpbjogMCAxNnB4O1xuICB9XG5cbiAgLnRvb2xiYXIgI3R3aXR0ZXItbG9nbyB7XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIG1hcmdpbjogMCAxNnB4O1xuICB9XG5cbiAgLnRvb2xiYXIgI3R3aXR0ZXItbG9nbzpob3ZlciB7XG4gICAgb3BhY2l0eTogMC44O1xuICB9XG5cbiAgLmNvbnRlbnQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgbWFyZ2luOiA4MnB4IGF1dG8gMzJweDtcbiAgICBwYWRkaW5nOiAwIDE2cHg7XG4gICAgbWF4LXdpZHRoOiA5NjBweDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIH1cblxuICBzdmcubWF0ZXJpYWwtaWNvbnMge1xuICAgIGhlaWdodDogMjRweDtcbiAgICB3aWR0aDogYXV0bztcbiAgfVxuXG4gIHN2Zy5tYXRlcmlhbC1pY29uczpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDhweDtcbiAgfVxuXG4gIC5jYXJkIHN2Zy5tYXRlcmlhbC1pY29ucyBwYXRoIHtcbiAgICBmaWxsOiAjODg4O1xuICB9XG5cbiAgLmNhcmQtY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtYXJnaW4tdG9wOiAxNnB4O1xuICB9XG5cbiAgLmNhcmQge1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZWVlO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmYWZhZmE7XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIHdpZHRoOiAyMDBweDtcbiAgICBtYXJnaW46IDAgOHB4IDE2cHg7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlLWluLW91dDtcbiAgICBsaW5lLWhlaWdodDogMjRweDtcbiAgfVxuXG4gIC5jYXJkLWNvbnRhaW5lciAuY2FyZDpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDA7XG4gIH1cblxuICAuY2FyZC5jYXJkLXNtYWxsIHtcbiAgICBoZWlnaHQ6IDE2cHg7XG4gICAgd2lkdGg6IDE2OHB4O1xuICB9XG5cbiAgLmNhcmQtY29udGFpbmVyIC5jYXJkOm5vdCguaGlnaGxpZ2h0LWNhcmQpIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIH1cblxuICAuY2FyZC1jb250YWluZXIgLmNhcmQ6bm90KC5oaWdobGlnaHQtY2FyZCk6aG92ZXIge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtM3B4KTtcbiAgICBib3gtc2hhZG93OiAwIDRweCAxN3B4IHJnYmEoMCwgMCwgMCwgMC4zNSk7XG4gIH1cblxuICAuY2FyZC1jb250YWluZXIgLmNhcmQ6bm90KC5oaWdobGlnaHQtY2FyZCk6aG92ZXIgLm1hdGVyaWFsLWljb25zIHBhdGgge1xuICAgIGZpbGw6IHJnYigxMDUsIDEwMywgMTAzKTtcbiAgfVxuXG4gIC5jYXJkLmhpZ2hsaWdodC1jYXJkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTk3NmQyO1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICB3aWR0aDogYXV0bztcbiAgICBtaW4td2lkdGg6IDMwJTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIH1cblxuICAuY2FyZC5jYXJkLmhpZ2hsaWdodC1jYXJkIHNwYW4ge1xuICAgIG1hcmdpbi1sZWZ0OiA2MHB4O1xuICB9XG5cbiAgc3ZnI3JvY2tldCB7XG4gICAgd2lkdGg6IDgwcHg7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IC0xMHB4O1xuICAgIHRvcDogLTI0cHg7XG4gIH1cblxuICBzdmcjcm9ja2V0LXNtb2tlIHtcbiAgICBoZWlnaHQ6IGNhbGMoMTAwdmggLSA5NXB4KTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiAxMHB4O1xuICAgIHJpZ2h0OiAxODBweDtcbiAgICB6LWluZGV4OiAtMTA7XG4gIH1cblxuICBhLFxuICBhOnZpc2l0ZWQsXG4gIGE6aG92ZXIge1xuICAgIGNvbG9yOiAjMTk3NmQyO1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgfVxuXG4gIGE6aG92ZXIge1xuICAgIGNvbG9yOiAjMTI1Njk5O1xuICB9XG5cbiAgLnRlcm1pbmFsIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgd2lkdGg6IDgwJTtcbiAgICBtYXgtd2lkdGg6IDYwMHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICBwYWRkaW5nLXRvcDogNDVweDtcbiAgICBtYXJnaW4tdG9wOiA4cHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMTUsIDE1LCAxNik7XG4gIH1cblxuICAudGVybWluYWw6OmJlZm9yZSB7XG4gICAgY29udGVudDogXCJcXDIwMjIgXFwyMDIyIFxcMjAyMlwiO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICBoZWlnaHQ6IDRweDtcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNTgsIDU4LCA1OCk7XG4gICAgY29sb3I6ICNjMmMzYzQ7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgZm9udC1zaXplOiAycmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAwO1xuICAgIHBhZGRpbmc6IDE0cHggMDtcbiAgICB0ZXh0LWluZGVudDogNHB4O1xuICB9XG5cbiAgLnRlcm1pbmFsIHByZSB7XG4gICAgZm9udC1mYW1pbHk6IFNGTW9uby1SZWd1bGFyLENvbnNvbGFzLExpYmVyYXRpb24gTW9ubyxNZW5sbyxtb25vc3BhY2U7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIHBhZGRpbmc6IDAgMXJlbSAxcmVtO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuXG4gIC5jaXJjbGUtbGluayB7XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIHdpZHRoOiA0MHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDQwcHg7XG4gICAgbWFyZ2luOiA4cHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI2VlZWVlZTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGJveC1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMTIpLCAwIDFweCAycHggcmdiYSgwLCAwLCAwLCAwLjI0KTtcbiAgICB0cmFuc2l0aW9uOiAxcyBlYXNlLW91dDtcbiAgfVxuXG4gIC5jaXJjbGUtbGluazpob3ZlciB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0wLjI1cmVtKTtcbiAgICBib3gtc2hhZG93OiAwcHggM3B4IDE1cHggcmdiYSgwLCAwLCAwLCAwLjIpO1xuICB9XG5cbiAgZm9vdGVyIHtcbiAgICBtYXJnaW4tdG9wOiA4cHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGxpbmUtaGVpZ2h0OiAyMHB4O1xuICB9XG5cbiAgZm9vdGVyIGEge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgfVxuXG4gIC5naXRodWItc3Rhci1iYWRnZSB7XG4gICAgY29sb3I6ICMyNDI5MmU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBwYWRkaW5nOiAzcHggMTBweDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI3LDMxLDM1LC4yKTtcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KC0xODBkZWcsI2ZhZmJmYywjZWZmM2Y2IDkwJSk7XG4gICAgbWFyZ2luLWxlZnQ6IDRweDtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxTZWdvZSBVSSxIZWx2ZXRpY2EsQXJpYWwsc2Fucy1zZXJpZixBcHBsZSBDb2xvciBFbW9qaSxTZWdvZSBVSSBFbW9qaSxTZWdvZSBVSSBTeW1ib2w7XG4gIH1cblxuICAuZ2l0aHViLXN0YXItYmFkZ2U6aG92ZXIge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgtMTgwZGVnLCNmMGYzZjYsI2U2ZWJmMSA5MCUpO1xuICAgIGJvcmRlci1jb2xvcjogcmdiYSgyNywzMSwzNSwuMzUpO1xuICAgIGJhY2tncm91bmQtcG9zaXRpb246IC0uNWVtO1xuICB9XG5cbiAgLmdpdGh1Yi1zdGFyLWJhZGdlIC5tYXRlcmlhbC1pY29ucyB7XG4gICAgaGVpZ2h0OiAxNnB4O1xuICAgIHdpZHRoOiAxNnB4O1xuICAgIG1hcmdpbi1yaWdodDogNHB4O1xuICB9XG5cbiAgc3ZnI2Nsb3VkcyB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGJvdHRvbTogLTE2MHB4O1xuICAgIGxlZnQ6IC0yMzBweDtcbiAgICB6LWluZGV4OiAtMTA7XG4gICAgd2lkdGg6IDE5MjBweDtcbiAgfVxuXG5cbiAgLyogUmVzcG9uc2l2ZSBTdHlsZXMgKi9cbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzY3cHgpIHtcblxuICAgIC5jYXJkLWNvbnRhaW5lciA+ICo6bm90KC5jaXJjbGUtbGluaykgLFxuICAgIC50ZXJtaW5hbCB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAuY2FyZDpub3QoLmhpZ2hsaWdodC1jYXJkKSB7XG4gICAgICBoZWlnaHQ6IDE2cHg7XG4gICAgICBtYXJnaW46IDhweCAwO1xuICAgIH1cblxuICAgIC5jYXJkLmhpZ2hsaWdodC1jYXJkIHNwYW4ge1xuICAgICAgbWFyZ2luLWxlZnQ6IDcycHg7XG4gICAgfVxuXG4gICAgc3ZnI3JvY2tldC1zbW9rZSB7XG4gICAgICByaWdodDogMTIwcHg7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgtNWRlZyk7XG4gICAgfVxuICB9XG5cbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTc1cHgpIHtcbiAgICBzdmcjcm9ja2V0LXNtb2tlIHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gICAgfVxuICB9XG5cbi5uYXYtc3ViLXRpdGxle1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBtYXJnaW4tbGVmdDogMjBweDtcbiAgICBtYXJnaW4tcmlnaHQ6IDIwcHg7XG59XG5cbmZvb3RlcntcbiAgICBib3R0b206IDA7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHdpZHRoOiAxMDAlO1xufVxuXG4uZm9vdGVye1xuICAgIGhlaWdodDogMzBweDtcbiAgICBtYXJnaW46IGF1dG87XG4gICAgd2lkdGg6IDQwMHB4O1xuICAgIHRleHQtYWxpZ246Y2VudGVyO1xuICAgIHBhZGRpbmc6MTBweDtcbn1cbiJdfQ== */"] });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _clr_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @clr/angular */ "8MG2");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _circular_chart_circular_chart_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./circular-chart/circular-chart.component */ "e3b4");
/* harmony import */ var _map_chart_map_chart_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./map-chart/map-chart.component */ "DR3Z");
/* harmony import */ var _bar_chart_bar_chart_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./bar-chart/bar-chart.component */ "k7d8");
/* harmony import */ var _description_description_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./description/description.component */ "z1Xl");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ "fXoL");










class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_8__["HttpClientModule"],
            _clr_angular__WEBPACK_IMPORTED_MODULE_1__["ClarityModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
        _circular_chart_circular_chart_component__WEBPACK_IMPORTED_MODULE_4__["CircularChartComponent"],
        _map_chart_map_chart_component__WEBPACK_IMPORTED_MODULE_5__["MapChartComponent"],
        _bar_chart_bar_chart_component__WEBPACK_IMPORTED_MODULE_6__["BarChartComponent"],
        _description_description_component__WEBPACK_IMPORTED_MODULE_7__["DescriptionComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_2__["AppRoutingModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_8__["HttpClientModule"],
        _clr_angular__WEBPACK_IMPORTED_MODULE_1__["ClarityModule"]] }); })();


/***/ }),

/***/ "e3b4":
/*!************************************************************!*\
  !*** ./src/app/circular-chart/circular-chart.component.ts ***!
  \************************************************************/
/*! exports provided: CircularChartComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CircularChartComponent", function() { return CircularChartComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class CircularChartComponent {
    constructor() { }
    ngOnInit() {
    }
}
CircularChartComponent.ɵfac = function CircularChartComponent_Factory(t) { return new (t || CircularChartComponent)(); };
CircularChartComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: CircularChartComponent, selectors: [["app-circular-chart"]], decls: 2, vars: 0, template: function CircularChartComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "circular-chart works!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJjaXJjdWxhci1jaGFydC5jb21wb25lbnQuY3NzIn0= */"] });


/***/ }),

/***/ "gG+F":
/*!**********************************!*\
  !*** ./src/app/shared/models.ts ***!
  \**********************************/
/*! exports provided: DailyData, StateData, MapSingleDayData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DailyData", function() { return DailyData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StateData", function() { return StateData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapSingleDayData", function() { return MapSingleDayData; });
class DailyData {
    constructor() {
        this.date = "";
        this.state = "";
        this.death = 0;
        this.deathConfirmed = 0;
        this.deathIncrease = 0;
        this.deathProbable = 0;
        this.hospitalized = 0;
        this.hospitalizedCumulative = 0;
        this.hospitalizedCurrently = 0;
        this.hospitalizedIncrease = 0;
        this.inIcuCumulative = 0;
        this.inIcuCurrently = 0;
        this.negative = 0;
        this.negativeIncrease = 0;
        this.negativeTestsAntibody = 0;
        this.negativeTestsPeopleAntibody = 0;
        this.negativeTestsViral = 0;
        this.onVentilatorCumulative = 0;
        this.onVentilatorCurrently = 0;
        this.positive = 0;
        this.positiveCasesViral = 0;
        this.positiveIncrease = 0;
        this.positiveScore = 0;
        this.positiveTestsAntibody = 0;
        this.positiveTestsAntigen = 0;
        this.positiveTestsPeopleAntibody = 0;
        this.positiveTestsPeopleAntigen = 0;
        this.positiveTestsViral = 0;
        this.recovered = 0;
        this.totalTestEncountersViral = 0;
        this.totalTestEncountersViralIncrease = 0;
        this.totalTestResults = 0;
        this.totalTestResultsIncrease = 0;
        this.totalTestsAntibody = 0;
        this.totalTestsAntigen = 0;
        this.totalTestsPeopleAntibody = 0;
        this.totalTestsPeopleAntigen = 0;
        this.totalTestsPeopleViral = 0;
        this.totalTestsPeopleViralIncrease = 0;
        this.totalTestsViral = 0;
        this.totalTestsViralIncrease = 0;
    }
}
class StateData {
    constructor() {
        this.state = "";
        this.fullStateName = "";
        this.daily = [];
    }
}
class MapSingleDayData {
    constructor() {
        this.state = "";
        this.fullStateName = "";
        this.positive = 0;
        this.recovered = 0;
    }
}


/***/ }),

/***/ "k7d8":
/*!**************************************************!*\
  !*** ./src/app/bar-chart/bar-chart.component.ts ***!
  \**************************************************/
/*! exports provided: BarChartComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BarChartComponent", function() { return BarChartComponent; });
/* harmony import */ var _assets_data_state_name_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../assets/data/state_name.json */ "3ye2");
var _assets_data_state_name_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../assets/data/state_name.json */ "3ye2", 1);
/* harmony import */ var _shared_models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/models */ "gG+F");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "tk/3");




class BarChartComponent {
    constructor(http) {
        this.http = http;
        this.myStates = _assets_data_state_name_json__WEBPACK_IMPORTED_MODULE_0__;
        this.loadAllFilePromises = [];
        this.minVal = 0;
        this.maxVal = 0;
        this.allStatesData = [];
        this.BarChartData = null;
        this.currentDate = "";
        this.minDate = "2020-03-04";
        this.maxDate = "2021-02-22";
        // currentStateData: BarChartSingleDayData[] = [];
        this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    }
    ngOnInit() {
        this.loadAllData();
    }
    loadAllData() {
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
    readFile(filePath, stateName, fullStateName) {
        return new Promise((resolve, reject) => {
            this.http.get(filePath, { responseType: 'json' })
                .subscribe(data => {
                let currentStateData = new _shared_models__WEBPACK_IMPORTED_MODULE_1__["StateData"]();
                // loop through each day's data of a state to combine as a summarized data set
                Object.entries(data).forEach(([key, value]) => {
                    // console.log("check key value", key, value)
                    let daily = Object.assign(new _shared_models__WEBPACK_IMPORTED_MODULE_1__["DailyData"](), value);
                    // this.minVal = daily.positive < this.minVal ? daily.positive : this.minVal;
                    this.maxVal = daily.positive > this.maxVal ? daily.positive : this.maxVal;
                    currentStateData.daily.push(daily);
                });
                currentStateData.state = stateName;
                currentStateData.fullStateName = fullStateName;
                this.allStatesData.push(currentStateData);
                // console.log("check json", currentStateData);
                resolve(currentStateData);
            }, error => {
                reject(error);
                console.log("error when read file", error);
            });
        });
    }
}
BarChartComponent.ɵfac = function BarChartComponent_Factory(t) { return new (t || BarChartComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"])); };
BarChartComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({ type: BarChartComponent, selectors: [["app-bar-chart"]], decls: 7, vars: 1, consts: [[1, "main-container"], [1, "sub-page-title"], ["id", "graph"]], template: function BarChartComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "h4");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "US Covid-19 BarChart");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](6, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("Current Date: ", ctx.currentDate, "");
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJiYXItY2hhcnQuY29tcG9uZW50LmNzcyJ9 */"] });


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _bar_chart_bar_chart_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bar-chart/bar-chart.component */ "k7d8");
/* harmony import */ var _map_chart_map_chart_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map-chart/map-chart.component */ "DR3Z");
/* harmony import */ var _circular_chart_circular_chart_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./circular-chart/circular-chart.component */ "e3b4");
/* harmony import */ var _description_description_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./description/description.component */ "z1Xl");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");







const routes = [
    { path: 'home', component: _description_description_component__WEBPACK_IMPORTED_MODULE_4__["DescriptionComponent"] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'map', component: _map_chart_map_chart_component__WEBPACK_IMPORTED_MODULE_2__["MapChartComponent"] },
    { path: 'bar', component: _bar_chart_bar_chart_component__WEBPACK_IMPORTED_MODULE_1__["BarChartComponent"] },
    { path: 'circular', component: _circular_chart_circular_chart_component__WEBPACK_IMPORTED_MODULE_3__["CircularChartComponent"] }
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "z1Xl":
/*!******************************************************!*\
  !*** ./src/app/description/description.component.ts ***!
  \******************************************************/
/*! exports provided: DescriptionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DescriptionComponent", function() { return DescriptionComponent; });
/* harmony import */ var _assets_data_state_name_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../assets/data/state_name.json */ "3ye2");
var _assets_data_state_name_json__WEBPACK_IMPORTED_MODULE_0___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../../assets/data/state_name.json */ "3ye2", 1);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");



class DescriptionComponent {
    constructor(http) {
        this.http = http;
        this.myStates = _assets_data_state_name_json__WEBPACK_IMPORTED_MODULE_0__;
        this.fileReader = new FileReader();
        this.allStates = [];
    }
    ngOnInit() {
    }
    processData() {
        Object.entries(this.myStates).forEach(([key, value]) => {
            console.log("check", key, value);
            let fileName = key + '.csv';
            let filePath = 'assets/data/history/csv/' + fileName;
            this.readFile(filePath);
        });
    }
    readFile(filePath) {
        this.http.get(filePath, { responseType: 'text' })
            .subscribe(data => {
            // this.csvToJson(data);
            console.log("check csv", data);
        }, error => {
            console.log(error);
        });
    }
}
DescriptionComponent.ɵfac = function DescriptionComponent_Factory(t) { return new (t || DescriptionComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"])); };
DescriptionComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: DescriptionComponent, selectors: [["app-description"]], decls: 21, vars: 0, consts: [[1, "sub-page-title"], [1, "main-content"], ["href", "https://covidtracking.com/"], ["href", "https://www.linkedin.com/in/shu-han/"]], template: function DescriptionComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h4", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Description");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "ul");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "This is a course project at University of Victoria, BC, Canada.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "The specific course is CSC 511 - Information Visualization, Instructor: Dr. Charles Perin");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "The author of this website is actively attending this course during Jan 2021 to April 2021, and this is the final course project.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "The purpose of this project is trying to get a better understanding the Visualization design metrics. And it will apply the public data from ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "https://covidtracking.com/");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, " to build several charts to demonstrate the course spirit.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "This project starts on Feb 23, 2021, and will be finished before April 12, 2021.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Author LinkedIn: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "https://www.linkedin.com/in/shu-han/");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } }, styles: [".sub-page-title[_ngcontent-%COMP%]{\n    text-align: center;\n    font-size: x-large;\n    margin-bottom: 50px;\n}\n\n.main-content[_ngcontent-%COMP%]{\n    padding-left: 10%;\n    padding-right: 10%;\n    font-family: Arial, Helvetica, sans-serif;\n    font-size: large;\n}\n\nli[_ngcontent-%COMP%]{\n    margin-bottom: 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlc2NyaXB0aW9uLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxrQkFBa0I7SUFDbEIsa0JBQWtCO0lBQ2xCLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLGlCQUFpQjtJQUNqQixrQkFBa0I7SUFDbEIseUNBQXlDO0lBQ3pDLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLG1CQUFtQjtBQUN2QiIsImZpbGUiOiJkZXNjcmlwdGlvbi5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnN1Yi1wYWdlLXRpdGxle1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBmb250LXNpemU6IHgtbGFyZ2U7XG4gICAgbWFyZ2luLWJvdHRvbTogNTBweDtcbn1cblxuLm1haW4tY29udGVudHtcbiAgICBwYWRkaW5nLWxlZnQ6IDEwJTtcbiAgICBwYWRkaW5nLXJpZ2h0OiAxMCU7XG4gICAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XG4gICAgZm9udC1zaXplOiBsYXJnZTtcbn1cblxubGl7XG4gICAgbWFyZ2luLWJvdHRvbTogMTBweDtcbn0iXX0= */"] });


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map