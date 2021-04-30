import { LightningElement, track, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'

 // imports
 export default class BoatSearch extends NavigationMixin(LightningElement) {
    @track isLoading = false;

    @track selectedBoatTypeId;
    
    // Handles loading event
    handleLoading(event) {
        this.isLoading = true;
     }
    
    // Handles done loading event
    handleDoneLoading(event) {
        this.isLoading = false;
     }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) {
        this.selectedBoatTypeId = event.detail;

        console.log('boatSearch.js BoatTypeId from parent: '+ this.selectedBoatTypeId);

        this.template.querySelector('c-boat-search-results').searchBoats(this.selectedBoatTypeId);
     }
    
    createNewBoat() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            },
        });
     }
  }
  