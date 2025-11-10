import { LightningElement, wire, track } from 'lwc';
import getUserCases from '@salesforce/apex/CaseController.getVolunteerUserCases';

export default class CaseTableApex extends LightningElement {
    @track cases = [];
    @track isModalOpen = false;
    @track selectedCase = {};
    @track error;

     @wire(getUserCases)
        wiredCases({ error, data }) {
            if (data) {
                this.cases = data;
                this.error = undefined;
            } else if (error) {
                this.error = error.body.message;
                this.cases = undefined;
            }
    }

    handleView(event) {
            const caseId = event.target.dataset.id;
            const foundCase = this.cases.find(c => c.Id === caseId);
            if (foundCase) {
                this.selectedCase = { ...foundCase };
                this.isModalOpen = true;
            }
            else {
                this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Case details not found.',
                    variant: 'error'
                })
                );
            }
        }
        
    closeModal() {
            this.isModalOpen = false;
            this.selectedCase = {};
    }
}

