import { Component, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';

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
  isNew = false;

  constructor(public userService: UserService, public projectService: ProjectService)
  {

  }

  ngOnInit(){
    // get rate project
    this.userService.getRate(this.project._id)
      .then((rate: any) => {
        this.project.rate = rate.json().rate;
      }, (err: any) => {
        delete this.project.rate;
        this.isNew = true;
      });

      this.getDistribution();

  }

  getDistribution(){

    this.projectService.getDistribution(this.project._id)
      .then((resp: any) => {
        this.project.distribution = resp.json().total;
      }, (err: any) => {
        delete this.project.distribution;
      });

  }

  rate(event){
    console.log(this.project);
    this.userService.setRate(this.project._id, this.project.rate, this.isNew).then((res) => {
      this.isNew = false;
      this.getDistribution();
    });
  }


}
