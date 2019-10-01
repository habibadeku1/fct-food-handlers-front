import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-general-dialog',
  templateUrl: 'general-dialog.component.html',
  styleUrls: ['general-dialog.component.scss'],
})
export class GeneralDialogComponent {

  @Input() title: string;

  constructor(protected ref: NbDialogRef<GeneralDialogComponent>) {}

  dismiss() {
    this.ref.close();
  }
}
