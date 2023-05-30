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
    console.log("Network status changed", status);
    this.networkStatus.getStatus();
    return this.networkStatus.getStatus();;

  });


}

async getcurrentStatus(){
 console.log("Chamou aqui\n");
 console.log("status dentro de rede ", this.networkStatus);
 return this.networkStatus;
}

ngOnDestroy() {
  this.networkListener.remove();
}

}
