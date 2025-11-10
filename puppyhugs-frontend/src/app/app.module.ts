import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// --- VERIFICA ESTAS IMPORTACIONES ---
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // <-- ¡MUY IMPORTANTE!
import { AppRoutingModule } from './app-routing.module';

// --- VERIFICA LOS COMPONENTES ---
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component'; // <-- ¿Está importado?
import { RegisterComponent } from './register/register.component'; // <-- ¿Está importado?
// (Aquí irán todos tus demás componentes)


@NgModule({
  declarations: [
    AppComponent,
    // --- ASEGÚRATE DE QUE ESTÁN AQUÍ ---
    LoginComponent,
    RegisterComponent
    // (etc...)
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // --- ASEGÚRATE DE QUE ESTÁN AQUÍ ---
    HttpClientModule,
    ReactiveFormsModule // <-- Si falta esto, ¡tendrás página en blanco!
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
