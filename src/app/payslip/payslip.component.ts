/*This component is responsible for the following:
- Fetching previous payslip data from API to check against user data.
- POST new payslip data.
- Invoke warning, confirmation and info messages to the HTMl template.
*/

import { Component, Input } from '@angular/core';
import { Employee } from '../employee';
import { PaySlip } from '../pay-slip';
import { HttpClient } from '@angular/common/http'
import { error } from 'util';


@Component({
    selector: 'app-payslip',
    templateUrl: './payslip.component.html'
  })

export class PayslipComponent{
  
  //being received from the payroll component.
  @Input() payslipData: PaySlip;
  @Input() enablePayButton: boolean;
  
  dataList: string[] = []; 

  //flag for displaying loading message on template.
  isLoading: boolean = false;

  //API Endpoint:
  URL_PAYSLIP = 'http://localhost:54948/api/PaySlips';
  
  //flags for tracking error messages
  errorForFetching = null;
  errorForPosting = null;

  //flags for displaying messages on template.
  showEmployeeAlreadyPaid: boolean = false;
  showPayslipPostedMessage: boolean = false;


  constructor(private http: HttpClient){

  }

  ngOnInit(){
    
  }


  /*function that makes API call and uses a callback function
    as argument so that processing starts only when all data 
    has been fetched from the API.
  */
  fetchAllData = cb => {
    this.isLoading = true;
    this.http.get(this.URL_PAYSLIP).subscribe(payslip => {
    this.isLoading = false;  
    for(const i in payslip){
        this.dataList.push(payslip[i]);
      }
      cb(true);
    }, error => {
      this.isLoading = false;
      this.errorForFetching = error.message;
    });
  };


  /*Function that gets triggered when the pay button is pressed. 
    It performs the following:
    - First checks if employee has already been paid for the month
    - If not then invoke a function that POSTs the payslip via the API
  */
  onButtonPress(firstNameSearch: string, lastNameSearch: string){
    this.fetchAllData(finishedLoading => {
      if(finishedLoading){
        var dateList: string[] = []; 
      
      //get all paydates with the given name
      for(const eachPayslip in this.dataList){
        if(this.dataList[eachPayslip]["FirstName"] == firstNameSearch && 
        this.dataList[eachPayslip]["LastName"] == lastNameSearch){
          dateList.push(this.dataList[eachPayslip]["PayDate"]);
        }
      }

      //search through the collected date array
      var foundMatchFlag: boolean = false;
      for(const eachDate in dateList){
        console.log(eachDate);
        if(this.compareDate(dateList[eachDate])){
          foundMatchFlag = true;
          break;
      }
      }

      if(foundMatchFlag){
        //alert("This employee has been paid for.");
        this.showEmployeeAlreadyPaid = true;
      }
      else{
        this.onPayButtonPress();
      }
      }
    });
  }

  
  /*Function that returns true if given month and year matches today's 
    month and year.
  */
  private compareDate(d: string){
    var sameDate = false;

    var today = new Date();
    var payDate = new Date(d);
    var mm1 = today.toLocaleString('default', { month: 'long' });
    var yyyy1 = today.getFullYear();
    var mm2 = payDate.toLocaleString('default', { month: 'long' });
    var yyyy2 = payDate.getFullYear();
    
    if(mm1 == mm2 && yyyy1 == yyyy2){
      sameDate = true;
    }

    return sameDate;
  }

  /*Function that POSTs the payslip data via tha API. This gets invoked
    after doing validations when the pay button is pressed.
  */
  private onSendPost(postData: {firstName: string, lastName: string, payDate: string,
  payFrequency: string, annualIncome: number, grossIncome: number, incomeTax: number, netIncome: number,
  superRate: number, pay: number}){
    this.isLoading = true;
    this.http.post(this.URL_PAYSLIP, postData).subscribe(
      responseData => {
        this.isLoading = false;
        this.showPayslipPostedMessage = true;
        console.log(responseData)
      }, error => {
        this.isLoading = false;
        this.errorForPosting = error.message;
      });
  }

  onPayButtonPress(){
    this.onSendPost({firstName: this.payslipData.firstname, lastName: this.payslipData.lastname, 
      payDate: this.payslipData.paydate, payFrequency: "Monthly", annualIncome: parseInt(this.payslipData.annualincome), 
      grossIncome: parseInt(this.payslipData.grossincome), incomeTax: parseInt(this.payslipData.incometax), 
      netIncome: parseInt(this.payslipData.netincome), superRate: parseInt(this.payslipData.superrate), 
      pay: parseInt(this.payslipData.pay)});
  }

  /*Functions for handling dismiss buttons on warnings--------------------------*/

  onHandleFetchError(){
    this.errorForFetching = null;
  }

  onHandlePostError(){
    this.errorForPosting = null;
  }

  onHandleEmployeeAlreadyPaid(){
    this.showEmployeeAlreadyPaid = false;
  }

  onHandlePostedMessage(){
    this.showPayslipPostedMessage = false;
  }
  /*------------------------------------------------------------------------------*/

}