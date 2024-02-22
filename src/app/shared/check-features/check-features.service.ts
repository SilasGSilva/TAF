import { Injectable } from '@angular/core';
import { Feature } from '../../models/feature';

@Injectable({
  providedIn: 'root',
})
export class CheckFeaturesService {
  public feature: Feature;

  public checkBrand() {
    const erpAppConfig = JSON.parse(sessionStorage.getItem('ERPAPPCONFIG'));
    return erpAppConfig.productLine.toLowerCase() === 'datasul';
  }

  public getFeature(featureName: String): Feature {
    const isBrandDatasul = this.checkBrand();
    if (typeof sessionStorage['TAFFeatures'] !== 'undefined') {
      const listFeatures = JSON.parse(sessionStorage.getItem('TAFFeatures'));

      for (const key in listFeatures) {
        if (key === featureName) {
          return (this.feature = {
            access: listFeatures[key].access,
            message: atob(listFeatures[key].message)
          });
        }
      }
      return (this.feature = {
        access: false,
        message: 'Função não disponível'
      });
    } else {
      if (isBrandDatasul) {
        return (this.feature = {
          access: false,
          message: 'Função não disponível para linha Datasul'
        });
      } else {
        return (this.feature = {
          access: false,
          message: 'Função não disponível'
        });
      }
    }
  }
}
