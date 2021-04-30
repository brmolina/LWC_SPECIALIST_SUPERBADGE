import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { APPLICATION_SCOPE, createMessageContext, MessageContext, publish, releaseMessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

// Declare the const LONGITUDE_FIELD for the boat's Longitude__s
// Declare the const LATITUDE_FIELD for the boat's Latitude
// Declare the const BOAT_FIELDS as a list of [LONGITUDE_FIELD, LATITUDE_FIELD];
const LONGITUDE_FIELD ='Boat__c.Geolocation__Longitude__s';
const LATITUDE_FIELD = 'Boat__c.Geolocation__Latitude__s';
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];
export default class BoatMap extends LightningElement {
  // private
  subscription = null;
  @api boatId;

  // Getter and Setter to allow for logic to run on recordId change
  // this getter must be public
  @api get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute('boatId', value);
    this.boatId = value;
  }

  error = undefined;
  mapMarkers = [];

  // Initialize messageContext for Message Service


  // Getting record's location to construct map markers using recordId
  // Wire the getRecord method using ('$boatId')
  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS})
  wiredRecord({ error, data }) {
    // Error handling
    if (data) {
      debugger;
      console.log('data: '+ data);
      this.error = undefined;
      console.log('data 2: ');
      const longitude = parseFloat(data.fields.Geolocation__Longitude__s.value);
      console.log('data 3: ');
      const latitude = parseFloat(data.fields.Geolocation__Latitude__s.value);
      console.log('data 4: ');
      this.updateMap(longitude, latitude);
    } else if (error) {
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }

  @wire(MessageContext)
  messageContext;


  // Runs when component is connected, subscribes to BoatMC
  connectedCallback() {
    console.log('data 7: ');
    // recordId is populated on Record Pages, and this component
    // should not update when this component is on a record page.
    if (this.subscription || this.recordId) {
      return;
    }
    // Subscribe to the message channel to retrieve the recordID and assign it to boatId.
    this.subscribeMC();
  }

  subscribeMC() {
    console.log('data 8: ');
    let subscription = subscribe(this.messageContext, BOATMC, (message) => { this.boatId = message.recordId }, { scope: APPLICATION_SCOPE });
    }

  handleMessage(message) {
    console.log('data 6: ');
    this.boatId = message.recordId;
  }

  // Creates the map markers array with the current boat's location for the map.
  updateMap(Longitude, Latitude) {
    console.log('data 5: ');
    this.mapMarkers = [{
      location: {
          Latitude: Latitude,
          Longitude: Longitude
      }
  }];
  }

  // Getter method for displaying the map component, or a helper method.
  get showMap() {
    return this.mapMarkers.length > 0;
  }
}