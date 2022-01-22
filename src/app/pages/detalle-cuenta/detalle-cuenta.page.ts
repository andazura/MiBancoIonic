import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';


declare var particlesJS:any;
@Component({
  selector: 'app-detalle-cuenta',
  templateUrl: './detalle-cuenta.page.html',
  styleUrls: ['./detalle-cuenta.page.scss'],
})
export class DetalleCuentaPage implements OnInit {
  
  @Input() numero:string;
  constructor(public fireService:FirebaseService) {
    particlesJS.load("particles-js","../../../assets/particles.json",null)
   }
  
  async ngOnInit() {
    this.fireService.cargarMovimientos(this.numero).subscribe(
      (res) =>{
         particlesJS.load("particles-js","../../../assets/particles.json",null) 
      }
    )
  }
  /**
   * Funcion que renderiza las particulas sobre la pantalla
   */
  ionViewDidEnter(){
    particlesJS.load("particles-js","../../../assets/particles.json",null)  
  }

}
