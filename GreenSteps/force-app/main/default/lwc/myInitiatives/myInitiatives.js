import { LightningElement, wire } from 'lwc';
import getMyInitiatives from '@salesforce/apex/InitiativeController.getMyInitiatives';
import { refreshApex } from '@salesforce/apex';
import { subscribe, MessageContext } from 'lightning/messageService';
import INITIATIVE_CHANNEL from '@salesforce/messageChannel/initiativeMessageChannel__c';
 
const COLUMNS = [
  { label: 'Initiative Name', fieldName: 'initiativeName' },
  { label: 'Start Date', fieldName: 'startDate', type: 'date' },
  { label: 'End Date', fieldName: 'endDate', type: 'date' },
  { label: 'Status', fieldName: 'status', type: 'picklist' }
];
 
export default class InitiativeList extends LightningElement {
  initiatives = [];
  error;
  columns = COLUMNS;
  wiredInitiativesResult;
 
  @wire(MessageContext)
  messageContext;
 
  @wire(getMyInitiatives)
  wiredInitiatives(result) {
    this.wiredInitiativesResult = result;
    const { data, error } = result;
    if (data) {
      this.initiatives = data.map(item => ({
        id: item.Id,
        initiativeName: item.Related_Initiative__r?.Name,
        status: item.Related_Initiative__r?.Status__c,
        startDate: item.Related_Initiative__r?.Start_Date__c,
        endDate: item.Related_Initiative__r?.End_Date__c
      }));
    } else if (error) {
      this.error = error;
    }
  }
 
  connectedCallback() {
    subscribe(this.messageContext, INITIATIVE_CHANNEL, (message) => {
      this.refreshInitiatives();
    });
  }
 
  refreshInitiatives() {
    refreshApex(this.wiredInitiativesResult);
  }
}