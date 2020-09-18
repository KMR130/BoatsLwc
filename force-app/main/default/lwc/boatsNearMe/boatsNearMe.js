import { LightningElement, track, wire, api } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
    
    @api boatTypeId;
    @track mapMarkers = [];
    @track isLoading = true;
    @track isRendered = false;
    latitude;
    longitude;
    @wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId' })
    wiredBoatsJSON({ error, data }) {
        if (data) {
            this.createMapMarkers(data);
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: ERROR_TITLE,
                    message: error.body.message,
                    variant: ERROR_VARIANT
                })
            );
            this.isLoading = false;
        }
    }
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
            },
            (e) => {

            }, {
            enableHighAccuracy: true
        }
        );
    }
    createMapMarkers(boatData) {
        const boats = JSON.parse(boatData);
        this.mapMarkers = boats.map(boat => {
            const Latitude = boat.Geolocation__Latitude__s;
            const Longitude = boat.Geolocation__Longitude__s;
            return {
                location: { Latitude, Longitude },
                title: boat.Name,
                description: `Coords: ${Latitude}, ${Longitude}`,
                icon: 'utility:anchor'
            };
        });
        this.mapMarkers.unshift({
            location: {
                Latitude: this.latitude,
                Longitude: this.longitude
            },
            title: 'You are here!',
            icon: 'utility:resource_territory'
        });
        this.isLoading = false;
    }
}