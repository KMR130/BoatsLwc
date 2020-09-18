import { api, LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import labelDetails from "@salesforce/label/c.Details";
import labelReviews from "@salesforce/label/c.Reviews";
import labelAddReview from "@salesforce/label/c.Add_Review";
import labelFullDetails from "@salesforce/label/c.Full_Details";
import labelPleaseSelectABoat from "@salesforce/label/c.Please_select_a_boat";
import BOAT_ID_FIELD from "@salesforce/schema/Boat__c.Id"
import BOAT_NAME_FIELD from "@salesforce/schema/Boat__c.Name"
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {

    @api boatId;

    @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
    wiredRecord;

    label = {
        labelDetails,
        labelReviews,
        labelAddReview,
        labelFullDetails,
        labelPleaseSelectABoat,
    };

    get detailsTabIconName() {
        return this.wiredRecord.data ? 'utility:anchor' : null;
    }

    get boatName() {
        return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
    }

    /** Load context for Ligthning Messaging Service */
    @wire(MessageContext) messageContext;

    /** Subscription for BoatSelected Ligthning message */
    boatSelectionSubscription;

    connectedCallback() {
        // Subscribe to ProductSelected message
        if (this.subscription || this.boatId)
            return;
        this.subscribeMC();
        
    }

    subscribeMC() {
        this.boatSelectionSubscription = subscribe(
            this.messageContext,
            BOATMC,
            (message) => {
                this.boatId = message.boatId
            },
            { scope: APPLICATION_SCOPE }
        );
    }

    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                actionName: "view",
                recordId: this.boatId,
                objectApiName: "Boat__c"
            }
        });
    }

    handleReviewCreated() {
        this.template.querySelector('lightning-tabset').activeTabValue = 'reviews';
        this.template.querySelector('c-boat-reviews').refresh();
    }
}