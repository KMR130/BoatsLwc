import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountData.getAccounts'; 

export default class AccountsList extends LightningElement {

    @track Accounts;

    @wire(getAccounts)
    Accounts

}