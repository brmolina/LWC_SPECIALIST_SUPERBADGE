import { LightningElement, wire, track, api } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {

    @api
    selectedBoatTypeId = "";
    value = "";

    //private
    error = undefined;

    //need explicit track due to nested data
    @track searchOptions;
    label;
    //value

    @wire(getBoatTypes)
    boatTypes({error, data}) {
        if(data) {
            this.searchOptions = data.map(type => {
                return {
                    label:type.Name,
                    value:type.Id
                }
            });
            this.searchOptions.unshift({label:'All Types', value: ''});
        } else if (error) {
            this.searchOptions = undefined;
            this.error = error;
        }
    }  
        handleSearchOptionChange(event) {
            //  event.preventDefault();
            // Create the const searchEvent
            //const boatTypeId=event.detail.value;
            this.selectedBoatTypeId=event.detail.value;
            console.log('Selected Boat Type Id', this.selectedBoatTypeId);
            // searchEvent must be the new custom event search
            const searchEvent= new CustomEvent('search',{detail:this.selectedBoatTypeId});
           // const searchEvent = new CustomEvent('search', {        detail: { boatTypeId: this.selectedBoatTypeId }      });
            this.dispatchEvent(searchEvent);
          }
    }
