import { LightningElement, wire } from 'lwc';
import getInitiatives from '@salesforce/apex/InitiativeController.getInitiatives';
import initiativesStatic from '@salesforce/resourceUrl/Initiatives';
 
export default class GreenInitiatives extends LightningElement {
  initiatives = [];
 
  @wire(getInitiatives)
  wiredInitiatives({ data, error }) {
    if (data) {
      this.initiatives = data.map(item => {
        const imageName = item.Name.replace(/\s/g, '') + '.jpeg';
        const imageUrl = `${initiativesStatic}/Initiatives/${imageName}`;
 
        return {
          ...item,
          Image_URL__c: imageUrl
        };
      });
    } else {
      console.error('Error fetching initiatives', error);
    }
  }
}