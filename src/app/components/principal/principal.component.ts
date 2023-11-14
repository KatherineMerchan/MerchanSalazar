import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Estudiante } from 'src/app/interfaces/Estudiante';
import { Opciones } from 'src/app/interfaces/Opciones';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements AfterViewInit {
  form: FormGroup;

  listaEstudiante: Estudiante[] = [];
  dataSource = new MatTableDataSource<Estudiante>();
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido', 'fechaNacimiento', 'genero', 'carrera', 'jornada', 'correo', 'acciones'];
  
  #loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    //this.obtenerMascota();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

    if (this.dataSource.data.length > 0) {
      this.paginator._intl.itemsPerPageLabel = 'Items por pag';
    }
  }

  students: Estudiante[] = [];
  globalAverage: number=0;

  agregarEstudiante(): void {
    
    const cedula = this.form.value.cedula;
      if (this.validarCedulaRepetida(cedula)) {
        this.mensajeError('Cédula duplicada', 'duplicada');
      }  else {
    
       const estudiante: Estudiante = {
        cedula: this.form.value.cedula,
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        nota1: parseFloat(this.form.value.nota1),
        nota2: parseFloat(this.form.value.nota2),
        asistencia: parseFloat(this.form.value.asistencia),
        promedio: 0,
        estado: '', 
       }

       // Calcular el promedio y estado
       estudiante.promedio = (estudiante.nota1 + estudiante.nota2) / 2;
       estudiante.estado = this.calcularEstado(estudiante);
       
       this.listaEstudiante.push(estudiante);
       this.dataSource.data = this.listaEstudiante;
       this.mensajeExito('registrado');
        
       // Se recalcula el promedio global
       this.calculateGlobalAverage();
        
       // Limpiar los campos del formulario
       this.form.reset();
      }
  }

  calcularEstado(estudiante: Estudiante): string {
    if (estudiante.promedio >= 6 && estudiante.asistencia >= 75) {
      return 'Aprobado';
    } else if (estudiante.promedio < 6) {
      return 'Reprobado por nota';
    } else {
      return 'Reprobado por asistencia';
    }
  }

  calculateGlobalAverage() {
    if (this.students.length > 0) {

      // Se calcula el promedio global
      const totalAverage = this.students.reduce((sum, est) => sum + est.promedio, 0);
      this.globalAverage = totalAverage / this.students.length;
    } else {

      // Si no hay estudiantes, el promedio global es 0
      this.globalAverage = 0;
    }
  }
  
  mensajeError(texto: string, tipo: string) {
    let mensaje: string;
  
    if (tipo === 'duplicada') {
      mensaje = 'Cédula duplicada';
    }  else {
      mensaje = 'Error';
    }
  
    this._snackBar.open(mensaje, 'Sistema', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
  
  mensajeExito(texto: string) {
    this._snackBar.open(`El alumno fue ${texto} con exito`, 'Sistema', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  validarCedulaRepetida(cedula: string): boolean {
    return this.listaEstudiante.some(estudiante => estudiante.cedula === cedula);
  }
  

  eliminarEstudiante(cedula: string): void {
    const indice = this.listaEstudiante.findIndex(element => element.cedula == cedula)
    console.log(indice);
    this.listaEstudiante.splice(indice, 1);
    this.dataSource.data = this.listaEstudiante;
  }

  mostrar(element: Estudiante): void {
    console.log(element.nombre);
    console.log(JSON.stringify(element));
    this.router.navigate(['mostrar',JSON.stringify(element)]);
  }

  cancelar(): void {
    this.form.reset();
    //this.router.navigate(['listado']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private aRoute: ActivatedRoute) {

    this.form = this.fb.group({
      cedula: ['',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(/^([0-9])*$/)
        ]
      ],

      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nota1: ['', Validators.required],
      nota2: ['', Validators.required],
      asistencia: ['', Validators.required],
      promedio: ['', Validators.required],
    })

  }

  }