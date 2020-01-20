import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoCropperComponent } from './video-cropper.component';
import { KeyframesLineModule } from '../keyframes-line/keyframes-line.module';
import { MatSliderModule } from '@angular/material';



@NgModule({
  declarations: [VideoCropperComponent],
  imports: [
    CommonModule,
    KeyframesLineModule,
    MatSliderModule,
  ],
  exports: [
    VideoCropperComponent,
  ]
})
export class VideoCropperModule { }
