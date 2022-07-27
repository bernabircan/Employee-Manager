import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{ //bunu implement edince ngOnInıt çalışıyor.
  public employees: Employee[] ; //bu variable './app.component.html' bu templatte kullanıldığında algılanıyor.
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService){} //EmployeeService'ı, AppComponent classına inject ettik.

  ngOnInit(){ //Component çalıştığı anda aşağıdaki fonksiyonu çağırıyor.
    this.getEmployees();
    
  }

  public getEmployees():void {
    this.employeeService.getEmployees().subscribe( //observable olması için bu subscribe'ı kullanıyoz.
      (response : Employee[]) =>{
        this.employees =response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    
  }

  //addForm.value, addForm'un json formatını verir.
  public onAddEmployee(addForm:NgForm): void {
    document.getElementById('add-employee-form').click();
    this.employeeService.addEmployee(addForm.value).subscribe 
    (
      (response : Employee) =>{
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    
    );

  }

  public onUpdateEmployee(employee:Employee): void {
    this.employeeService.updateEmployee(employee).subscribe
    (
      (response : Employee) =>{
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    
    );

  }

  public onDeleteEmployee(employeeId:number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe
    (
      (response : void) =>{
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    
    );

  }

  public searchEmployees(key:string):void{
    const results:Employee[]=[];
    for(const employee of this.employees){
      if(employee.name.toLocaleLowerCase().indexOf(key.toLowerCase())!==-1
      || employee.email.toLocaleLowerCase().indexOf(key.toLowerCase())!==-1
      || employee.phone.toLocaleLowerCase().indexOf(key.toLowerCase())!==-1
      || employee.jobTitle.toLocaleLowerCase().indexOf(key.toLowerCase())!==-1){
        results.push(employee);
      }
    }
    this.employees = results;

  if(results.length ===0 || !key){
    this.getEmployees();
  }
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee; //edit employeye'ye edit butonuna bastığımızda gelen employee atanıyor.
      //böyle yapıyoruz çünkü başlangıçta add yaparken bize employee gelmiyo null geliyo o yüzden onda farklı bir işlem yapıyoruz.
      //bu daha değişiklik yapmadan önceki employee bununla formun eski bilgilerle dolu gelmesini sağlıyoruz.
     button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      //update için anlatılanın aynısı
      this.deleteEmployee = employee;
     
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();
  }
  




}
