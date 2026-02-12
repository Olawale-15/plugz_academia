import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../../../shared/icon/icon.component';
import { TokenService } from '../../../services/token.service';
import { UserContextService } from '../../core/services/user-context';
import { AuthService } from '../../core/services/auth.service copy';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = {
    email: '',
    password: ''
  };

  loading = false;
  loadingMessage = 'Verifying your access...';



  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private userContextService: UserContextService
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const sid = params['sid'];
      if (sid) {
        this.startVerification(sid);
      }
    });
  }
  startVerification(token: string) {
    this.loading = true;

    this.authService.verifyUser(token).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && res.data) {
          // Save important data in session
          this.tokenService.accessToken = res.data.token;
          this.tokenService.refreshToken = res.data.refreshToken;
          this.tokenService.tokenExpiry = res.data.tokenExpiration;
          // Store full user context
          this.userContextService.setUser({
            userId: res.data.userId,
            fullname: res.data.fullname,
            email: res.data.email,
            roleId: res.data.roleId,
            merchantInfo: res.data.merchantInfo,
            serviceInfo: res.data.serviceInfo,
            token: res.data.token
          });
          console.log('User verified and logged in:', res.data);

          this.router.navigate(['/dashboard']);
        } else {
          console.warn('User verification failed:', res.message);
          this.loadingMessage = res.message;
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Verification failed:', err);
        this.loadingMessage = err?.error?.message;
        this.router.navigate(['/login']);

        setTimeout(() => this.router.navigate(['/login']), 20000);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  showPassword = false;
  isLoading = false;


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.email && this.loginForm.password) {
      this.isLoading = true;

      // Simulate login process
      setTimeout(() => {
        this.isLoading = false;
        // Navigate to dashboard after successful login
        this.router.navigate(['/dashboard']);
      }, 2000);
    }
  }

  forgotPassword() {
    // Handle forgot password logic
    console.log('Forgot password clicked');
  }

  signUp() {
    // Handle sign up navigation
    console.log('Sign up clicked');
  }
}
