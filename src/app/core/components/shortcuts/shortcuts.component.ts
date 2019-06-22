import { Component, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShortcutsComponent {

  constructor(
    private bottomSheet: MatBottomSheet
  ) { }

  openShortcuts(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      ariaLabel: 'App settings for the Client',
      panelClass: 'tools-panel',
      disableClose: false
    });
  }

}
