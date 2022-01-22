import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BancoService } from '../../services/banco.service';
import { ToastController } from '@ionic/angular';
import { DataLocalService } from '../../services/data-local.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

 
  constructor(private service:BancoService, private toast:ToastController, private datalocal:DataLocalService) { }

  ngOnInit() {
    
  }
  /**
   * Funcion que reliza validacion de usuario para ingreso a la app
   * @param fLogin 
   */
  login( fLogin: NgForm ) {
    let message = '';
    if(fLogin.status == "VALID"){
      this.service.LoginFirebase(fLogin.form.value.email,fLogin.form.value.password).subscribe(
        (res)=>{
          this.datalocal.guardarSesion(res);
        },err =>{
          message = 'Usuario y/o contraseña invalidos';
          this.alerta( message );
        }
      )
    }else{
      message = 'Ingrese usuario y contraseña';
      this.alerta( message );
    }

    
  }
  /**
   * Funcion que muestra alerta estado de logueo
   * @param message 
   */
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
