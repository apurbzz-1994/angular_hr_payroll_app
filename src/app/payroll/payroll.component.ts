/*
This component is primarily responsible for performing all the
salary related calculations and then send the results over to the 
payslip component for displaying to the user.

*/


import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from '../employee';
import { PaySlip } from '../pay-slip';
import { parse } from 'querystring';

@Component({
    selector: 'app-payroll',
    templateUrl: './payroll.component.html',
    styleUrls: ['./payroll.component.css']
  })

export class PayrollComponent{

    isSubmitted: boolean = false;
    enablePayButton: boolean = false;

    /*Object structure for reference--------------*/

    // employee = {
    //     firstname: '',
    //     lastname: '',
    //     annualsalary: '',
    //     superrate: ''
    // };

    // payslipdata = {
    //     paydate: '',
    //     payfrequency: '',
    //     annualincome: '',
    //     grossincome: '',
    //     incometax: '',
    //     netincome: '',
    //     super: '',
    //     pay: ''
    //   };

    /*---------------------------------------------*/

    employeeData = new Employee('','','','');
    payslipData = new PaySlip('','','','','','','','','','');
        
    /*This function gets triggered when the "Generate Payslip" button is pressed.*/ 
    onGeneratePress(form: NgForm){
        console.log(this.employeeData);
        this.enablePayButton = true;
        
        //setting values which does not require calculations
        this.payslipData.firstname = this.employeeData.firstname;
        this.payslipData.lastname = this.employeeData.lastname;
        this.payslipData.annualincome = this.employeeData.annualsalary;
        
        
        //function calls for each calculation
        this.getPayDate();
        this.getGrossIncome();
        this.getIncomeTax(parseFloat(this.payslipData.annualincome));
        this.getNetIncome();
        this.getSuperAmount();
        this.getPayAmount();
    }

    private getPayDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = today.toLocaleString('default', { month: 'long' });
        var yyyy = today.getFullYear();
    
        var todayString = dd + " " + mm + " " + yyyy;
        this.payslipData.paydate = todayString;
    }

    private getGrossIncome(){
        var grossIncome = Math.round((parseFloat(this.employeeData.annualsalary) / 12));
        this.payslipData.grossincome = String(grossIncome);
    }


    private returnIncomeTaxInstance(fixedAmount: number, income: number, lowRange: number, multiplier: number){
        var incomeTax = ((fixedAmount + ((income - lowRange)*multiplier))/12);
        return incomeTax;
    }

    private getIncomeTax(annualIncome: number){
        var calculatedTax = 0;
        if(annualIncome>=0 && annualIncome<=18200){
            calculatedTax = 0;
        }
        else if(annualIncome>=18201 && annualIncome<=37000){
            calculatedTax = this.returnIncomeTaxInstance(0,annualIncome,18200,0.19);
        }
        else if(annualIncome>=37001 && annualIncome<=80000){
            calculatedTax = this.returnIncomeTaxInstance(3572, annualIncome, 37000, 0.325);
        }
        else if(annualIncome>=80001 && annualIncome<=180000){
            calculatedTax = this.returnIncomeTaxInstance(17547, annualIncome, 80000,0.37);
        }
        else{
            calculatedTax = this.returnIncomeTaxInstance(54547, annualIncome, 180000,0.45);
        }

        this.payslipData.incometax = String(Math.round(calculatedTax));
    }

    private getNetIncome(){
        var netIncome = parseFloat(this.payslipData.grossincome) - parseFloat(this.payslipData.incometax);
        this.payslipData.netincome = String(Math.round(netIncome));
    }

    private getSuperAmount(){
        var superAmount = (parseFloat(this.payslipData.grossincome)*(parseFloat(this.employeeData.superrate)/100));
        this.payslipData.superrate = String(Math.round(superAmount));
    }

    private getPayAmount(){
        var payAmount = (parseFloat(this.payslipData.netincome) - parseFloat(this.payslipData.superrate));
        this.payslipData.pay = String(Math.round(payAmount));
    }

    
      
}