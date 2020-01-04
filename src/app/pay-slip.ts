/*
    An Entity class that represents one Payslip
*/

export class PaySlip {
    constructor(
        public firstname: string,
        public lastname: string,
        public paydate: string,
        public payfrequency: string,
        public annualincome: string,
        public grossincome: string,
        public incometax: string,
        public netincome: string,
        public superrate: string,
        public pay: string
    ){}
}