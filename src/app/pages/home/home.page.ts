import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { DataLocalService } from '../../services/data-local.service';
import { cuenta } from '../../interfaces/cuenta.interface';
import { ModalController } from '@ionic/angular';
import { DetalleCuentaPage } from '../detalle-cuenta/detalle-cuenta.page';
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { BancoService } from '../../services/banco.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  desplegar = true;  
  elemento:any;
  stylebackdrop = { "color":"blue"};
  constructor(public _fires:FirebaseService, public datalocal:DataLocalService,private mctrl:ModalController,
    private actionSheetController: ActionSheetController,private alertController:AlertController,
    private bservice:BancoService) {
  }
  async ngOnInit(){
    this.elemento = document.getElementById("cuentas");
    await this.datalocal.validarSesion();
    this.cargarCuentas();
  }
  /**
   * Funcion que mediante un servicio carga las cuentas del usuario en sesion
   * y crea nuestro codigo qr de nuestras cuentas
   */
  cargarCuentas(){
    this._fires.cargarCuentas(this.datalocal.user).subscribe(
      ()=>{
        setTimeout(()=>{
          this.elemento.scrollTop = this.elemento.scrollHeight;
        },20)
        this._fires.cuentas.forEach((val,i)=>{
          this.bservice.crearCodigoQr(val.propertyId).subscribe(
            (res) => {
              console.log(res)
            }
          );
        })
      }
    )
  }
  /**
   * Fucnion que crea una ventana modal para ver el detalle de movimineto
   * de nuestras cunetas
   * @param cuenta cuenta para ver los detalles
   * @returns Ventana modal
   */
  async verDetalle(cuenta:cuenta){
   const {numero} = cuenta;
    const modal = await this.mctrl.create(
      {
        component:DetalleCuentaPage,
        mode:"ios",
        breakpoints:[0.1, 0.5, 1],
        initialBreakpoint:0.5,
        swipeToClose:true,
        presentingElement: document.getElementById('ion-modal'),
        componentProps:{
          numero
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
  /**
   * Funcion que muestra ventana para editar alisas
   * @param cuenta cuenta a editar
   */
  editar(cuenta:cuenta){
    this.presentActionSheet(cuenta);
  }
  /**
   * Despliega menu con opciones predispuestas por cuenta
   * @param cuenta 
   */
  async presentActionSheet(cuenta:cuenta) {
    const actionSheet = await this.actionSheetController.create({
      header: `Editando cuenta ${cuenta.numero}`,
      backdropDismiss:false,
      buttons: [
      {
        text: 'Editar',
        icon: 'create-outline',
        handler: () => {
          this.alertInput(cuenta);
        }
      },
      {
        text: 'Cancel',
        icon: 'close-outline',
        role: 'cancel',
        cssClass: 'rojo',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  /**
   * Alerta con formulario para editar la cuenta
   * @param cuenta cuenta a editar
   */
   async alertInput(cuenta){
    const alert = await this.alertController.create({
      header: 'Crea un alias!',
      inputs: [
        {
          name: 'nuevo_nombre',
          type: 'text',
          placeholder: 'Alias de tu cuenta',
          cssClass: 'specialClass',
          attributes: {
            maxlength: 15,
            minLength: 4,
            inputMode: "string"
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Guardar!',
          handler: (data) => {
            const actuCuenta ={
              id:cuenta.propertyId,
              alias:data.nuevo_nombre
            }
            this._fires.actualizaAlias(actuCuenta)
          }
        }
      ]
    });
    await alert.present();
  }
}
