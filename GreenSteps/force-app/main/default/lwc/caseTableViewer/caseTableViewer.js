import { LightningElement, wire, track } from 'lwc';
import getUserCases from '@salesforce/apex/CaseController.getUserCases';
import { refreshApex } from '@salesforce/apex';
import { subscribe, MessageContext } from 'lightning/messageService';
import CASE_CHANNEL from '@salesforce/messageChannel/caseMessageChannel__c';

export default class CaseTableApex extends LightningElement {
    @track cases;
    @track error;
    @track selectedCase = {};
    @track isModalOpen = false;

    wiredCasesResult;

    @wire(MessageContext)
    messageContext;

    @wire(getUserCases)
    wiredCases(result) {
        this.wiredCasesResult = result;
        const { data, error } = result;
        if (data) {
            this.cases = data;
            this.error = undefined;
        } else if (error) {
            this.error = error.body.message;
            this.cases = undefined;
        }
    }

    connectedCallback() {
        subscribe(this.messageContext, CASE_CHANNEL, (message) => {
            if (message.caseCreated) {
                this.refreshCases();
            }
        });
    }
    

    refreshCases() {
        refreshApex(this.wiredCasesResult);
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
