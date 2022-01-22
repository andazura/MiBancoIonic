import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { cuenta } from '../interfaces/cuenta.interface';


@Injectable({
  providedIn: 'root'
})
export class BancoService {

  constructor(private http:HttpClient) { }
  
  /**
   * Metodo que realiza por api logueo de usuarios
   * @param email Usuario ingresado para logueo
   * @param password  contraseña ingresado para logueo
   * @returns Observavle
   */
  LoginFirebase(email,password){

    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAkBp1poo3Fx9BHfvVTFxiqrWXJIlDBRm8`,
    {
      email,
      password,
      returnSecureToken:true
    });
  }
  /**
   * Funcion que realiza llamado a backend para crear codigos qr de nuestras cuentas
   * @param cuenta 
   * @returns 
   */
  crearCodigoQr(cuenta){ 
    return this.http.post(`https://charoladmin.com.co/qr.php`,{cuenta});
  }
}
