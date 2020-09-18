import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { subscribe, MessageContext } from 'lightning/messageService';
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c';

// Utils to extract field values
import { getFieldValue } from 'lightning/uiRecordApi';

// Boat__c Schema
import BOAT_OBJECT from '@salesforce/schema/Boat__c';
import NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import TYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__c';
import CONTACT_FIELD from '@salesforce/schema/Boat__c.Contact__c';
import LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import PICTURE_FIELD from '@salesforce/schema/Boat__c.Picture__c';
import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import BUILT_YEAR_FIELD from '@salesforce/schema/Boat__c.Year_Built__c';
import GEOLOCATION_FIELD from '@salesforce/schema/Boat__c.Geolocation__c'; 
/**
 * Component to display details of a Boat__c.
 */
export default class BoatCard extends NavigationMixin(LightningElement) {

    mapMarkers=[];

    // Exposing fields to make them available in the template
    typeField = TYPE_FIELD;
    contactField = CONTACT_FIELD;
    lengthField = LENGTH_FIELD; 
    priceField = PRICE_FIELD;
    builtyearField = BUILT_YEAR_FIELD;
    geolocation = GEOLOCATION_FIELD;

    recordId;

    // boat fields displayed with specific format
    boatName;
    boatPictureUrl;

    // @wire(getAllboatsReviews) 
    // reviews;

    // @wire(getAllReviews, { boatId: '$recordId' })
    // reviews;
    /** Load context for Ligthning Messaging Service */
    @wire(MessageContext) messageContext;

    /** Subscription for BoatSelected Ligthning message */
    boatSelectionSubscription;

    connectedCallback() {
        // Subscribe to ProductSelected message
        this.boatSelectionSubscription = subscribe(
            this.messageContext,
            BoatMC,
            (message) => this.handleBoatSelected(message.boatId)
        );
    }

    handleBoatSelected(boatId) {
        this.recordId = boatId;
    }

    handleRecordLoaded(event) {
        const { records } = event.detail;
        const recordData = records[this.recordId];
        this.boatName = getFieldValue(recordData, NAME_FIELD);
        this.boatPictureUrl = getFieldValue(recordData, PICTURE_FIELD);
    }
    
    /**
     * Handler for when a product is selected. When `this.recordId` changes, the
     * lightning-record-view-form component will detect the change and provision new data.
     */
    

    handleNavigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: BOAT_OBJECT.objectApiName,
                actionName: 'view'
            }
        });
    }

    // navigateToNewReviewPage(){
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__objectPage',
    //         attributes: {
    //             recordId: this.recordId,
    //             objectApiName: 'BoatReview__c',
    //             actionName: 'new'
    //         },
    //     });
    // }
}
