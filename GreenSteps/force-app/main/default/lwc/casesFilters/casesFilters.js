import { LightningElement, track, wire } from 'lwc';
import getPicklistValues from '@salesforce/apex/CaseController.getPicklistValues';
 
export default class CaseFilterParent extends LightningElement {
    @track typeFilter = 'All';
    @track stateFilter = 'All';
    @track statusFilter = 'All';
    @track priorityFilter = 'All';
 
    @track typeOptions = [{ label: 'All', value: 'All' }];
    @track stateOptions = [{ label: 'All', value: 'All' }];
    @track statusOptions = [{ label: 'All', value: 'All' }];
    @track priorityOptions = [{ label: 'All', value: 'All' }];
 
    // Wire service to get picklist values for Type
    @wire(getPicklistValues, { objectName: 'Case', fieldName: 'Type' })
    wiredTypeValues({ data, error }) {
        if (data) {
            this.typeOptions = [{ label: 'All', value: 'All' }, ...data.map(value => ({ label: value, value: value }))];
        } else if (error) {
            console.error('Error fetching Type picklist values', error);
        }
    }
 
    // Wire service to get picklist values for State
    @wire(getPicklistValues, { objectName: 'Case', fieldName: 'State__c' })
    wiredStateValues({ data, error }) {
        if (data) {
            this.stateOptions = [{ label: 'All', value: 'All' }, ...data.map(value => ({ label: value, value: value }))];
        } else if (error) {
            console.error('Error fetching State picklist values', error);
        }
    }
 
    // Wire service to get picklist values for Status
    @wire(getPicklistValues, { objectName: 'Case', fieldName: 'Status' })
    wiredStatusValues({ data, error }) {
        if (data) {
            this.statusOptions = [{ label: 'All', value: 'All' }, ...data.map(value => ({ label: value, value: value }))];
        } else if (error) {
            console.error('Error fetching Status picklist values', error);
        }
    }
 
    // Wire service to get picklist values for Priority
    @wire(getPicklistValues, { objectName: 'Case', fieldName: 'Priority' })
    wiredPriorityValues({ data, error }) {
        if (data) {
            this.priorityOptions = [{ label: 'All', value: 'All' }, ...data.map(value => ({ label: value, value: value }))];
        } else if (error) {
            console.error('Error fetching Priority picklist values', error);
        }
    }
 
    handleFilterChange(event) {
        const { name, value } = event.target;
        this[name + 'Filter'] = value;
    }
 
    handleClearFilters() {
        this.typeFilter = 'All';
        this.stateFilter = 'All';
        this.statusFilter = 'All';
        this.priorityFilter = 'All';
    }
}