import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import USER_TYPE_FIELD from '@salesforce/schema/Contact.User_Type__c';
import STATE_TYPE_FIELD from '@salesforce/schema/Contact.State__c';
import CITY_TYPE_FIELD from '@salesforce/schema/Contact.City__c';
 
export default class RegistrationForm extends LightningElement {
    userTypeOptions;
    stateOptions;
    cityOptions;
 
    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT })
    contactObjectInfo;
 
    @wire(getPicklistValues, {
        recordTypeId: '$contactObjectInfo.data.defaultRecordTypeId',
        fieldApiName: USER_TYPE_FIELD
    })
    wiredUserTypePicklist({ error, data }) {
        if (data) {
            this.userTypeOptions = data.values;
        } else if (error) {
            console.error('Error fetching User Type picklist values', error);
        }
    }
 
    @wire(getPicklistValues, {
        recordTypeId: '$contactObjectInfo.data.defaultRecordTypeId',
        fieldApiName: STATE_TYPE_FIELD
    })
    wiredStatePicklist({ error, data }) {
        if (data) {
            this.stateOptions = data.values;
        } else if (error) {
            console.error('Error fetching State picklist values', error);
        }
    }
 
    @wire(getPicklistValues, {
        recordTypeId: '$contactObjectInfo.data.defaultRecordTypeId',
        fieldApiName: CITY_TYPE_FIELD
    })
    wiredCityPicklist({ error, data }) {
        if (data) {
            this.cityOptions = data.values;
        } else if (error) {
            console.error('Error fetching City picklist values', error);
        }
    }
 
    handleSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Congratulations!!! You have been successfully registered.',
                variant: 'success'
            })
        );
 
        this.template.querySelector('lightning-record-edit-form').reset();
    }
}