import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import carousel1 from '@salesforce/resourceUrl/carousel1';
import carousel2 from '@salesforce/resourceUrl/carousel2';
import carousel3 from '@salesforce/resourceUrl/carousel3';

export default class FeedbackFormLWC extends LightningElement {
  @track showThankYou = false;
  @track currentSlideIndex = 0;
  @track carouselSlides = [];

  fields = [
    'Green_Initiative__c',
    'Was_the_campaign_informative__c',
    'Was_the_location_clean_and_organized__c',
    'Did_it_encourage_eco_friendly_actions__c',
    'Were_the_volunteers_helpful__c',
    'How_satisfied_are_you_overall__c',
    'Any_Suggestions__c'
  ];

  connectedCallback() {
    this.carouselSlides = [
      { image: carousel1, caption: 'Tip #1: Reduce, Reuse, Recycle ♻️', active: true },
      { image: carousel2, caption: 'Tip #2: Switch to renewable energy ☀️', active: false },
      { image: carousel3, caption: 'Tip #3: Plant and Save Trees ☀️', active: false }
    ];
    this.startCarouselRotation();
  }

  startCarouselRotation() {
    setInterval(() => {
      this.carouselSlides = this.carouselSlides.map((slide, index) => ({
        ...slide,
        active: index === (this.currentSlideIndex + 1) % this.carouselSlides.length
      }));
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.carouselSlides.length;
    }, 5000);
  }

  handleSuccess() {
    this.showThankYou = true;
  }

  handleError(event) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: 'Error',
        message: event.detail.detail || 'There was a problem submitting your feedback.',
        variant: 'error'
      })
    );
  }

  handleClose() {
    this.showThankYou = false;

    const form = this.template.querySelector('.custom-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
