import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SourceVideo } from './source-video';

@Injectable({
  providedIn: 'root'
})
export class VideoFileService {

  sourceVideo: SourceVideo;
  sourceVideoSubj: BehaviorSubject <SourceVideo> = new BehaviorSubject<SourceVideo>(null);

  constructor() { }

  getSource() {
    return this.sourceVideo;
  }

  setSource(sourceVideo: { content: any; type: any; }) {
    this.sourceVideo = {
      src: sourceVideo.content,
      file: new File([this.dataURLtoU8arr(sourceVideo.content)], name, { type: sourceVideo.type }),
      type: sourceVideo.type
    };
    this.sourceVideoSubj.next(this.sourceVideo);
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
