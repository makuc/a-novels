// imports.module.ts
import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,

    MatExpansionModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
} from '@angular/material';

const pckgs = [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,

    MatExpansionModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
];

@NgModule({
    declarations: [],
    imports: pckgs,
    exports: pckgs
})
export class MaterialModule { }
