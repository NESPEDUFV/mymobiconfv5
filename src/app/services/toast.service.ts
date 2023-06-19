import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    constructor(private toastController: ToastController){}
    
    private async presentToast(message: string, color?: 'success' | 'danger' | 'warning', duration?: number) {
      const toast = await this.toastController.create({
        message: message,
        duration: duration ?? 3000,
        position: 'top',
        color: color,
        buttons: [
          {
            text: 'Fechar',
            role: 'cancel',
            icon: 'close'
          }
        ],
      });
      toast.present();
    }
    
    public showMessage(message: string, type?: 'success' | 'danger' | 'warning', duration?: number) {
      this.presentToast(message, type, duration);
    }   
}