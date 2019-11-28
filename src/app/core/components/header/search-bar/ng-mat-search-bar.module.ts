import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSearchBarComponent } from './mat-search-bar/mat-search-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  exports: [MatSearchBarComponent],
  declarations: [MatSearchBarComponent]
})
export class NgMatSearchBarModule {}
