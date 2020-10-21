import { LightningElement, wire, track } from "lwc";
import getBoatTypes from "@salesforce/apex/BoatDataService.getBoatTypes";
import BOAT_FILTERED_MESSAGE from '@salesforce/messageChannel/BoatFiltersMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';
export default class BoatSearchForm extends LightningElement {

    @track selectedBoatTypeId = "";
    @track error = undefined;
    @track searchOptions;
    @wire(getBoatTypes)
    boatTypes({ error, data }) {
        if (data) {
            this.searchOptions = data.map((type) => {
                return {
                    label: type.Name,
                    value: type.Id
                };
            });
            this.searchOptions.unshift({ label: "All Types", value: "" });
        } else if (error) {
            this.searchOptions = undefined;
            this.error = error;
        }
    }
    @wire(MessageContext) messageContext;
        
    handleSearchOptionChange(event) {
        this.selectedBoatTypeId = event.detail.value;
        
         publish(this.messageContext, BOAT_FILTERED_MESSAGE, {
                boatTypeId: this.selectedBoatTypeId
        });
    }
}