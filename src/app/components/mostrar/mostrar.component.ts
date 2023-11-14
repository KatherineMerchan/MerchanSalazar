import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Estudiante } from 'src/app/interfaces/Estudiante';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html',
  styleUrls: ['./mostrar.component.css']
})
export class MostrarComponent {
  estudiante: Estudiante;
  constructor(private route: ActivatedRoute) { 
   
   const valor= route.snapshot.paramMap.get('element')!;
   
   console.log(valor);

   this.estudiante =JSON.parse(valor);
   console.log(this.estudiante.apellido);

  }
}
