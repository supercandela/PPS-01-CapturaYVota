import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { collection, collectionData, Firestore, orderBy, query, where } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {
  seleccion: string = '';
  position: LegendPosition = LegendPosition.Below;
  fotos: any[] = [];

  constructor(private route: ActivatedRoute, private location: Location, private firestore: Firestore) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.seleccion = params['seleccion'] || '';
    });

    this.getAllFotos().subscribe(
      (res) => {
        console.log(res);
        this.fotos = res.map((o:any) => { return {name: o.usuario + o.fecha, value: o.votos, extra: o.foto} });
        console.log(this.fotos);
      });
  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }

  getAllFotos(): Observable<any> {
    let col = collection(this.firestore, 'capturayvota');
    const filteredQuery = query(
      col,
      where('seleccion', '==', this.seleccion),
      orderBy('fecha', 'desc')
    );
    const observable = collectionData(filteredQuery, { idField: 'fotoId' });
    return observable;
  }
}
