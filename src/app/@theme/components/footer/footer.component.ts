import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by"><b><a href="https://hybridfeeds.com" target="_blank">Hybrid Feeds Ltd</a></b> 2019</span>
  `,
})
export class FooterComponent {
}
