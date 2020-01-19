import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { VideoObj } from '../video-obj';
import { VideoFileService } from '../video-file.service';
import { VideoWorkService } from '../video-work.service';

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
  keyFrames = [];
  constructor(
    private videoFileService: VideoFileService,
    private videoWorkService: VideoWorkService,
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
    this.videoFileService.targetVideoSubj.subscribe(f => {
      this.targetVideo = f;
    })
    this.videoWorkService.getFileInfo(this.sourceVideo).then(fileinfo => {
      this.videoWorkService.getKeyFrames(this.sourceVideo).then(res => {
        this.keyFrames = res;
      });
    });
    this.fileUploaded = true;
    // console.log(this._elSourceVideo)
  }

}
