import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Location } from '@angular/common';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.page.html',
  styleUrls: ['./secciones.page.scss'],
})
export class SeccionesPage implements OnInit, OnDestroy {
  seleccion: string = '';
  listado: string = '';
  usuario: string = '';
  sub?: Subscription;

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
      quality: 50,
      allowEditing: false,
      resultType: CameraResultType.Base64, // Puedes usar DataUrl si prefieres
      source: CameraSource.Camera,
    });

    console.log(image);

    if (image && image.base64String) {
      const base64Image = 'data:image/jpeg;base64,' + image.base64String; // Añade el prefix para imágenes JPEG
      const base64Length = base64Image.length;
      const sizeInBytes = (base64Length * 3) / 4 - 2;

      if (sizeInBytes > 1048487) {
        console.error('La imagen es demasiado grande para Firestore');
      } else {
        // Guardar en Firebase si el tamaño es correcto
        this.subirFoto(base64Image);
      }
    }
  }

  subirFoto(base64String: string) {
    console.log(base64String);
    let col = collection(this.firestore, 'capturayvota');
    addDoc(col, {
      seleccion: this.seleccion,
      usuario: this.usuario,
      fecha: new Date(),
      foto: base64String,
      votos: 0,
    });
  }

  mostrarFotos() {
    this.listado = 'listadoGeneral';
    this.router.navigate(['/listados', this.listado], {
      queryParams: { seleccion: this.seleccion, tipoListado: this.listado },
    });
  }

  mostrarFotosPropias() {
    this.listado = 'listadoPropio';
    this.router.navigate(['/listados', this.listado], {
      queryParams: { seleccion: this.seleccion, tipoListado: this.listado },
    });
  }

  verEstadisticas() {
    this.router.navigate(['/estadisticas'], {
      queryParams: { seleccion: this.seleccion},
    });
  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
