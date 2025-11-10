import { LightningElement, track, wire } from 'lwc';
import registerInitiativeMember from '@salesforce/apex/InitiativeController.registerInitiativeMember';
import getInitiativesForCurrentUserCity from '@salesforce/apex/InitiativeController.getInitiativesForCurrentUserCity';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import RegisterforInitiative from '@salesforce/resourceUrl/RegisterforInitiative';
import { publish, MessageContext } from 'lightning/messageService';
import INITIATIVE_CHANNEL from '@salesforce/messageChannel/initiativeMessageChannel__c'

export default class InitiativeRegistration extends LightningElement {
    @track initiativeOptions = [];
    @track selectedInitiative;
    @track isLoading = false;
    @track showThankYou = false;
    imageUrl = RegisterforInitiative;

    @wire(MessageContext)
    messageContext;

    // Fetch initiatives with valid status
    @wire(getInitiativesForCurrentUserCity)
    wiredInitiatives({ data, error }) {
        if (data) {
            console.log('Fetched Initiatives:', data);
            this.initiativeOptions = data.map(item => ({
                label: item.Name,
                value: item.Id
            }));
        } else if (error) {
            console.error('Error fetching initiatives:', error); 
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error loading initiatives',
                message: error.body?.message || 'Unknown error',
                variant: 'error'
            }));
        }
    }

    handlePicklistChange(event) {
        this.selectedInitiative = event.detail.value;
    }

    handleRegister() {
        if (!this.selectedInitiative) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Please select an initiative',
                variant: 'error'
            }));
            return;
        }
    
        this.isLoading = true;
        registerInitiativeMember({ initiativeId: this.selectedInitiative })
            .then(() => {
                this.showThankYou = true;
                this.selectedInitiative = undefined;
    
                // 🔔 Publish message to trigger refresh in InitiativeList
                publish(this.messageContext, INITIATIVE_CHANNEL, {
                    action: 'refresh'
                });
            })
            .catch(error => {
                let errorMessage = error.body?.message || 'Unknown server error';
    
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Registration failed',
                    message: errorMessage,
                    variant: 'error'
                }));
                console.error(error);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }    

    handleClose() {
        this.showThankYou = false;
        this.selectedInitiative = undefined;
 
        const form = this.template.querySelector('.custom-form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }
}


