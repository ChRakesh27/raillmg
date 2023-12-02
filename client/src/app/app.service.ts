import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  isUserLoggedIn = false
  constructor() { }
}
