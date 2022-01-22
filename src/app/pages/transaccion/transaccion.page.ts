import { Component, Input, OnInit } from '@angular/core';
import { cuenta } from '../../interfaces/cuenta.interface';
import { NgForm } from '@angular/forms';
import { ToastController, ModalController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';

declare var particlesJS:any;
@Component({
  selector: 'app-transaccion',
  templateUrl: './transaccion.page.html',
  styleUrls: ['./transaccion.page.scss'],
})
export class TransaccionPage implements OnInit {

  @Input() destino:string = '';
  @Input() cuentas:cuenta[];
  constructor(private toast:ToastController,private fire_:FirebaseService,private mctrl:ModalController) { }

  ngOnInit() {
  }
  /**
   * Recibe informacion de la transaccion y revisa si se puede realizar
   * @param ftans NgForm Formulario transaccion
   * @returns 
   */
  generarTransaccion(ftans:NgForm){
    if(ftans.status == "VALID"){
        
     const cuenta = ftans.form.value.cuenta_orig;
     const valor = ftans.form.value.valor;
     if(parseFloat(cuenta.saldo) < parseFloat(valor)){
        this.alerta("Saldo insuficiente para realizar la transaccion","warning");
        return;
     }
      this.fire_.transaccion(this.destino,cuenta,valor);
      this.alerta("Transaccion exitosa","success");
      this.mctrl.dismiss();
    }
  }
  /**
   * Alerta estado transaccion
   * @param message mesaje de la alerta
   * @param color tipo de alerta
   */
  async alerta( message:string,color:string ) {
    const toast = await this.toast.create({
      message,
      duration: 2000,
      color,
      icon: 'information-circle'
    });
    toast.present();
  }
}
