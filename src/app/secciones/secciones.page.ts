import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Location } from '@angular/common';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  orderBy,
  where,
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.page.html',
  styleUrls: ['./secciones.page.scss'],
})
export class SeccionesPage implements OnInit, OnDestroy {
  seleccion: string = '';
  usuario: string = '';
  sub?: Subscription

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.seleccion = this.route.snapshot.paramMap.get('seleccion') || '';
    this.sub = this.authService.userEmail.subscribe((respuesta: any) => {
      this.usuario = respuesta;
    });
  }

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64, // Puedes usar DataUrl si prefieres
      source: CameraSource.Camera
    });

    if (image && image.base64String) {
      this.subirFoto(image.base64String);
    }
  }

  subirFoto(base64String: string) {
    let col = collection(this.firestore, 'capturayvota');
    addDoc(col, {
      seleccion: this.seleccion,
      usuario: this.usuario,
      fecha: new Date(),
      foto: base64String,
      votos: 0
    });
  }

  mostrarFotos () {

  }

  mostrarFotosPropias () {

  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }

  ngOnDestroy () {
    this.sub?.unsubscribe();
  }
}