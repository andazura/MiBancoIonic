import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { BancoService } from '../../services/banco.service';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from '../../services/firebase.service';
import { TransaccionPage } from '../transaccion/transaccion.page';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  desplegar='';
  constructor(private scanner:BarcodeScanner,
              private bservice:BancoService,
              public datalocal:DataLocalService,
              private mctrl:ModalController,
              public fire_:FirebaseService) {
   }

  async ngOnInit() {
    await this.datalocal.validarSesion();
    let getcuentas = await this.fire_.cargarCuentas(this.datalocal.user).subscribe(
      (r) =>{
        getcuentas.unsubscribe();
      }
    )
  }
  /**
   * Habilita el codigo qr de la cuenta seleccionada
   * @param numero numero de cuenta a mostrar
   * @returns 
   */
  verQr(numero){
    if(numero == this.desplegar){
      this.desplegar = '';
      return;
    }
    console.log(numero)
    this.desplegar = numero;
  }
  /**
   * Abre el scanner para escanear codigos y relizar transacciones
   */
  async scan(){
    await this.datalocal.validarSesion();
    if(this.datalocal.user){
      this.scanner.scan().then(barcodeData => {
        let getcuentas = this.fire_.cargarCuentas(this.datalocal.user).subscribe(
          (r) =>{
            this.verificaTransaccion(barcodeData.text)
            getcuentas.unsubscribe();
          }
        )
       }).catch(err => {
           console.log('Error', err);
       });
    }
  }
  /**
   * Recibe el url escaneado del codigo y vrefica que sea valida
   * para abrir ventana de transaccion
   * @param urlqr 
   */
  verificaTransaccion(urlqr){
    const url = urlqr.split("::");
    if(url[0] == "MiBanco"){
        this.modalTransaccion(url[1]);
    }
  }
 /**
  * Abre modal con transaccion a la cuenta escaneada
  * @param destino cuenta destino transaccion
  */ 
  async modalTransaccion(destino){
    const modal = await this.mctrl.create(
      {
        component:TransaccionPage,
        mode:"ios",
        breakpoints:[0.1, 0.5, 1],
        initialBreakpoint:0.5,
        swipeToClose:true,
        presentingElement: document.getElementById('ion-modal'),
        componentProps:{
          destino,
          cuentas:this.fire_.cuentas
        }
      }
    )

    modal.onDidDismiss().then(
      () =>{
        console.log("ee")
      }
    )

    console.log(modal)
    return await modal.present()
  }
}
