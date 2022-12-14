import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './pages/home/home.component';
import {NavbarComponent} from './navbar/navbar.component';
import {ResultsComponent} from './pages/results/results.component';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {SequenceViewerComponent} from './pages/results/sequence-viewer/sequence-viewer.component';
import {FilterHeaderComponent} from './pages/results/filter-header/filter-header.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ResultsComponent,
    SequenceViewerComponent,
    FilterHeaderComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
