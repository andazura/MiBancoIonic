import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { cuenta } from '../interfaces/cuenta.interface';
import { map } from "rxjs/operators";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { File as f_ } from '@ionic-native/file/ngx';
import { movimiento } from '../interfaces/movimientos.interface';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  private itemsCollection: AngularFirestoreCollection<cuenta> | undefined;
  private movimientosCollection: AngularFirestoreCollection<movimiento> | undefined;
  public cuentas:cuenta[] = [];
  public movimientos:any[] = [];
  constructor(private afs: AngularFirestore, private _file:f_) {
   }
  /**
   * Consulto las cuentas asociadas al usuario logueado
   * @param usuraio usuario consultado
   * @returns Promise con resultado
   */
  cargarCuentas(usuraio:string){
    this.itemsCollection = this.afs.collection<cuenta>('cuentas', ref=>ref.where('usuario',"==",usuraio).limit(5));
    return this.itemsCollection.valueChanges({ idField: 'propertyId' }).pipe(
    map(
      (cuentas:cuenta[]) =>{
        this.cuentas = []
        for(let cuentatmp of cuentas){
           this.cuentas.unshift(cuentatmp);
        }
      }
    ))
  }
  /**
   * Carga movimientos de la cuenta
   * @param numero_cuenta cuenta a consultar
   * @returns 
   */
  cargarMovimientos(numero_cuenta:string){
    this.movimientosCollection = this.afs.collection<movimiento>('movimientos',
       ref =>
          ref.where("numero_cuenta","==",numero_cuenta).limit(5)
    );

    return this.movimientosCollection.valueChanges().pipe(
    map(
      (mov:movimiento[]) =>{
        this.movimientos = []
        for(let movimientostmp of mov){
          
           movimientostmp.fecha = new Date(movimientostmp.fecha["seconds"] * 1000).toISOString();
          this.movimientos.unshift(movimientostmp);
        }
      }
    ))
  }  
  /**
   * Realiza actualizacion en DB del alias de la cuenta
   * @param param0 
   */
  actualizaAlias({id,alias}){
    this.itemsCollection.doc(id).update({alias}).then(
      (res) =>{
        
      }
    )
  }
  /**
   * Actualiza en DB los saldos de las cuentas de la transaccion
   * @param cuentaDestino Cuenta destion transaccion
   * @param cuentaOrigen Cuenta origen transaccion
   * @param monto number cantidad transaccion
   */
  transaccion(cuentaDestino,cuentaOrigen:cuenta,monto:number){
    let getDestino = this.getCuentaDestino(cuentaDestino).subscribe(
      (cuenta:cuenta) =>{ 
        if(cuenta.saldo){
          cuenta.saldo+= monto;
          this.cuentas.forEach(c => {
              if(c.propertyId == cuentaOrigen.propertyId){
                this.actualizasaldo(c.propertyId,c.saldo-monto);
                this.actualizasaldo(cuenta.propertyId,cuenta.saldo);
                getDestino.unsubscribe();
                return true;
              }
              
          });
        }else{
          return false;
        }
      }
    )
  }
  /**
   * Actualiza saldo de la cuenta
   * @param id id cuenta actualizar
   * @param saldo nuevo saldo de la cuenta
   */
  actualizasaldo(id,saldo){
    this.itemsCollection.doc(id).update({saldo}).then(
      (res) =>{
        
      }
    )
  }
  /**
   * Obtengo los datos de la cuenta destion de transaccion
   * @param cuentaDestino id cuenta destino
   * @returns 
   */
  getCuentaDestino(cuentaDestino){
    const cuenta = this.afs.doc<cuenta>('cuentas/'+cuentaDestino);
    return  cuenta.valueChanges({ idField: 'propertyId' }).pipe(
      map(
        (cuenta:cuenta) =>{
          return cuenta
        }
      )
    )
  }
}
