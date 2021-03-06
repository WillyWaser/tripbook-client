import * as Promise from 'bluebird';

import { Injectable } from '@angular/core';

import { JWTHandlerService } from '../shared/JWTHandler.service';
import { Router } from '@angular/router';
import { ParamsService } from '../shared/params.service';
import { UserService } from '../shared/User.service';

@Injectable()
export class LoginService {
  constructor (private _JWTHandlerService: JWTHandlerService,
               private _Router: Router,
               private _ParamsService: ParamsService,
               private _UserService: UserService) {}

  signUp (name: string, email: string, password: string): Promise<any> {
    return new Promise<any>((resolve,reject) => {


      this._JWTHandlerService.signUp(name, email, password)
        .then(response => {

          this._UserService.defineUser(response.data);
          this._Router.navigateByUrl('/');
          return resolve();
        }).catch(error => reject(error));
    });
  }

  signIn (email: string, password:string): Promise<any> {
    return new Promise<any>((resolve,reject) => {
 
      
      this._JWTHandlerService.signIn(email, password)
        .then(response => {

          this._UserService.defineUser(response.data);
          this._Router.navigateByUrl('/');

          return resolve();
        }).catch(error => reject(error));
    });
  }

  successfulCallback(response: any) {
    if (response.status !== 'success') return;

  }
}
