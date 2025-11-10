import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContactDetails from '@salesforce/apex/ContactDetailsController.getContactDetails';
import updateContactDetails from '@salesforce/apex/ContactDetailsController.updateContactDetails';

export default class MyProfilePage extends LightningElement {
    @track contact;
    isEditMode = false;

    @wire(getContactDetails)
    wiredContact({ error, data }) {
        if (data) {
            this.contact = data;
        } else if (error) {
            console.error('Error fetching contact details:', error);
            this.showToast('Error', 'An error occurred while fetching contact details.', 'error');
        }
    }

    toggleEdit() {
        this.isEditMode = !this.isEditMode;
    }

    // Use the spread operator to create a new object, ensuring LWC reactivity
    handleChange(event) {
        const field = event.target.dataset.id;
        const value = event.target.value;
        this.contact = { ...this.contact, [field]: value };
    }    

    async handleSave() {
        try {
            await updateContactDetails({ updatedContact: this.contact });
            this.isEditMode = false;
            this.showToast('Success', 'Contact details saved successfully.', 'success');
        } catch (error) {
            console.error('Error saving contact details:', error);
            this.showToast('Error', 'An error occurred while saving details. Please try again.', 'error');
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}