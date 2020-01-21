import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoFileService } from './video-file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HelpersService } from './helpers.service';
import { VideoObj } from './video-obj';

@Injectable({
  providedIn: 'root'
})
export class VideoWorkService {

  worker;
  isInited = false;
  progress: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  message: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  id = String((new Date()).getTime());
  fileInfoSubj: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private sanitizer: DomSanitizer,
    private videoFileService: VideoFileService,
    private helpersService: HelpersService,
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
        const prgrs = (!p || p.ratio < 0 || p.ratio > 1) ? 0 : p.ratio;
        this.progress.next(Math.round(prgrs * 10000) / 100);
        console.log(p)
        console.log(prgrs)
      },
    });
    this.isInited = true;
    await this.worker.load();
  }

  async getKeyFrames(f: VideoObj) {
    if (!this.isInited) {
      await this.init();
    }
    await this.worker.write(f.file.name, f.file);
    const fps = this.helpersService.getFps(this.videoFileService.getFileInfo()) || 1;
    // console.log('fps = ' + fps)
    // await this.worker.run('-i ' + f.file.name + ' -loglevel info -stats -f image2 -vf fps=' + fps + ',showinfo -an out_%d.jpeg');
    await this.worker.run('-i ' + f.file.name + ' -loglevel info -stats -f image2 -vf fps=fps=' + fps + ':round=near,showinfo -an out_%d.jpeg');
    const filemask = /out_\d*\.jpeg/;
    const lsData = await this.worker.ls('.');
    const keyFrames = [];
    // console.log(lsData)
    // console.log(typeof lsData.data)
    for (const path of lsData.data) {
      if (filemask.test(path)) {
        const imageFile = await this.worker.read(path);
        const type = 'image/jpeg';
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
    const outputFileName = this.helpersService.getTargetFileName(f.file.name, this.id);
    if (!this.isInited) {
      await this.init();
    }
    await this.worker.write(f.file.name, f.file);
    let result: any = {};
    const messSubscriber = this.message.subscribe(res => {
      if (res) {
        const resObj = this.helpersService.parseMessageToJson(res.message);
        result = {...result, ...resObj};
        if (result.time) {
          result.durationMs = this.helpersService.timeString2ms(result.time);
        }
        this.fileInfoSubj.next(result);
      }
    });
    // await this.worker.run('--help');
    // await this.worker.run('-i ' + f.file.name + ' -hide_banner -c copy -f null -');
    // await this.worker.run('-i ' + f.file.name + ' -hide_banner -loglevel quiet -stats -c copy ' + outputFileName);
    await this.worker.run('-i ' + f.file.name + ' -loglevel quiet -stats -c copy -y ' + outputFileName);
    const {data} = await this.worker.read(outputFileName);
    const targetFile = {
      data,
      type: f.file.type,
      name: outputFileName
    };
    this.videoFileService.setTarget(targetFile);
    messSubscriber.unsubscribe();
    return result;
  }


  async trim(params: {start: string, end: string}) {
    const start = (new Date()).getTime();
    // console.log(params)
    if (!this.isInited) {
      await this.init();
    }
    const inputFileName = this.videoFileService.sourceVideo.file.name;
    const outputFileName = this.videoFileService.targetVideo.file.name;
    const outputFileType = this.videoFileService.targetVideo.file.type;
    await this.worker.trim(
      inputFileName,
      outputFileName,
      params.start,
      params.end);
    const { data } = await this.worker.read(outputFileName);
    const targetFile = {
      data,
      type: outputFileType,
      name: outputFileName
    };
    this.videoFileService.setTarget(targetFile);
    const end = (new Date()).getTime();
    console.log('Duration = ' + this.helpersService.ms2TimeString(start - end));
  }
}
