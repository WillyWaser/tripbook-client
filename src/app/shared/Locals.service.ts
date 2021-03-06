import * as Promise from 'bluebird';

import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { httpWrapperService } from './httpWrapper.service';
import { Constants } from './Constants';
import { User } from './models/user.model';
import { Local } from './models/local.model';

@Injectable()
export class LocalsService {

  constructor (private _httpWrapperService: httpWrapperService) {}

  createLocal(city_id: string, description:string = '', quote:string = '', available: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {

      if (!city_id) return reject();

      const payload = {
        local: {
          description,
          quote,
          available,
          city_id
        }
      }
      this._httpWrapperService.post(`${Constants.LOCALS}/`, payload)
      .then(response => resolve(response))
      .catch(error => reject(error));
    });
  }

  getLocalById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (0 > id) return reject();

      this._httpWrapperService.get(`${Constants.LOCALS}/${id}`)
        .then(response => {
          let local: Local = {
            id: response.id,
            available: response.available || false,
            city_id: response.city.id,
            description: response.description || '',
            quote: response.quote || '',
            rating: response.rating || '0',
            review_count: response.review_count || 0,
            area: response.city ? `${response.city.name}, ${response.city.country.name}` : '',
            user: {
              'id': response.user.id,
              'local_id': response.id || '',
              'name': response.user.name || '',
              'lastname': response.user.lastname  || '',
              'email': response.user.email || '',
              'age': response.user.age || '',
              'birthday': response.user.birthday || '',
              'gender': response.user.gender || '',
              'active': response.user.active || '',
              'created_at': response.user.created_at || '',
              'updated_at': response.user.updated_at || '',
              'has_local': response.user.has_local || ''
            }
          };
          return resolve(local);
        }).catch(error => reject(error));
    });
  }

  getLocals(pageId: number = 1, sorting?: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this._httpWrapperService.get(`${Constants.LOCALS}?page=${pageId}${sorting ? '&sort=' + sorting : ''}`)
      .then(response => resolve(response))
      .catch(error => reject(error));
    });
  }

  updateLocal(local: Local): Promise<any> {
    return new Promise((resolve, reject) => {
      let payload = {
        params: {
          local
        }
      };
      this._httpWrapperService.patch(`${Constants.LOCALS}/${local.id}`, payload)
      .then(response => resolve(response))
      .catch(error => reject(error));
    });
  }

  deleteLocal(local: Local): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpWrapperService.delete(`${Constants.LOCALS}/${local.id}`)
      .then(response => resolve(response))
      .catch(error => reject(error));
    });
  }

  searchLocals(keyword?: string, country_id?: string, city_id?: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this._httpWrapperService.get(`${Constants.LOCALS}?${keyword ? 'query=' + keyword + '&' : ''}${country_id ? 'country_id=' + country_id + '&' : ''}${city_id ? 'city_id=' + city_id  + '&': ''}`)
      .then(response => {

          let results = <any>response.locals.map(el => {
            let local: Local = {
              id: el.id,
              available: el.available || false,
              city_id: el.city_id,
              description: el.description || '',
              quote: el.quote || '',
              rating: el.rating || '0',
              review_count: el.review_count || 0,
              area: el.city ? `${el.city.name}, ${el.city.country.name}` : '',
              user: {
                'id': el.user.id,
                'local_id': el.id || '',
                'name': el.user.name || '',
                'lastname': el.user.lastname  || '',
                'email': el.user.email || '',
                'age': el.user.age || '',
                'birthday': el.user.birthday || '',
                'gender': el.user.gender || '',
                'active': el.user.active || '',
                'created_at': el.user.created_at || '',
                'updated_at': el.user.updated_at || '',
                'has_local': response.has_local || ''
              }
            }
            return local;
          });

          return resolve(results);
        }).catch(error => reject(error));
    });
  }

}
