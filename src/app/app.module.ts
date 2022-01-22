import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SwiperModule } from 'swiper/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { File } from '@ionic-native/file/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SwiperModule,
    FormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },File,BarcodeScanner],
  bootstrap: [AppComponent],
})
export class AppModule { }
