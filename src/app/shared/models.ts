export class DailyData {
    public date: string = "";
    public state: string = "";
    public death: number = 0;
    public deathConfirmed: number = 0;
    public deathIncrease: number = 0;
    public deathProbable: number = 0;
    public hospitalized: number = 0;
    public hospitalizedCumulative: number = 0;
    public hospitalizedCurrently: number = 0;
    public hospitalizedIncrease: number = 0;
    public inIcuCumulative: number = 0;
    public inIcuCurrently: number = 0;
    public negative: number = 0;
    public negativeIncrease: number = 0;
    public negativeTestsAntibody: number = 0;
    public negativeTestsPeopleAntibody: number = 0;
    public negativeTestsViral: number = 0;
    public onVentilatorCumulative: number = 0;
    public onVentilatorCurrently: number = 0;
    public positive: number = 0;
    public positiveCasesViral: number = 0;
    public positiveIncrease: number = 0;
    public positiveScore: number = 0;
    public positiveTestsAntibody: number = 0;
    public positiveTestsAntigen: number = 0;
    public positiveTestsPeopleAntibody: number = 0;
    public positiveTestsPeopleAntigen: number = 0;
    public positiveTestsViral: number = 0;
    public recovered: number = 0;
    public totalTestEncountersViral: number = 0;
    public totalTestEncountersViralIncrease: number = 0;
    public totalTestResults: number = 0;
    public totalTestResultsIncrease: number = 0;
    public totalTestsAntibody: number = 0;
    public totalTestsAntigen: number = 0;
    public totalTestsPeopleAntibody: number = 0;
    public totalTestsPeopleAntigen: number = 0;
    public totalTestsPeopleViral: number = 0;
    public totalTestsPeopleViralIncrease: number = 0;
    public totalTestsViral: number = 0;
    public totalTestsViralIncrease: number = 0;
}

export class StateData{
    public state: string = "";
    public fullStateName: string = "";
    public daily: DailyData[] = [];
}

export class MapSingleDayData{
    public state: string = "";
    public fullStateName: string = "";
    public positive: number = 0;
    public recovered: number = 0;
}

export class BarChartSingleDayData{
    public state: string = "";
    public fullStateName: string = "";
    public death: number = 0;
    public recovered: number = 0;
    public hospitalized: number = 0;
}
