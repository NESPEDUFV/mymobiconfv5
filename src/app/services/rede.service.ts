import { Injectable } from '@angular/core';
import { Plugins, NetworkStatus, PluginListenerHandle } from '@capacitor/core';

const { Network } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class RedeService {
  networkStatus: NetworkStatus;
  networkListener: PluginListenerHandle;

constructor() {

}

/*
async ngOnInit() {
  this.networkListener = Network.addListener('networkStatusChange', (status) => {
    console.log("Network status changed", status);
    this.networkStatus = status;
    return status;

  });

  this.networkStatus = await Network.getStatus();
}

async getcurrentStatus(){
 console.log("Chamou aqui\n");
 console.log("status dentro de rede ", this.networkStatus);
 return this.networkStatus;
}
ngOnDestroy() {
  this.networkListener.remove();
}
*/
}
