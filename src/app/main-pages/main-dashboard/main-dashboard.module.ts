import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { MainDashboardComponent } from './main-dashboard.component';
import { ECommerceChartsPanelComponent } from './charts-panel/charts-panel.component';
import { OrdersChartComponent } from './charts-panel/charts/orders-chart.component';
import { ProfitChartComponent } from './charts-panel/charts/profit-chart.component';
import { ChartPanelHeaderComponent } from './charts-panel/chart-panel-header/chart-panel-header.component';
import { ChartPanelSummaryComponent } from './charts-panel/chart-panel-summary/chart-panel-summary.component';
import { ChartModule } from 'angular2-chartjs';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MainChartjsPieComponent } from './charts-panel/charts/main-chartjs-pie.component';

@NgModule({
  imports: [
    ThemeModule,
    ChartModule,
    NgxEchartsModule,
    NgxChartsModule,
    LeafletModule,
  ],
  declarations: [
    MainDashboardComponent,
    ECommerceChartsPanelComponent,
    ChartPanelHeaderComponent,
    ChartPanelSummaryComponent, 
    OrdersChartComponent,
    ProfitChartComponent,
    MainChartjsPieComponent
  ],
  providers: [
  ],
})
export class MainDashboardModule { }
