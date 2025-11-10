import { LightningElement } from 'lwc';
import awareCitizenImage from '@salesforce/resourceUrl/AwareCitizen';
import activeVolunteerImage from '@salesforce/resourceUrl/ActiveVolunteer';

export default class GreenStepsJoinCard extends LightningElement {
    awareCitizenImage = awareCitizenImage;
    activeVolunteerImage = activeVolunteerImage;

    
    navigateToLogin() {
        window.location.href = '/Greenstepss/s/login/';
    }

}
