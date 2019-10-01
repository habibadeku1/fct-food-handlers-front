import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { OrdersChartComponent } from './charts/orders-chart.component';
import { ProfitChartComponent } from './charts/profit-chart.component';
import { OrdersChart } from '../../../@core/data/orders-chart';
import { ProfitChart } from '../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../@core/data/orders-profit-chart';
import { ProfilesService } from '../../profiles/profiles.service';

@Component({
  selector: 'ngx-ecommerce-charts',
  styleUrls: ['./charts-panel.component.scss'],
  templateUrl: './charts-panel.component.html',
})
export class ECommerceChartsPanelComponent implements OnDestroy, OnInit {

  private alive = true;

  chartPanelSummary: OrderProfitChartSummary[];
  period: string = 'week';
  ordersChartData: OrdersChart;
  profitChartData: ProfitChart;
  loading: boolean = false;

  @ViewChild('ordersChart') ordersChart: OrdersChartComponent;
  @ViewChild('profitChart') profitChart: ProfitChartComponent;
    confirmedStatus=[];
    pendingStatus=[];
    screenedStatus=[];
    expiredStatus=[];

  constructor(private ordersProfitChartService: OrdersProfitChartData, private profileService: ProfilesService) {
    // this.ordersProfitChartService.getOrderProfitChartSummary()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe((summary) => {
    //     this.chartPanelSummary = summary;
    //   });

    this.getOrdersChartData(this.period);
    this.getProfitChartData(this.period);
  }

  ngOnInit() {
      this.loading = true;
    this.profileService.mapAllProfiles().then( (data) => {
      data.subscribe( (mappedResult) => {
        // const mappedResult = response.map(element => {
        //   const orderData = {
        //     itemsTotalPrice: element.itemizeds.map((obj) => { return obj.quantity * obj.salesPrice }).reduce((x, y) => x + y),
        //     itemsTotalQuantity: element.itemizeds.map((obj) => { return obj.quantity }).reduce((x, y) => x + y),
        //   }
        //   return orderData;
        // });  

        // for(let i=0; i<=mappedResult.length; i++) {
        //     if(mappedResult.status === "Confirmed") {
        //        this.confirmedStatus.push(mappedResult[i]); 
        //     }
        //     else if(mappedResult.status === "Pending") {
        //        this.pendingStatus.push(mappedResult[i]); 
        //     }
        //     else if(mappedResult.status === "Screened") {
        //         this.screenedStatus.push(mappedResult[i]); 
        //     }
        //     else if(mappedResult.status === "Expired") {
        //         this.expiredStatus.push(mappedResult[i]); 
        //     }
        // }
        // console.log(this.confirmedStatus.length)

        const formSummary = [
          { title: "Total Food Handlers Confirmed", value: 1* mappedResult.map((obj)=>{ return obj.status === "Confirmed"}).reduce((x, y) => x + y) },
          { title: "Amount Received", value: 5000 * mappedResult.map((obj)=>{ return obj.status === "Confirmed"}).reduce((x, y) => x + y) },
          { title: "Total Other Statuses", value: mappedResult.map((obj)=>{ return obj.status === "Pending"}).reduce((x, y) => x + y)+mappedResult.map((obj)=>{ return obj.status === "Screened"}).reduce((x, y) => x + y)+mappedResult.map((obj)=>{ return obj.status === "Expired"}).reduce((x, y) => x + y) }
        ];
        this.chartPanelSummary = formSummary;
        this.loading = false;
      });
    });
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getOrdersChartData(value);
    this.getProfitChartData(value);
  }

  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Profit') {
      this.profitChart.resizeChart();
    } else {
      this.ordersChart.resizeChart();
    }
  }

  getOrdersChartData(period: string) {
    this.ordersProfitChartService.getOrdersChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        this.ordersChartData = ordersChartData;
      });
  }

  getProfitChartData(period: string) {
    this.ordersProfitChartService.getProfitChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(profitChartData => {
        this.profitChartData = profitChartData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
