import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { AppSettings } from '../../../../AppConstants'
import { ProfilesService } from '../../../profiles/profiles.service';

@Component({
    selector: 'ngx-main-chartjs-pie',
    template: `
    <chart type="pie" [data]="data" [options]="options"></chart>
  `,
})
export class MainChartjsPieComponent implements OnDestroy, OnInit {
    data: any;
    options: any;
    themeSubscription: any;
    loading: boolean;

    constructor(private theme: NbThemeService, private profileService: ProfilesService) {
    }

    ngOnInit() {

        this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;

            let pending = 0;
            let confirmed = 0;
            let screened = 0;
            let expired = 0;

            this.loading = true;

            this.profileService.getAllProfiles().subscribe((response: any) => {
                // const outData = response.map((eachOrder)=>{
                //   const formData = { referenceId: eachOrder.referenceId,
                //     customerEmail: eachOrder.user.email,
                //     orderDate: eachOrder.createdAt,
                //     expectedDeliveryDate: eachOrder.expectedDeliveryDate,
                //     status: eachOrder.status
                //   }
                //   return formData
                // });  
                console.log(response);
                const mappedResult = response.map(element => {
                    const profileData = {
                        profileId: element.id,
                        status: element.status,
                        // itemsTotalPrice : element.itemizeds.map((obj)=>{ return obj.quantity*obj.salesPrice}).reduce((x, y) => x + y),
                        // itemsTotalQuantity: element.itemizeds.map((obj)=>{ return obj.quantity}).reduce((x, y) => x + y),
                    }
                    return profileData;
                });

                // const mappedResult = response.map(element => {
                //     const orderData = {
                //       orderId: element.id,
                //       status : element.status,
                //       itemsTotalPrice : element.itemizeds.map((obj)=>{ return obj.quantity*obj.salesPrice}).reduce((x, y) => x + y),
                //       itemsTotalQuantity: element.itemizeds.map((obj)=>{ return obj.quantity}).reduce((x, y) => x + y),
                //     }
                //     return orderData;
                // });

                mappedResult.forEach(element => {
                    if (element.status === "Confirmed") {
                        confirmed++;
                    }
                    else if (element.status === "Pending") {
                        pending++;
                    }
                    else if (element.status === "Screened") {
                        screened++;
                    }
                    else if (element.status === "Expired") {
                        expired++;
                    }
                });



                this.data = {
                    labels: AppSettings.status.map((status) => { return status.title }),
                    datasets: [{
                        data: [confirmed, pending, screened, expired],
                        backgroundColor: ['#00dccc', colors.primaryLight, colors.infoLight, '#FF0000'/*, '#444', '#FF0000'*/],
                    }],
                };

                this.options = {
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        xAxes: [
                            {
                                display: false,
                            },
                        ],
                        yAxes: [
                            {
                                display: false,
                            },
                        ],
                    },
                    legend: {
                        labels: {
                            fontColor: chartjs.textColor,
                        },
                    },
                };

                this.loading = false;
            });

        });

    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}
