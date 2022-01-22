import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  private _storage: Storage | null = null;
  public user = '';
  constructor(private storage: Storage,private router:Router,private toast:ToastController) { 
    this.init();
  }
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    this._storage.set("config","");
  }
  /**
   * Realiza gurdado de session
   * @param data {session}
   */
  guardarSesion(data){
    let fechaExpira = new Date();
    fechaExpira.setSeconds(fechaExpira.getSeconds() + parseInt(data.expiresIn))
    data['fechaExpira'] = fechaExpira; 
    this._storage.set("config",data);
    this.user = data.email;
    this.router.navigate(['tabs']);
  }
  /**
   * Valida si la sesion aun se encuentra activa
   */
  async validarSesion(){
    const session = await this.storage.get("config");
    let tieneSession = false;
    if(session.fechaExpira){
      const vencida = Date.parse(session.fechaExpira);
      const fechaActual = new Date().valueOf();
      tieneSession = vencida > fechaActual;
    }else{
      tieneSession = false;
    }

    if(!tieneSession){
      this.alerta("Su sesion expiro");
      this.router.navigate(['login']);
      this._storage.set("config","");
    }else{
      this.user = session.email;
    }
  }

  async alerta( message:string ) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      color:"warning",
      icon: 'information-circle'
    });
    toast.present();
  }
}
