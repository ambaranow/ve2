import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-video-cropper',
  templateUrl: './video-cropper.component.html',
  styleUrls: ['./video-cropper.component.scss']
})
export class VideoCropperComponent implements OnInit {

  cut = {
    min: 0,
    max: 0
  };
  value = {
    min: 0,
    max: 0
  };

  constructor() { }

  @Input()
  fileInfo;

  @Input()
  keyFrames;

  ngOnInit() {
    this.cut.max = this.fileInfo ? this.fileInfo.frame : 0;
    this.value = {
      min: 0,
      max: this.fileInfo ? this.fileInfo.frame : 0
    }
  }

}
