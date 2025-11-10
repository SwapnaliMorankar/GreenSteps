import { LightningElement, track, wire } from 'lwc';
import raiseIssueImage from '@salesforce/resourceUrl/RaiseIssueImage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import CASE_CHANNEL from '@salesforce/messageChannel/caseMessageChannel__c';

export default class RaiseIssueForm extends LightningElement {
    @track showSuccess = false;
    imageUrl = raiseIssueImage;

    @wire(MessageContext)
    messageContext;

    handleSuccess(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Issue submitted successfully!',
            variant: 'success'
        }));

        this.showSuccess = true;

        // Publish message to notify other components
        publish(this.messageContext, CASE_CHANNEL, { caseCreated: true });

        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => field.reset());
        }
    }

    handleError(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error creating record',
            message: event.detail.detail,
            variant: 'error'
        }));
    }

    handleClose() {
        this.showSuccess = false; // Corrected this line
        this.selectedInitiative = undefined;
    
        const form = this.template.querySelector('.custom-form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }    

}
