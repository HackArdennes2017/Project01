import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProjectService } from '../../services/project.service'

@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html'
})
export class ProjectsPage {

  projects;
  index;
  constructor(public navCtrl: NavController, public navParams: NavParams, public projectService: ProjectService) {

  }

  ngOnInit(){
    this.index = 0;

    this.projectService.getAll().then((resp: any) => {
      this.projects = resp.json().data;
    })

  }

  next(){
    this.index++;
  }

}
