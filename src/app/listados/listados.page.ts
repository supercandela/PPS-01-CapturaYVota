import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy,
  where,
  getDocs,
  updateDoc,
  doc,
  increment,
  addDoc
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listados',
  templateUrl: './listados.page.html',
  styleUrls: ['./listados.page.scss'],
})
export class ListadosPage implements OnInit {
  seleccion: string = '';
  tipoListado: string = '';
  sub?: Subscription;
  usuario: string = '';
  subFotos?: Subscription;
  fotos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private firestore: Firestore,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.sub = this.authService.userEmail.subscribe((respuesta: any) => {
      this.usuario = respuesta;
    });
    // Capturar parámetros desde queryParams
    this.route.queryParams.subscribe((params) => {
      this.seleccion = params['seleccion'] || '';
      this.tipoListado = params['tipoListado'] || '';
    });

    if (this.tipoListado === 'listadoGeneral') {
      this.subFotos = this.getAllFotos().subscribe((respuesta:any) => {
        this.fotos = respuesta.map((foto: any) => {
          const fecha = foto.fecha.toDate();
          
          // Obtener la fecha en formato DD/MM/YYYY
          const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
      
          // Obtener la hora en formato HH:MM
          const horaFormateada = fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Para formato de 24 horas
          });
      
          return {
            ...foto,
            fecha: `${fechaFormateada} ${horaFormateada}` // Combinar fecha y hora
          };
        });
      });
    } else {
      this.subFotos = this.getFotosPropias().subscribe((respuesta:any) => {
        this.fotos = respuesta.map((foto: any) => {
          const fecha = foto.fecha.toDate();
          
          // Obtener la fecha en formato DD/MM/YYYY
          const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
      
          // Obtener la hora en formato HH:MM
          const horaFormateada = fecha.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // Para formato de 24 horas
          });
      
          return {
            ...foto,
            fecha: `${fechaFormateada} ${horaFormateada}` // Combinar fecha y hora
          };
        });
      });
    }
  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }

  getAllFotos() {
    let col = collection(this.firestore, 'capturayvota');
    const filteredQuery = query(
      col,
      where('seleccion', '==', this.seleccion),
      orderBy('fecha', 'desc')
    );
    const observable = collectionData(filteredQuery, { idField: 'fotoId' });
    return observable;
  }

  getFotosPropias() {
    let col = collection(this.firestore, 'capturayvota');
    const filteredQuery = query(
      col,
      where('seleccion', '==', this.seleccion),
      where('usuario', '==', this.usuario), // Segundo where
      orderBy('fecha', 'desc')
    );
    const observable = collectionData(filteredQuery, { idField: 'fotoId' });
    return observable;
  }

  async votarFoto (fotoId: string) {
    console.log(fotoId);
    const votosRef = collection(this.firestore, 'votos'); // Crear referencia a la colección de votos
    const usuarioId = this.usuario; // ID o email del usuario actual
    
    // Verificar si el usuario ya votó por esta foto
    const q = query(votosRef, where('fotoId', '==', fotoId), where('usuarioId', '==', usuarioId));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      this.mostrarAlerta('¡Error!', 'Usted ya votó por esta foto');
    } else {
      // Si no ha votado, incrementar el voto y guardar en la colección 'votos'
      await updateDoc(doc(this.firestore, 'capturayvota', fotoId), {
        votos: increment(1)
      });
    
      // Guardar que el usuario ha votado
      await addDoc(votosRef, { fotoId, usuarioId });
      this.mostrarAlerta('¡Excelente!', 'Voto registrado');
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'alerta-personalizada'
    });
  
    await alert.present();
  }
}
