import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResultsComponent} from "./pages/results/results.component";
import {HomeComponent} from "./pages/home/home.component";

const routes: Routes = [
  // Submit new task
  {path: '', component: HomeComponent},
  // Show specific task
  {path: 'results/:chunk', component: ResultsComponent},
  // By default redirect to submit
  // {path: '**', redirectTo: '', pathMatch: 'prefix'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
