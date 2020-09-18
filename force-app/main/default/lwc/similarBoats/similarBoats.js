import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';

export default class SimilarBoats extends NavigationMixin(LightningElement) {
    currentBoat;
    relatedBoats;
    @api boatId;
    error;
    @api similarBy;

    @api
    get recordId() {
        // returns the boatId
        return this.boatId;
    }
    set recordId(value) {
        // sets the boatId value
        // sets the boatId attribute
        this.setAttribute('boatId', value);
        this.boatId = value;
    }

    @wire(getSimilarBoats, { boatId: '$boatId', similarBy: '$similarBy' })
    similarBoats( { error, data } ) {
        if (error) {
            this.error = error.body.message;
        } else {
            this.relatedBoats = data;
        }
    }

    @api get getTitle() {
        return 'Similar boats by ' + this.similarBy;
    }

    @api get noBoats() {
        return !(this.relatedBoats && this.relatedBoats.length > 0);
    }

    openBoatDetailPage(event) {
        console.log(this.boatId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "view",
                recordId: event.detail.boatId,
                objectApiName: "Boat__c"
            }
        });
        console.log(this.recordId+'selected boat id');
    }
}