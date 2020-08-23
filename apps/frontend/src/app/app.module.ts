import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsRouterPluginModule } from "@ngxs/router-plugin";
import { NgxsModule } from "@ngxs/store";
import { environment } from "../environments/environment";

import { AppComponent } from "./app.component";
import { AppState } from "./store/app.state";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: "enabled" }),
    NgxsModule.forRoot([AppState], {
      developmentMode: !environment.production
    }),
    NgxsFormPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    // keep after all business relevant plugins
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    // keep last
    NgxsLoggerPluginModule.forRoot({ disabled: true }),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
