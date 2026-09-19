import * as stylex from '@stylexjs/stylex';
import { GoogleIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RoleSelector } from '@/app/components/RoleSelector';
import { login } from '@/lib/auth/actions';
import { formStyles } from '@/styles/form.stylex';
import { landingStyles } from '@/styles/landing.stylex';
import { colors } from '@/styles/tokens.stylex';

export function SignInPanel() {
  return (
    <section
      id="sign-in"
      {...stylex.props(landingStyles.rightSide)}
      aria-labelledby="sign-in-title"
    >
      <div {...stylex.props(landingStyles.spacingBottom)}>
        <p {...stylex.props(landingStyles.signInEyebrow)}>Already have an account?</p>
        <h2 id="sign-in-title" {...stylex.props(landingStyles.signInTitle)}>
          Come on in.
        </h2>
        <p {...stylex.props(landingStyles.signInDescription)}>
          Sign in and pick up right where you left off.
        </p>
        <p {...stylex.props(landingStyles.note)}>Pick your path and let&apos;s get moving.</p>
      </div>

      <form action={login} {...stylex.props(landingStyles.signInForm)}>
        <div {...stylex.props(landingStyles.signInRole)}>
          <RoleSelector />
        </div>

        <div {...stylex.props(landingStyles.signInFields)}>
          <label {...stylex.props(formStyles.field)}>
            <span {...stylex.props(formStyles.label)}>Email</span>
            <Input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label {...stylex.props(formStyles.field)}>
            <span {...stylex.props(formStyles.label)}>Password</span>
            <Input name="password" type="password" placeholder="Your secret flow" required />
          </label>
          <Button
            type="submit"
            size="md"
            className={stylex.props(landingStyles.signInButton).className}
          >
            Let&apos;s go!
          </Button>

          <div {...stylex.props(landingStyles.socialDivider)}>
            <span>OR</span>
          </div>

          <div {...stylex.props(landingStyles.socialButtons)}>
            <Button
              type="submit"
              formNoValidate
              name="provider"
              value="google"
              variant="outline"
              size="md"
              aria-label="Continue with Google"
            >
              <GoogleIcon size={22} strokeWidth={6} color={colors.primary} />
              Continue with Google
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
