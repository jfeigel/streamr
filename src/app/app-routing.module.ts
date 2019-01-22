import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { CallbackComponent } from './callback/callback.component';
import { LoginComponent } from './login/login.component';
import { StreamrComponent } from './streamr/streamr.component';

const routes: Routes = [
  { path: 'callback', component: CallbackComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: StreamrComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
