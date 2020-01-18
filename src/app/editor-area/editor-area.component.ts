import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VideoFileService } from '../video-file.service';
import { FormGroup, FormControl } from '@angular/forms';
import { VideoObj } from '../video-obj';

@Component({
  selector: 'app-editor-area',
  templateUrl: './editor-area.component.html',
  styleUrls: ['./editor-area.component.scss']
})
export class EditorAreaComponent implements OnInit {
  form: FormGroup;
  fileUploaded = false;
  sourceVideo: VideoObj;
  targetVideo: VideoObj;
  constructor(
    private videoFileService: VideoFileService,
  ) { }

  @ViewChild('elSourceVideo', {static: false})
  // получим прямой доступ к исходному видео
  private _elSourceVideo: ElementRef;

  ngOnInit() {
    this.generateForm();
  }

  generateForm() {
    this.form = new FormGroup({
      fileCtrl: new FormControl('')
    });
  }

  onFilePicked($event) {
    this.videoFileService.setSource($event);
    this.sourceVideo = this.videoFileService.getSource();
    this.targetVideo = this.videoFileService.getSource();
    this.fileUploaded = true;
  }

}
