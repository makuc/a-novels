// imports.module.ts
import { NgModule } from '@angular/core';
import {
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatCheckboxModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatTableModule,
    MatTooltipModule
} from '@angular/material';

const pckgs = [
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatCheckboxModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatTableModule,
    MatTooltipModule
];

@NgModule({
    imports: pckgs,
    exports: pckgs
})
export class MaterialModule { }
