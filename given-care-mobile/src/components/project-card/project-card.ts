import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

/*
  Generated class for the MyAppsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'project-card.html',
  selector: 'project-card'
})
export class ProjectCardComponent {

  @Input() project;


  constructor(public userService: UserService)
  {

  }

  ngAfterViewInit(){
    // get rate project
    this.userService.getRate(this.project._id)
      .then((rate: any) => {
        this.project.rate = rate.json().rate;
      }, (err: any) => {
        delete this.project.rate;
        console.log(err);
      });

  }
  rate(event){
    // set rate project
  }


}
