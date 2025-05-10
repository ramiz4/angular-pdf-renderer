import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [DatePipe, NgFor, NgIf],
})
export class AppComponent {
  title = 'Angular PDF Renderer';

  description = 'This content is rendered from Angular into a PDF.';

  currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  apiData = [
    { id: 1, name: 'Item 1', description: 'Description for Item 1' },
    { id: 2, name: 'Item 2', description: 'Description for Item 2' },
    { id: 3, name: 'Item 3', description: 'Description for Item 3' },
    { id: 4, name: 'Item 4', description: 'Description for Item 4' },
    { id: 5, name: 'Item 5', description: 'Description for Item 5' },
    { id: 6, name: 'Item 6', description: 'Description for Item 6' },
    { id: 7, name: 'Item 7', description: 'Description for Item 7' },
    { id: 8, name: 'Item 8', description: 'Description for Item 8' },
    { id: 9, name: 'Item 9', description: 'Description for Item 9' },
    { id: 10, name: 'Item 10', description: 'Description for Item 10' }
  ];

  fetchData() {
    // Simulate an API call to fetch data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.apiData);
      }, 1000); // Simulate a 1 second delay
    });
  }

  loading = true;

  error = "An error occurred while fetching data.";
}
