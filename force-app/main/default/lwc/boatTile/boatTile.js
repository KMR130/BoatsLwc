import { LightningElement, api} from "lwc";
const TILE_WRAPPER_SELECTED_CLASS = "tile-wrapper selected";
const TILE_WRAPPER_UNSELECTED_CLASS = "tile-wrapper";
export default class BoatTile extends LightningElement {
    
@api boat;
@api selectedBoatId;

get backgroundStyle() {
    return `background-image:url(${this.boat.Picture__c})`;   
}
get tileClass() {
    return this.selectedBoatId ? TILE_WRAPPER_SELECTED_CLASS : TILE_WRAPPER_UNSELECTED_CLASS;
}

selectBoat() {
    const selectedEvent = new CustomEvent('selected', {
        detail: this.boat.Id
    });
    this.dispatchEvent(selectedEvent);
}
}