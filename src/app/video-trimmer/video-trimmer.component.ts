import { Component, OnInit, Input } from '@angular/core';
import { VideoWorkService } from '../video-work.service';
import { HelpersServiceService } from '../helpers-service.service';

@Component({
  selector: 'app-video-trimmer',
  templateUrl: './video-trimmer.component.html',
  styleUrls: ['./video-trimmer.component.scss']
})
export class VideoTrimmerComponent implements OnInit {

  durationMs = 0;
  trim = {
    min: 0,
    max: 0
  };

  constructor(
    private videoWorkService: VideoWorkService,
    private helpersService: HelpersServiceService,
  ) { }

  @Input()
  fileInfo;

  @Input()
  keyFrames;

  ngOnInit() {
    this.videoWorkService.fileInfoSubj.subscribe(info => {
      if (info && info.durationMs) {
        this.durationMs = info.durationMs;
        this.trim.max = this.durationMs;
      }
    });
  }

}
