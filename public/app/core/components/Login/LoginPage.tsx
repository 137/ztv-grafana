import React, { FC } from 'react';
import { UserSignup } from './UserSignup';
import { LoginServiceButtons } from './LoginServiceButtons';
import LoginCtrl from './LoginCtrl';
import { LoginForm } from './LoginForm';
import { ChangePassword } from './ChangePassword';
import { CSSTransition } from 'react-transition-group';

export const LoginPage: FC = () => {
  return (
    <div className="login container">
      <div className="login-content">
        <div className="login-branding">
          <img className="logo-icon" src="public/img/iptv_icon.png" alt="IPTV监控平台" />
          <div className="logo-wordmark" />
        </div>
        <LoginCtrl>
          {({
            loginHint,
            passwordHint,
            isOauthEnabled,
            ldapEnabled,
            authProxyEnabled,
            disableLoginForm,
            disableUserSignUp,
            login,
            isLoggingIn,
            changePassword,
            skipPasswordChange,
            isChangingPassword,
          }) => (
            <div className="login-outer-box">
              <div className={`login-inner-box ${isChangingPassword ? 'hidden' : ''}`} id="login-view">
                {!disableLoginForm ? (
                  <LoginForm
                    displayForgotPassword={!(ldapEnabled || authProxyEnabled)}
                    onSubmit={login}
                    loginHint={loginHint}
                    passwordHint={passwordHint}
                    isLoggingIn={isLoggingIn}
                  />
                ) : null}

                {isOauthEnabled ? (
                  <>
                    <div className="text-center login-divider">
                      <div>
                        <div className="login-divider-line" />
                      </div>
                      <div>
                        <span className="login-divider-text">{disableLoginForm ? null : <span>or</span>}</span>
                      </div>
                      <div>
                        <div className="login-divider-line" />
                      </div>
                    </div>
                    <div className="clearfix" />

                    <LoginServiceButtons />
                  </>
                ) : null}
                {!disableUserSignUp ? <UserSignup /> : null}
              </div>
              <CSSTransition
                appear={true}
                mountOnEnter={true}
                in={isChangingPassword}
                timeout={250}
                classNames="login-inner-box"
              >
                <ChangePassword onSubmit={changePassword} onSkip={skipPasswordChange} focus={isChangingPassword} />
              </CSSTransition>
            </div>
          )}
        </LoginCtrl>

        <div className="clearfix" />
      </div>
    </div>
  );
};
