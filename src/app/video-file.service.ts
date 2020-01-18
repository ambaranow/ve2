import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoObj } from './video-obj';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class VideoFileService {

  sourceVideo: VideoObj;
  sourceVideoSubj: BehaviorSubject<VideoObj> = new BehaviorSubject<VideoObj>(null);
  targetVideo: VideoObj;
  targetVideoSubj: BehaviorSubject<VideoObj> = new BehaviorSubject<VideoObj>(null);

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  getSource() {
    return this.sourceVideo;
  }

  setSource(sourceVideo: { content: any; type: any; }) {
    this.sourceVideo = {
      src: this.sanitizer.bypassSecurityTrustUrl(sourceVideo.content),
      file: new File([this.dataURLtoU8arr(sourceVideo.content)], name, { type: sourceVideo.type }),
      type: sourceVideo.type
    };
    this.sourceVideoSubj.next(this.sourceVideo);
  }

  setTarget(targetVideo: { data: any; type: any; }) {
    this.targetVideo = {
      src: this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(
          new Blob([targetVideo.data.data], { type: targetVideo.type })
        )
      ),
      file: new File([targetVideo.data], name, { type: targetVideo.type }),
      type: targetVideo.type
    };
    this.targetVideoSubj.next(this.targetVideo);
    this.targetVideoSubj.next(this.targetVideo);
  }

  dataURLtoU8arr(dataurl) {
    const arr = dataurl.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return u8arr;
  }

}
