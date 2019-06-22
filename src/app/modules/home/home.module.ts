import { MaterialModule } from './../../core/imports/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { SwipeTabComponent } from './components/swipe-tab/swipe-tab.component';
import { BtnSwitchComponent } from './components/btn-switch/btn-switch.component';
import { CarouselComponent } from './components/carousel/carousel.component';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule
  ],
  declarations: [
    HomeComponent,
    CarouselComponent,
    BtnSwitchComponent,
    SwipeTabComponent
  ]
})
export class HomeModule { }
