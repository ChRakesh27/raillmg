import { localStorageService } from "./local-storage.service";
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: "root" })
export class authGuard implements CanActivate {
    constructor(private router: Router, private ls: localStorageService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.ls.getUser()) {
            return true
        } else {
            this.router.navigate(['/login'])
            return false
        }
    }
}

