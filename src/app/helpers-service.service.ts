import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersServiceService {

  constructor() { }

  /**
   * Convert time string to milliseconds number
   * @param a time(HH:MM:SS.mss)
   * @param b undefined
   */
  timeString2ms(a: any, b?: number) {
    return a = (typeof a === 'string') ? a.split('.') : a,
     b = a[1] * 1 || 0,
     a = a[0].split(':'),
     b + (a[2] ? a[0] * 3600 + a[1] * 60 + a[2] * 1 : a[1] ? a[0] * 60 + a[1] * 1 : a[0] * 1) * 1e3;
   }

   /**
    * Convert string pairs to object
    * @param mess a=b c=d ... y=z
    */
  parseMessageToJson(mess: string) {
    const matches = mess.match(/(\w*=)([^=]+)[\s|$]/gmi);
    const res = {};
    matches.forEach((pair: string) => {
      const kv = pair.split('=');
      res[kv[0]] = kv[1].trim();
    });
    return res;
  }

  getTargetFileName(n: string, id: string) {
    const extensionRegExp = /\.([0-9a-z]{1,5})$/i;
    const extension = n.match(extensionRegExp)[1];
    return 'v_' + id + '.' + extension.toLowerCase();
  }

  getFps(fileinfo) {
    console.log('getFps')
    console.log(fileinfo)
    let res = 1;
    // const durSeconds = Math.floor((fileinfo.durationMs || this.timeString2ms(fileinfo.time)) / 1000);
    const durSeconds = Math.floor(this.timeString2ms(fileinfo.time) / 1000);
    if (!isNaN(durSeconds)) {
      res = 1 / (durSeconds / 20);
      res = Math.floor(res * 100) / 100;
    }
    return res;
  }
}
