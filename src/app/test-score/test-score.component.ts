import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITest {
  id?: number;
  testName: string;
  pointsPossible: number;
  pointsReceived: number;
  percentage: number;
  grade: string;
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<any> = [];
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  inputName = '';

  async ngOnInit() {
    this.tests = await this.loadTests();
  }

  async loadTestsFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();
  }

  async loadTests() {
    let tests = JSON.parse(localStorage.getItem('tests'));
    if (tests && tests.length > 0) {
    } else {
      tests = await this.loadTestsFromJson();
    }
    this.tests = tests;
    return tests;
  }

  addTest() {
    const test: ITest = {
      id: null,
      testName: null,
      pointsPossible: null,
      pointsReceived: null,
      percentage: null,
      grade: null

    };
    this.tests.unshift(test);
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }

  saveToLocalStorage() {
    localStorage.setItem('tests', JSON.stringify(this.tests));
  }

  deleteTest(index: number) {
    this.tests.splice(index, 1);
    this.saveToLocalStorage();
  }

  save() {
    this.saveToLocalStorage();
    this.toastService.showToast('success', 2000, 'Success: Items saved!');
  }

  calculate() {
    let pointsPossible = 0;
    let pointsReceived = 0;
    let grade = '';
    let totalPercentage = 0;

    for (let i = 0; i < this.tests.length; i++) {
      pointsPossible += this.tests[i].pointsPossible;
      pointsReceived += this.tests[i].pointsReceived;
    }
      totalPercentage = pointsReceived / pointsPossible;
      if ((totalPercentage) >= .9) {
        grade = 'A';
      } else if ((totalPercentage) >= .8) {
        grade = 'B';
      } else if ((totalPercentage) >= .7) {
        grade = 'C';
      } else if ((totalPercentage) >= .6) {
        grade = 'D';
      } else {
        grade = 'F';
      }
    return {
      pointsPossible: pointsPossible,
      pointsReceived: pointsReceived,
      totalPercentage: pointsReceived / pointsPossible,
      grade: grade
    };
  }

  computeGrade() {
    if (this.inputName === '') {
      this.toastService.showToast('warning', 2000, 'Name must not be null');
    } else if (this.inputName.search(', ') === -1) {
      this.toastService.showToast('warning', 2000, 'Name must contain a comma and a space');
    } else {
      const commaIndex = this.inputName.indexOf(', ');
      const firstName = this.inputName.slice(commaIndex + 2, this.inputName.length);
      const lastName = this.inputName.slice(0, commaIndex);
      const data = this.calculate();
      this.inputName = firstName + ' ' + lastName;
      this.router.navigate(['home', data]);
    }
  }















































}
