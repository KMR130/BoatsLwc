import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import BOAT_TYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__c';
import BOAT_CONTACT_FIELD from '@salesforce/schema/Boat__c.Contact__c';

const boatFields = [BOAT_TYPE_FIELD,BOAT_CONTACT_FIELD];
export default class TypeofBoat extends LightningElement {

    @api recordId; 
	@wire(getRecord, { recordId: '$recordId', fields: boatFields })
    boat;
	get BoatId() {
		return getFieldValue(this.boat.data, BOAT_TYPE_FIELD);
    }
    get ContactId(){
        return getFieldValue(this.boat.data,BOAT_CONTACT_FIELD);
    }
}