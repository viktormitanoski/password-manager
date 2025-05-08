import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold text-success" to="/">
            PasswordVault | Secure Your Passwords
          </Link>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Sign Up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container text-center py-5">
        <h1 className="display-4 mb-3 text-success fw-bold">Secure Your Digital Life</h1>
        <p className="lead mb-4">
          Store your passwords safely in one place. Generate strong credentials.
          Access them securely — anytime, anywhere.
        </p>
        <Link to="/register" className="btn btn-success btn-lg rounded-pill px-4 mb-5">
          Get Started
        </Link>

        <div className="mb-5">
          <div className="row align-items-center mb-5">
            <div className="col-md-6 text-md-start text-center">
              <h2 className="h4 fw-bold">How It Works</h2>
              <p>
                PasswordVault is a secure password manager that allows you to store your login
                credentials in a protected digital vault. After registering and logging in, you can
                create entries for different websites, including email, social media, and other online
                services.
              </p>
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6 offset-md-6 text-md-end text-center">
              <h2 className="h4 fw-bold">Technologies Used</h2>
              <p>
                This application is built using React for the front-end interface and Spring Boot
                for the backend API. It uses MySQL to store user data securely, and communicates
                via RESTful APIs using JWT for authentication.
              </p>
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6 text-md-start text-center">
              <h2 className="h4 fw-bold">Encryption & Security</h2>
              <p>
                Passwords are encrypted using AES (Advanced Encryption Standard).
              </p>
              <p>
                JWT tokens are used to authenticate requests, expire automatically, and protect
                user sessions.
              </p>
            </div>
          </div>

          <div className="row align-items-center mb-5">
            <div className="col-md-6 offset-md-6 text-md-end text-center">
              <h2 className="h4 fw-bold">Password Generation</h2>
              <p>
                Use our built-in generator to create strong passwords. Customize the character
                set, adjust the length, and use it directly during registration or while adding
                new entries to your vault.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-light text-center py-4 border-top mt-5">
        <small className="text-muted">
          &copy; {new Date().getFullYear()} Password Vault. All rights reserved.
        </small>
      </footer>
    </>
  );
}