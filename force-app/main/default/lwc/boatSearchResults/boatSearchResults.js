import { LightningElement, wire, api, track } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { publish, MessageContext, subscribe } from 'lightning/messageService';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import BOAT_FILTERED_MESSAGE from '@salesforce/messageChannel/BoatFiltersMessageChannel__c';

export default class BoatSearchResults extends LightningElement {
    boatTypeId = '';
    boats;
    @track draftValues = [];
    @track isRendered = false;
    latitude;
    longitude;
    boattypeSubscription;
    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text', editable: 'true' },
        { label: 'Length', fieldName: 'Length__c', type: 'number', editable: 'true' },
        { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: 'true' },
        { label: 'Description', fieldName: 'Description__c', type: 'text', editable: 'true' }
    ];
    /**
  * Load the list of available boats. 
  */
    @wire(getBoats, { boatTypeId: '$boatTypeId' }) 
    boats;
    
    renderedCallback() {
        if (this.isRendered == false) {
            this.getLocationFromBrowser();
        }
        this.isRendered = true;
    }
    getLocationFromBrowser() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            }
        );
    }

    @wire(MessageContext) messageContext;

    // Subscribing the message from boat search from 
    connectedCallback() {
        // Subscribe to ProductSelected message
        this.boattypeSubscription = subscribe(
            this.messageContext,
            BOAT_FILTERED_MESSAGE,
            (message) => this.handleBoatTypeSelected(message.boatTypeId)
        );
    }

    handleBoatTypeSelected(boatTypeId) {
        this.boatTypeId = boatTypeId;
    }

    // publishing message to BoatCard
    handleBoatSelected(event) {
        // Published boatSelected message
        publish(this.messageContext, BoatMC, {
            boatId: event.detail
        });
    }

    handleSave(event) {
        this.notifyLoading(true);
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });

        console.log(recordInputs);
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Ship It!',
                    variant: 'success'
                })
            );
            this.draftValues = [];
            return this.refresh();
        }).catch(error => {
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Contact System Admin!',
                    variant: 'error'
                })
            );
            this.notifyLoading(false);
        }).finally(() => {
            this.draftValues = [];
        });
    }
}