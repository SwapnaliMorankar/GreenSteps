import { LightningElement, wire, track } from 'lwc';
import getFeedbackWithLookups from '@salesforce/apex/FeedbackController.getFeedbackWithLookups';

export default class FeedbackTable extends LightningElement {
    @track feedbacks = [];
    @track isModalOpen = false;
    @track selectedfeedback = {};
    @track error;

    @wire(getFeedbackWithLookups)
    wiredFeedbacks({ error, data }) {
        if (data) {
            this.feedbacks = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.feedbacks = undefined;
        }
    }

    connectedCallback() {
        getFeedbackWithLookups()
            .then(data => {
                console.log('Feedbacks:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }    

    handleView(event) {
        const feedbackId = event.target.dataset.id;
        const foundfeedback = this.feedbacks.find(f => f.Id === feedbackId);
        if (foundfeedback) {
            this.selectedfeedback = { ...foundfeedback };
            this.isModalOpen = true;
        }
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedfeedback = {};
    }
}
