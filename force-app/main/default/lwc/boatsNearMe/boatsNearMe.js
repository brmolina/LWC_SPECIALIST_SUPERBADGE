import { api, LightningElement, track, wire } from 'lwc';
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
  
  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation, {latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId'})
  wiredBoatsJSON({error, data}) {
      if(data) {
          console.log('boatsNearMe data: '+data);
          const itemsArr = data.split();
          this.createMapMarkers(itemsArr);
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
  
  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
      if (this.isRendered == false) {
          this.getLocationFromBrowser();
      }
      this.isRendered = true;
   }
  
  // Gets the location from the Browser
  // position => {latitude and longitude}
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
  
  // Creates the map markers
  createMapMarkers(boatData) {
     // const newMarkers = boatData.map(boat => {...});
     console.log('boatData: '+boatData);
     const newMarkers = boatData.map(rowBoat => {
         return {
             location: {
                 Latitude: rowBoat.Geolocation__Latitude__s,
                 Longitude: rowBoat.Geolocation__Longitude__s
             },
             title: rowBoat.Name,
         }
     });
      // newMarkers.unshift({...});
      newMarkers.unshift({
         location: {
             Latitude: this.latitude,
             Longitude: this.longitude
         },
         title: LABEL_YOU_ARE_HERE,
         icon: ICON_STANDARD_USER
     });
     this.isLoading = false;
   }
}
