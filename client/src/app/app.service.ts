import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  API_HOST = 'https://raillmg-server.onrender.com/api';

  userData = {}
  isUserLoggedIn$ = new Subject<boolean>()

  constructor(private httpClient: HttpClient) { }

  setIsUserLoggedIn(data) {
    this.userData = data
  }


  loginUser(username, password): Observable<any> {
    return this.httpClient.get<any>(`${this.API_HOST}/users?username=${username}&password=${password}`)
  }

  register(data): Observable<any> {
    return this.httpClient.post(this.API_HOST + "/users", data)
  }

  getMachineRoll(id): Observable<any> {
    return this.httpClient.get(`${this.API_HOST}/machineRolls?user=${id}`)
  }

  setMachineRoll(data): Observable<any> {
    console.log("🚀 ~ data:", data)
    return this.httpClient.post(this.API_HOST + "/machineRolls", data)
  }

}
