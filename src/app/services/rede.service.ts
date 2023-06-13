import { Injectable } from '@angular/core';
import { Plugins, PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';

const {  } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class RedeService {
  networkStatus: typeof Network;
  networkListener: PluginListenerHandle;

constructor() {

}


async ngOnInit() {
  this.networkListener = Network.addListener('networkStatusChange', (status) => {
    this.networkStatus.getStatus();
    return this.networkStatus.getStatus();;

  });


}

async getcurrentStatus(){
 return this.networkStatus;
}

ngOnDestroy() {
  this.networkListener.remove();
}

}
