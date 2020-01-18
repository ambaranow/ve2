import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoFileService } from './video-file.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class VideoWorkService {

  worker;
  isInited = false;
  progress: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  message: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  id = (new Date()).getTime();

  constructor(
    private sanitizer: DomSanitizer,
    private videoFileService: VideoFileService,
  ) { }


  async init() {
    const { createWorker } = window['FFmpeg'];
    this.worker = createWorker({
      corePath: '/assets/ffmpeg-core.js',
      logger: (res) => {
        // console.log(res);
        // if (res.message && !res.type || res.type !== 'stderr') {
        //   // console.log(res.message);
        //   // this.mess += res.message + '\n';
        this.message.next(res);
        // }
      },
      progress: p => {
        const prgrs = (!p || p.ratio < 0 || p.ratio > 1) ? -1 : p.ratio;
        this.progress.next(Math.round(prgrs * 100));
        console.log(p)
        console.log(prgrs)
      },
    });
    this.isInited = true;
    await this.worker.load();
  }

  async getKeyFrames(f) {
    if (!this.isInited) {
      await this.init();
    }
    await this.worker.write(f.file.name, f.file);
    await this.worker.run('-i ' + f.file.name + ' -loglevel info -stats -f image2 -vf fps=1,showinfo -an out_%d.jpeg');
    const filemask = /out_\d*\.jpeg/;
    const { data } = await this.worker.ls('.');
    const keyFrames = [];
    for (const path of data) {
      if (filemask.test(path)) {
        const imageFile = await this.worker.read(path);
        const type = 'image/jpeg';
        // this.keyFrames.push({
        //   file: new File([file.data], path, { type }),
        //   src: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob([file.data], { type })))
        // });
        keyFrames.push(
          this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(
              new Blob([imageFile.data], { type })
            )
          )
        );
      }
    }
    return keyFrames;
  }


  async getFileInfo(f) {
    const outputFileName = this.getTargetFileName(f.file.name);
    if (!this.isInited) {
      await this.init();
    }
    await this.worker.write(f.file.name, f.file);
    const messSubscriber = this.message.subscribe(res => {
      if (res) {
        console.log(res.message);
      }
    });
    // await this.worker.run('--help');
    // await this.worker.run('-i ' + f.file.name + ' -hide_banner -c copy -f null -');
    await this.worker.run('-i ' + f.file.name + ' -hide_banner -loglevel quiet -stats -c copy ' + outputFileName);

    const {data} = await this.worker.read(outputFileName);
    const targetFile = {
      data,
      type: f.file.type,
      name: outputFileName
    }
    this.videoFileService.setTarget(targetFile);
    messSubscriber.unsubscribe();
  }

  getTargetFileName(n) {
    const extensionRegExp = /\.([0-9a-z]{1,5})$/i;
    const extension = n.match(extensionRegExp)[1];
    return 'v_' + this.id + '.' + extension.toLowerCase();
  }
}
