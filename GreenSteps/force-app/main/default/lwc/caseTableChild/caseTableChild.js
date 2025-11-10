import { LightningElement, api, wire, track } from 'lwc';
import getOfficerCases from '@salesforce/apex/CaseController.getOfficerCases';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CityOfficerCasesTable extends LightningElement {
    @track cases = [];
    @track isModalOpen = false;
    @track selectedCase = {};
    @track error;

    @api typeFilter;
    @api stateFilter;
    @api statusFilter;
    @api priorityFilter;

    @wire(getOfficerCases, {
        type: '$typeFilter',
        state: '$stateFilter',
        status: '$statusFilter',
        priority: '$priorityFilter'
    })
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data.map(caseRecord => ({
                ...caseRecord,
                OwnerName: caseRecord.Owner?.Name,
                ContactName: caseRecord.Contact?.Name,
            }));
        } else if (error) {
            this.error = error.body.message;
            this.showToast('Error', 'Error fetching cases: ' + error.body.message, 'error');
        }
    }

    handleView(event) {
        const caseId = event.target.dataset.id;
        const foundCase = this.cases.find(c => c.Id === caseId);
        if (foundCase) {
            this.selectedCase = { ...foundCase };
            this.isModalOpen = true;
        } else {
            this.showToast('Error', 'Case details not found.', 'error');
        }
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedCase = {};
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}

